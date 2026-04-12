const axios = require('axios');
const RPC = require('discord-rpc');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const notifier = require('node-notifier');

// --- Load Configuration ---
let config = {};
try {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
} catch (e) {
    console.warn("Failed to load config.json, using defaults.");
}

const CLIENT_ID = config.CLIENT_ID || '1465711556418474148';
const VLC_PASSWORD = config.VLC_PASSWORD || ':1234';
const VLC_PORT = config.VLC_PORT || 8080;
const POLLING_INTERVAL = config.POLLING_INTERVAL || 1000;
const SHOW_COVER_ART = config.SHOW_COVER_ART !== undefined ? config.SHOW_COVER_ART : true;
const THEME = config.THEME || '';
const PROVIDER = config.PROVIDER || 'Google';
const CUSTOM_URL = config.CUSTOM_URL || '';
const BUTTON_LABEL = config.BUTTON_LABEL || 'Search This';
const CUSTOM_JUNK_WORDS = config.CUSTOM_JUNK_WORDS || [];

// v1.1.4 Added Settings
const SHOW_NOTIFICATIONS = config.SHOW_NOTIFICATIONS !== undefined ? config.SHOW_NOTIFICATIONS : false;
const MINIMAL_MODE = config.MINIMAL_MODE !== undefined ? config.MINIMAL_MODE : false;
const ENABLE_METADATA_CLEANER = config.ENABLE_METADATA_CLEANER !== undefined ? config.ENABLE_METADATA_CLEANER : true;
const STRICT_LOCAL_MODE = config.STRICT_LOCAL_MODE !== undefined ? config.STRICT_LOCAL_MODE : false;
const SHOW_QUALITY_TAGS = config.SHOW_QUALITY_TAGS !== undefined ? config.SHOW_QUALITY_TAGS : true;
const SHOW_CHAPTER = config.SHOW_CHAPTER !== undefined ? config.SHOW_CHAPTER : true;
const SHOW_AUDIO_LANGUAGE = config.SHOW_AUDIO_LANGUAGE !== undefined ? config.SHOW_AUDIO_LANGUAGE : true;

// --- Globals ---
const imageCache = new Map(); // path/key -> url
let lastActivity = {};
let lastState = "";
let rpcClient = null;
let isRpcConnected = false;
let anchorStart = 0;
let lastDisplayImage = "";
let lastPlaying = false;
let lastTop = "";
let lastBot = "";
let lastActivityType = 0;
let heartbeat = 0;
let lastNotifiedTop = "";

const SEP = " \u25CF ";

// Caches for CPU fix
let _cleanCache = new Map();

// --- Dynamic Filter Syncer ---
let dynamicFilters = {
    sites: [
        "olamovies", "vegamovies", "moviesmod", "katmoviehd", "mkvcinemas", 
        "filmyzilla", "filmywap", "1tamilmv", "jiorockers", "ibomma", "yts", 
        "yify", "psa", "qxr", "tigole", "rarbg", "pahe", "pagalworld", "mrjatt", 
        "djpunjab", "wapking", "songspk", "djmaza", "pendujatt", "naasongs", 
        "masstamilan", "jiosaavn"
    ],
    tlds: [
        ".top", ".com", ".net", ".org", ".in", ".nl", ".is", ".to", ".pw", 
        ".cc", ".site", ".info", ".biz", ".co", ".nz", ".uk", ".mx", ".ws", ".pro" 
    ],
    scene: [
        "2160p", "1080p", "720p", "480p", "4k", "bluray", "web-dl", "webrip", "hdrip", "camrip", "brrip"
    ],
    words: [
        "downloaded from", "download from", "shared by", "brought to you by", "visit website",
        "downloaded", "download", "320kbps", "128kbps", "kbps", "official video", "lyric video", 
        "ringtone", "full song", "x264", "x265", "hevc", "10bit", "site"
    ]
};

