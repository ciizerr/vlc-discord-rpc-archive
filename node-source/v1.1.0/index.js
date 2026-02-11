const axios = require('axios');
const RPC = require('discord-rpc');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// --- Configuration ---
const CLIENT_ID = '1465711556418474148'; // Default Client ID
const VLC_PASSWORD = ':1234'; // Default Password
const VLC_PORT = 8080;
const POLLING_INTERVAL = 1000; // 1 second
const ERROR_RETRY_INTERVAL = 2000; // 2 seconds

// --- Globals ---
const imageCache = new Map(); // path -> url
let lastActivity = {};
let lastState = "";
let rpcClient = null;
let isRpcConnected = false;

// --- Helpers ---

function getAudioLanguages(json) {
    const activeLangs = [];
    const allLangs = [];

    // VLC JSON streams are under keys specifically "information" > "category" > "Stream N" usually, 
    // but the C++ code parses the flat JSON response directly or assumes a specific structure.
    // Let's look at standard VLC http requests/status.json output.
    // Actually, the C++ code iterates strict keys "Stream 0", "Stream 1" etc from the root or a substructure.
    // The VLC status.json usually contains "information" -> "category" -> "Stream N".
    // I will try to follow the C++ logic which seems to search for "Stream N" keys in the standard JSON structure provided by VLC's HTTP interface.
    // However, axios returns a JS object.
    
    // In VLC's status.json, stream info is typically deeply nested:
    // json.information.category["Stream N"]
    
    const category = json.information?.category || {};
    
    for (const [key, stream] of Object.entries(category)) {
        if (!key.startsWith('Stream ')) continue;
        
        if (stream.Type === 'Audio') {
            const lang = stream.Language;
            if (lang) {
                let shortLang = lang.substring(0, 2).toLowerCase();
                if (!allLangs.includes(shortLang)) allLangs.push(shortLang);
                
                // rudimentary check for "active" based on Decoded_format presence in C++ logic
                if (stream.Decoded_format || stream.Decoded_channels) {
                    if (!activeLangs.includes(shortLang)) activeLangs.push(shortLang);
                }
            }
        }
    }
    
    const targetList = activeLangs.length > 0 ? activeLangs : allLangs;
    return targetList.join(' | ');
}

function getQualityTags(json) {
    let tags = [];
    const category = json.information?.category || {};

    for (const [key, stream] of Object.entries(category)) {
        if (!key.startsWith('Stream ')) continue;
        
        if (stream.Type === 'Video') {
            // Resolution
            const res = stream.Video_resolution;
            if (res) {
                const xPos = res.indexOf('x');
                if (xPos !== -1) {
                    const width = parseInt(res.substring(0, xPos));
                    if (width >= 3800) tags.push("4K");
                    else if (width >= 2500) tags.push("2K");
                    else if (width >= 1900) tags.push("1080p");
                    else if (width >= 1200) tags.push("720p");
                    else tags.push("SD");
                }
            }
            
            // HDR
            const color = stream.Color_primaries || "";
            const transfer = stream.Color_transfer_function || "";
            let isHDR = false;
            if (color.includes("2020")) isHDR = true;
            if (transfer.includes("PQ")) isHDR = true;
            if (transfer.includes("HLG")) isHDR = true;
            if (transfer.includes("2084")) isHDR = true;
            
            if (isHDR) tags.push("HDR");
            
            break; // Stop after first video stream
        }
    }
    return tags.join(' ' + "\u25CF" + ' '); // Sep
}

function detectActivityType(filename, quality) {
    if (quality) return 3; // Watching

    const ext = path.extname(filename).toLowerCase();
    const audioExts = ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg', '.wma', '.opus'];
    const videoExts = ['.mkv', '.mp4', '.avi', '.mov', '.wmv', '.webm', '.m4v'];

    if (audioExts.includes(ext)) return 2; // Listening
    if (videoExts.includes(ext)) return 3; // Watching
    return 0; // Playing
}

function generateButtonUrl(query, provider = "Google", customUrl = "") {
    let base = "https://www.google.com/search?q=";
    if (provider === "Bing") base = "https://www.bing.com/search?q=";
    else if (provider === "IMDb") base = "https://www.imdb.com/find/?q=";
    else if (provider === "YouTube") base = "https://www.youtube.com/results?search_query=";
    else if (provider === "Custom") base = customUrl;
    
    if (!query) query = "VLC Media Player";
    return base + encodeURIComponent(query);
}

async function uploadTo0x0st(fileUrl) {
    try {
        let filePath = decodeURIComponent(fileUrl.replace('file:///', ''));
        // Windows path fix
        // VLC file urls might be "file:///C:/path/to/file" -> "C:/path/to/file"
        // or "file:///path/to/file" (linux/mac)
        
        // Handle slashes
        if (process.platform === 'win32') {
             // If it starts with /C:/, remove leading /
             if (filePath.startsWith('/') && filePath.includes(':')) {
                 filePath = filePath.substring(1);
             }
             filePath = filePath.replace(/\//g, '\\');
        }

        if (imageCache.has(filePath)) {
            return imageCache.get(filePath);
        }

        if (!fs.existsSync(filePath)) return null;

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://0x0.st', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (response.status === 200 && response.data) {
            const url = response.data.trim();
            imageCache.set(filePath, url);
            return url;
        }
    } catch (error) {
        console.error("Upload failed:", error.message);
    }
    return null;
}

// --- Main Logic ---