async function fetchRemoteFilters() {
    if (STRICT_LOCAL_MODE || !ENABLE_METADATA_CLEANER) return;
    try {
        const url = "https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/assets/filters.txt";
        const res = await axios.get(url, { timeout: 3000 });
        const content = res.data;
        let pSites = [], pTlds = [], pScene = [], pWords = [];
        let currentMode = "";
        
        for (const rawLine of content.split('\n')) {
            const line = rawLine.trim();
            if (!line) continue;
            if (line === "[SITES]") { currentMode = "sites"; continue; }
            if (line === "[TLDS]") { currentMode = "tlds"; continue; }
            if (line === "[SCENE]") { currentMode = "scene"; continue; }
            if (line === "[WORDS]") { currentMode = "words"; continue; }
            if (line.startsWith('[')) { currentMode = ""; continue; }
            
            if (currentMode === "sites") pSites.push(line);
            else if (currentMode === "tlds") pTlds.push(line);
            else if (currentMode === "scene") pScene.push(line);
            else if (currentMode === "words") pWords.push(line);
        }
        if (pSites.length) dynamicFilters.sites = pSites;
        if (pTlds.length) dynamicFilters.tlds = pTlds;
        if (pScene.length) dynamicFilters.scene = pScene;
        if (pWords.length) dynamicFilters.words = pWords;
    } catch (e) {
        console.log("Failed to fetch remote filters. Using local filters fallback.", e.message);
    }
}

// --- String & Metadata Helpers ---

function extractYear(filename) {
    if (!filename) return "";
    for (let i = 0; i + 3 < filename.length; i++) {
        if ((filename[i] === '1' && filename[i+1] === '9') || 
            (filename[i] === '2' && filename[i+1] === '0')) {
            if (/\d/.test(filename[i+2]) && /\d/.test(filename[i+3])) {
                let validStart = (i === 0 || !/\d/.test(filename[i-1]));
                let validEnd = (i + 4 === filename.length || !/\d/.test(filename[i+4]));
                if (validStart && validEnd) {
                    return filename.substring(i, i + 4);
                }
            }
        }
    }
    return "";
}

function cleanMetadata(text, customJunk = []) {
    if (!text) return "";
    if (!ENABLE_METADATA_CLEANER) return text;
    if (_cleanCache.has(text)) return _cleanCache.get(text);

    // 1. Strip everything inside []
    let noBrackets = "";
    let inBracket = false;
    for (const c of text) {
        if (c === '[') inBracket = true;
        else if (c === ']') { inBracket = false; continue; }
        if (!inBracket) noBrackets += c;
    }

    // 2. Erase media extensions
    const dot = noBrackets.lastIndexOf('.');
    if (dot !== -1) {
        const ext = noBrackets.substring(dot).toLowerCase();
        if (['.mp3', '.mkv', '.mp4', '.avi', '.flac', '.m4a', '.wav'].includes(ext)) {
            noBrackets = noBrackets.substring(0, dot);
        }
    }

    // 3. The URL Assassin (Dynamic)
    let lowerText = noBrackets.toLowerCase();
    for (const site of dynamicFilters.sites) {
        for (const tld of dynamicFilters.tlds) {
            const url = site + tld;
            let pos;
            while ((pos = lowerText.indexOf(url)) !== -1) {
                noBrackets = noBrackets.substring(0, pos) + ' '.repeat(url.length) + noBrackets.substring(pos + url.length);
                lowerText = lowerText.substring(0, pos) + ' '.repeat(url.length) + lowerText.substring(pos + url.length);
            }
        }
    }

    // 4. Replace Periods (.) and Underscores (_) with Spaces
    let arr = noBrackets.split('');
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '.' || arr[i] === '_' || arr[i] === '~') arr[i] = ' ';
    }
    noBrackets = arr.join('');
    lowerText = noBrackets.toLowerCase();

    // 5. The Scene Truncator (Dynamic)
    for (const tag of dynamicFilters.scene) {
        const pos = lowerText.indexOf(tag);
        if (pos !== -1) {
            noBrackets = noBrackets.substring(0, pos);
            lowerText = lowerText.substring(0, pos);
        }
    }

    // 6. Phrase & Standard Junk Word Removal (Dynamic)
    const junkWords = [...dynamicFilters.words, ...customJunk];
    let result = noBrackets;
    for (const word of junkWords) {
        if (!word) continue;
        const wLower = word.toLowerCase();
        while (true) {
            lowerText = result.toLowerCase();
            const pos = lowerText.indexOf(wLower);
            if (pos === -1) break;
            result = result.substring(0, pos) + " " + result.substring(pos + wLower.length);
        }
    }

    // 7. Replace remaining double spaces
    let finalClean = result.replace(/\s+/g, ' ');
    
    // 8. Trim edges of " " and "-"
    finalClean = finalClean.replace(/^[\s-]+|[\s-]+$/g, '');
    
    _cleanCache.set(text, finalClean);
    if (_cleanCache.size > 100) {
        const firstKey = _cleanCache.keys().next().value;
        _cleanCache.delete(firstKey);
    }
    return finalClean;
}