async function updateActivity() {
    try {
        const auth = Buffer.from(VLC_PASSWORD).toString('base64');
        const response = await axios.get(`http://127.0.0.1:${VLC_PORT}/requests/status.json`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        const json = response.data;
        const stateStr = json.state; // 'playing', 'paused', 'stopped'

        // Helpers to extract meta safely
        const meta = json.information?.category?.meta || {};
        const getMeta = (key) => meta[key] || "";

        if (stateStr === 'stopped') {
            if (lastState !== 'stopped') {
                 // Clear or set Idle
                 if (rpcClient) {
                     await rpcClient.setActivity({
                         details: "Idling",
                         state: "Waiting for media...",
                         largeImageKey: "vlc_icon",
                         largeImageText: "VLC Media Player",
                         smallImageKey: "stop_icon",
                         smallImageText: "Stopped",
                         instance: false,
                     });
                 }
                 lastState = 'stopped';
            }
            return;
        }

        // Playing or Paused
        const filename = getMeta('filename') || json.information?.title || "Unknown"; // Fallback
        const showName = getMeta('showName'); // Custom meta? VLC standard is usually 'Show Name' or similar, but key might be strict.
                                              // C++ code used ExtractString(json, "showName"). 
                                              // In VLC meta, keys are often parameterized.
                                              // Let's assume standard keys first.
        
        // C++ code extracted "showName", "seasonNumber", "episodeNumber" which might be specific to some extensions or metadata libs.
        // We will try to find them in meta object.
        const title = getMeta('title');
        const artist = getMeta('artist');
        const album = getMeta('album');
        const artworkUrl = getMeta('artwork_url');
        const season = getMeta('seasonNumber') || getMeta('season');
        const episode = getMeta('episodeNumber') || getMeta('episode');

        const length = json.length; // seconds
        const time = json.time; // seconds
        const position = json.position; // 0.0 - 1.0

        const quality = getQualityTags(json);
        const audio = getAudioLanguages(json);
        const activityType = detectActivityType(filename, quality);

        // Construct strings
        let top = "";
        let bot = "";
        let query = "";
        let largeText = "VLC Media Player";
        let activityName = "VLC Media Player";

        const SEP = " \u25CF ";

        if (activityType === 2) { // Listening
            activityName = title || filename;
            top = activityName;
            query = `${activityName} ${artist}`;
            
            if (artist) bot = `by ${artist}`;
            else if (album) bot = album;
            else bot = "Music";
            
            largeText = album || "Listening to Music";

        } else { // Watching / Playing
             if (showName && episode) {
                 activityName = showName;
                 top = showName;
                 if (quality) top += SEP + quality;
                 
                 bot = `S${season}E${episode}`;
                 // Chapter?
                 if (audio) bot += SEP + audio;
                 
                 query = `${showName} S${season}E${episode}`;
                 largeText = "Watching TV Show";
             } else if (title) {
                 activityName = title;
                 top = title;
                 if (quality) top += SEP + quality;
                 // Chapter?
                 if (audio) bot += SEP + audio;
                 else bot = "Video";
                 
                 query = title;
                 largeText = "Watching Movie";
             } else {
                 activityName = filename;
                 top = filename;
                 if (quality) top += SEP + quality;
                 bot = "Video";
                 query = filename;
                 largeText = "Watching Video";
             }
        }

        // Image Logic
        let displayImage = 'vlc_icon';
        if (artworkUrl && artworkUrl.startsWith('file://')) {
             const uploaded = await uploadTo0x0st(artworkUrl);
             if (uploaded) displayImage = uploaded;
        }

        // Button
        const btnUrl = generateButtonUrl(query);

        // Update RPC
        if (rpcClient) {
            const activity = {
                details: top,
                state: `${bot} (${stateStr === 'playing' ? 'Playing' : 'Paused'})`,
                largeImageKey: displayImage,
                largeImageText: largeText,
                smallImageKey: stateStr === 'playing' ? 'play_icon' : 'pause_icon',
                smallImageText: stateStr === 'playing' ? 'Playing' : 'Paused',
                instance: false,
                buttons: [
                    { label: "Search This", url: btnUrl }
                ]
            };
            
            if (stateStr === 'playing') {
                const now = Date.now();
                const startTimestamp = now - (time * 1000);
                const endTimestamp = startTimestamp + (length * 1000);
                activity.startTimestamp = startTimestamp;
                activity.endTimestamp = endTimestamp;
            }

            // Only update if changed (RPC client handles some of this, but logic here helps)
            // Simplified for Node: just setActivity. Discord-RPC limits rate automatically.
            await rpcClient.setActivity(activity);
        }
        
        lastState = stateStr;

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            // VLC not running
            if (lastState !== 'offline') {
                console.log("Waiting for VLC...");
                if (rpcClient) await rpcClient.clearActivity();
                lastState = 'offline';
            }
        } else {
            console.error("Error polling VLC:", error.message);
        }
    }
}

// --- Init ---

async function init() {
    rpcClient = new RPC.Client({ transport: 'ipc' });

    rpcClient.on('ready', () => {
        console.log('Discord RPC Connected!');
        isRpcConnected = true;
        
        setInterval(updateActivity, POLLING_INTERVAL);
    });

    try {
        await rpcClient.login({ clientId: CLIENT_ID });
    } catch (err) {
        console.error("Failed to connect to Discord:", err.message);
        setTimeout(init, 5000); // Retry RPC connection
    }
}

init();