// ... Network Helpers ...

async function findExternalArtwork(type, queryTitle, querySub, isTv = false) {
    if (!queryTitle) return "";

    const cacheKey = `EXT_${type}_${queryTitle}${querySub}${isTv ? "_TV" : ""}`;
    if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

    const suffix = type === 2 ? " song cover art" : " movie poster";
    const term = encodeURIComponent(`${queryTitle} ${querySub || ''}${suffix}`);
    const url = `https://www.bing.com/images/search?q=${term}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 3000
        });

        const html = response.data;
        const searchToken = 'id=OIP.';
        const startIdx = html.indexOf(searchToken);

        if (startIdx !== -1) {
            const start = startIdx + 3;
            let end = html.indexOf('"', start);
            const endAmp = html.indexOf('&', start);
            if (endAmp !== -1 && endAmp < end) end = endAmp;

            if (end !== -1) {
                const imageId = html.substring(start, end);
                const finalUrl = `https://tse1.mm.bing.net/th?id=${imageId}&w=512&h=512&c=1`;
                imageCache.set(cacheKey, finalUrl);
                return finalUrl;
            }
        }
    } catch (e) {
        console.error("External artwork fetch failed:", e.message);
    }
    
    imageCache.set(cacheKey, ""); // Cache failure
    return "";
}

async function uploadToUguu(fileUrl) {
    try {
        let filePath = decodeURIComponent(fileUrl.replace('file:///', ''));
        if (process.platform === 'win32') {
             if (filePath.startsWith('/') && filePath.includes(':')) {
                 filePath = filePath.substring(1);
             }
             filePath = filePath.replace(/\//g, '\\');
        }

        if (imageCache.has(filePath)) return imageCache.get(filePath);
        if (!fs.existsSync(filePath)) return null;

        const form = new FormData();
        form.append('files[]', fs.createReadStream(filePath));

        const response = await axios.post('https://uguu.se/upload.php', form, {
            headers: { ...form.getHeaders() },
            timeout: 10000 
        });

        if (response.status === 200 && response.data && response.data.success && response.data.files && response.data.files.length > 0) {
            const url = response.data.files[0].url;
            imageCache.set(filePath, url);
            return url;
        }
    } catch (error) {
        console.error("Upload failed to Uguu:", error.message);
    }
    return null;
}

// ... Logic Helpers ...

function getAudioLanguages(json) {
    const activeLangs = [];
    const allLangs = [];
    const category = json.information?.category || {};
    
    for (const [key, stream] of Object.entries(category)) {
        if (!key.startsWith('Stream ')) continue;
        if (stream.Type === 'Audio') {
            const lang = stream.Language;
            if (lang) {
                let shortLang = lang.substring(0, 2).toLowerCase();
                if (!allLangs.includes(shortLang)) allLangs.push(shortLang);
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
            const color = stream.Color_primaries || "";
            const transfer = stream.Color_transfer_function || "";
            let isHDR = false;
            if (color.includes("2020")) isHDR = true;
            if (transfer.includes("PQ")) isHDR = true;
            if (transfer.includes("HLG")) isHDR = true;
            if (transfer.includes("2084")) isHDR = true;
            if (isHDR) tags.push("HDR");
            break; 
        }
    }
    return tags.join(SEP);
}

function detectActivityType(filename, quality) {
    if (quality) return 3; // Watching

    const ext = path.extname(filename || "").toLowerCase();
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

// --- Main Worker Logging ---

async function updateActivity() {
    try {
        const auth = Buffer.from(VLC_PASSWORD).toString('base64');
        const response = await axios.get(`http://127.0.0.1:${VLC_PORT}/requests/status.json`, {
            headers: { 'Authorization': `Basic ${auth}` },
            timeout: 2000
        });

        const json = response.data;
        const stateStr = json.state; // 'playing', 'paused', 'stopped'
        const meta = json.information?.category?.meta || {};
        const getMeta = (key) => meta[key] || "";

        const assetLarge = THEME + "vlc_icon";
        const assetPlay = THEME + "play_icon";
        const assetPause = THEME + "pause_icon";
        const assetStop = THEME + "stop_icon";

        if (stateStr === 'stopped') {
            if (lastState !== 'stopped') {
                 if (isRpcConnected && rpcClient) {
                     await rpcClient.setActivity({
                         details: "Idling",
                         state: "Waiting for media...",
                         largeImageKey: assetLarge,
                         largeImageText: "VLC Media Player",
                         smallImageKey: MINIMAL_MODE ? undefined : assetStop,
                         smallImageText: MINIMAL_MODE ? undefined : "Stopped",
                         instance: false,
                     });
                 }
                 lastState = 'stopped';
            }
            return;
        }

        // Playing or Paused
        let rawFilename = getMeta('filename');
        if (!rawFilename) rawFilename = json.information?.title || "Unknown";
        rawFilename = rawFilename.replace(/file:\/\/\/.*[\\\/]/, '');

        const rawTitle = getMeta('title');
        const showName = getMeta('showName');
        const rawArtist = getMeta('artist');
        const album = getMeta('album');
        const artworkUrl = getMeta('artwork_url');
        const season = getMeta('seasonNumber') || getMeta('season');
        const episode = getMeta('episodeNumber') || getMeta('episode');
        
        let date = getMeta('date');
        if (!date) date = extractYear(rawFilename);

        const length = json.length; 
        const time = json.time; 
        const isPlaying = (stateStr === 'playing');

        const quality = SHOW_QUALITY_TAGS ? getQualityTags(json) : "";
        const audio = SHOW_AUDIO_LANGUAGE ? getAudioLanguages(json) : "";
        const activityType = detectActivityType(rawFilename, quality);

        // Clean Strings
        const filenameClean = cleanMetadata(rawFilename, CUSTOM_JUNK_WORDS);
        const filename = filenameClean || rawFilename;

        const titleClean = cleanMetadata(rawTitle, CUSTOM_JUNK_WORDS);
        const title = titleClean || filename;

        const artistClean = cleanMetadata(rawArtist, CUSTOM_JUNK_WORDS);
        const artist = artistClean || rawArtist;

        let top = "";
        let bot = "";
        let query = "";
        let largeText = "VLC Media Player";
        let activityName = "";
        let isTv = false;

        if (activityType === 2) { 
            activityName = title || filename;
            top = activityName; 
            query = `${activityName} ${artist}`;

            if (artist) bot = `by ${artist}`;
            else if (album) bot = album;
            else bot = "Music";
            
            largeText = album || "Listening to VLC";

        } else { 
            const chapterNum = parseInt(getMeta('chapter')) || parseInt(json.information?.category?.root?.chapter) || -1;
            const chapterStr = (SHOW_CHAPTER && chapterNum > -1) ? `Ch ${chapterNum}` : "";
            
            if (showName && episode) {
                isTv = true;
                const showClean = cleanMetadata(showName, CUSTOM_JUNK_WORDS);
                activityName = showClean || showName;
                top = activityName;
                if (quality) top += SEP + quality;
                bot = `S${season} E${episode}`;
                if (chapterStr) bot += SEP + chapterStr;
                if (audio) bot += SEP + audio;
                query = `${activityName} S${season}E${episode}`;
                largeText = "Watching TV Show";
            } 
            else if (rawTitle) {
                activityName = title;
                top = title;
                if (quality) top += SEP + quality;
                bot = "Video";
                if (chapterStr) bot += SEP + chapterStr;
                if (audio) bot += SEP + audio;
                query = title;
                largeText = "Watching Movie";
            }
            else {
                activityName = filename;
                top = filename;
                if (quality) top += SEP + quality;
                bot = "Video";
                if (chapterStr) bot += SEP + chapterStr;
                if (audio) bot += SEP + audio;
                query = filename;
                largeText = "Watching Video";
            }
        }

        if (!activityName) activityName = "VLC Media Player";

        let displayImage = assetLarge; 

        if (SHOW_COVER_ART) {
            if (artworkUrl) {
                if (artworkUrl.startsWith("file://")) {
                    const uploaded = await uploadToUguu(artworkUrl);
                    if (uploaded && uploaded.startsWith("http")) {
                        displayImage = uploaded;
                    }
                } else if (artworkUrl.startsWith("http")) {
                    displayImage = artworkUrl;
                }
            }
            
            if (displayImage === assetLarge && (activityType === 2 || activityType === 3)) {
                const queryTitle = activityType === 2 ? (title || filename) : activityName;
                const querySub = activityType === 2 ? artist : date;
                
                const externalArt = await findExternalArtwork(activityType, queryTitle, querySub, isTv);
                if (externalArt && externalArt.startsWith("http")) {
                    displayImage = externalArt;
                }
            }
        }

        // Time logic (drift detection)
        const now = Date.now();
        const cStart = now - (time * 1000);
        const cEnd = cStart + (length * 1000);

        let drift = Math.abs(cStart - anchorStart);

        const textChg = (top !== lastTop || bot !== lastBot);
        const stateChg = (isPlaying !== lastPlaying);
        const typeChg = (activityType !== lastActivityType);
        const artChg = (displayImage !== lastDisplayImage);
        const majorDrift = (drift > 3000); 
        const force = (heartbeat > 30);

        if (textChg || stateChg || typeChg || artChg || majorDrift || force) { 
            anchorStart = cStart; 
            
            if (isRpcConnected && rpcClient) {
                const state = isPlaying ? "Playing" : "Paused";
                const btnUrl = generateButtonUrl(query, PROVIDER, CUSTOM_URL);
                
                const formattedState = bot ? `${bot} ${SEP} ${state}` : state;

                const activityObj = {
                    details: top,
                    state: formattedState,
                    largeImageKey: displayImage,
                    largeImageText: largeText,
                    instance: false,
                    buttons: [
                        { label: BUTTON_LABEL.substring(0, 30), url: btnUrl }
                    ]
                };

                if (!MINIMAL_MODE) {
                    activityObj.smallImageKey = isPlaying ? assetPlay : assetPause;
                    activityObj.smallImageText = state;
                }
                
                if (isPlaying && length > 0) {
                    activityObj.startTimestamp = cStart;
                    activityObj.endTimestamp = cEnd;
                }

                try {
                    await rpcClient.setActivity(activityObj);
                    
                    if (SHOW_NOTIFICATIONS && isPlaying && top && top !== lastNotifiedTop) {
                        lastNotifiedTop = top;
                        const iconPath = path.join(__dirname, '..', '..', 'assets', 'vlc-discord-icon.ico');
                        notifier.notify({
                            title: top,
                            message: bot || "VLC Media Player",
                            icon: fs.existsSync(iconPath) ? iconPath : undefined,
                            appID: "VLC Discord RPC"
                        });
                    }

                    lastTop = top; 
                    lastBot = bot; 
                    lastPlaying = isPlaying; 
                    lastActivityType = activityType; 
                    lastDisplayImage = displayImage; 
                    heartbeat = 0; 
                    lastState = stateStr;
                } catch (e) {
                    console.error("Failed to set activity:", e.message);
                }
            }
        } else {
            heartbeat++;
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            if (lastState !== 'offline') {
                console.log("Waiting for VLC...");
                if (isRpcConnected && rpcClient) {
                    try { await rpcClient.clearActivity(); } catch (e) {}
                }
                lastState = 'offline';
            }
        } else {
            // Silently ignore minor polling errors to avoid console spam
        }
    }
}

// --- Init ---

async function init() {
    await fetchRemoteFilters(); // Wait for filters before running
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
        setTimeout(init, 5000); 
    }
}

init();
