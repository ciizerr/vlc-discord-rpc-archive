const rpc = require('discord-rpc');
const axios = require('axios');

// =============================================================
// ⚙️ CONFIGURATION
// =============================================================
const CLIENT_ID = '1465711556418474148'; // Default Client ID
const VLC_PASSWORD = '1234';
const VLC_PORT = 8080;
const VLC_HOST = '127.0.0.1';

// Theme Config (Empty for default, 'dark_' for dark theme)
const THEME_PREFIX = ''; 
const PROVIDER = 'Google'; // Google, Bing, IMDb, YouTube, Custom
const CUSTOM_URL = '';
const BUTTON_LABEL = 'Search This';

const POLL_INTERVAL = 1000; // 1 second

// =============================================================
// 1. HELPERS
// =============================================================

function cleanString(str) {
    if (!str) return "";
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
}

function getAudioLanguages(json) {
    let activeLangs = [];
    let allLangs = [];

    // Check up to 60 streams
    for (let i = 0; i < 60; i++) {
        const stream = json[`Stream ${i}`];
        if (!stream) continue;

        if (stream.Type === 'Audio') {
            let lang = stream.Language;
            if (lang) {
                // Normalize to 2 chars lowercase
                let shortLang = lang.substring(0, 2).toLowerCase();
                
                if (!allLangs.includes(shortLang)) {
                    allLangs.push(shortLang);
                }

                // Check for decoded format to guess active stream
                // Note: VLC json api is a bit limited, this logic mirrors the C++ mod
                if (stream.Decoded_format || stream.Decoded_channels) {
                    if (!activeLangs.includes(shortLang)) {
                        activeLangs.push(shortLang);
                    }
                }
            }
        }
    }

    const targetList = activeLangs.length > 0 ? activeLangs : allLangs;
    return targetList.join(' | ');
}

function getQualityTags(json) {
    let tags = [];
    const stream0 = json['Stream 0']; // Usually video
    
    if (stream0 && stream0.Video_resolution) {
        const res = stream0.Video_resolution;
        const xPos = res.indexOf('x');
        if (xPos !== -1) {
            const width = parseInt(res.substring(0, xPos));
            if (width >= 3800) tags.push('4K');
            else if (width >= 2500) tags.push('2K');
            else if (width >= 1900) tags.push('1080p');
            else if (width >= 1200) tags.push('720p');
            else tags.push('SD');
        }
    }

    if (stream0) {
        const color = stream0.Color_primaries || '';
        const transfer = stream0.Color_transfer_function || '';
        const isHDR = color.includes('2020') || transfer.includes('PQ') || transfer.includes('HLG');
        if (isHDR) tags.push('HDR');
    }

    return tags.join(' ● ');
}

function generateButtonUrl(query, provider, customUrl) {
    if (!query) query = "VLC Media Player";
    const encoded = encodeURIComponent(query);
    
    switch (provider) {
        case 'Bing': return `https://www.bing.com/search?q=${encoded}`;
        case 'IMDb': return `https://www.imdb.com/find/?q=${encoded}`;
        case 'YouTube': return `https://www.youtube.com/results?search_query=${encoded}`;
        case 'Custom': return customUrl || `https://www.google.com/search?q=${encoded}`;
        case 'Google': 
        default: return `https://www.google.com/search?q=${encoded}`;
    }
}

// =============================================================
// 2. MAIN LOGIC
// =============================================================

const client = new rpc.Client({ transport: 'ipc' });
let isReady = false;
let lastHeartbeat = Date.now();

client.on('ready', () => {
    console.log(`[Discord] Connected as ${client.user.username}`);
    isReady = true;
});

async function updateActivity() {
    try {
        // Fetch VLC Status
        const response = await axios.get(`http://${VLC_HOST}:${VLC_PORT}/requests/status.json`, {
            auth: {
                username: '',
                password: VLC_PASSWORD
            },
            timeout: 800 // Short timeout to avoid lag
        });

        const data = response.data;
        const stateStr = data.state; // 'playing', 'paused', 'stopped'

        // Map Assets
        const assetLarge = `${THEME_PREFIX}vlc_icon`;
        const assetPlay = `${THEME_PREFIX}play_icon`;
        const assetPause = `${THEME_PREFIX}pause_icon`;
        const assetStop = `${THEME_PREFIX}stop_icon`;

        if (stateStr === 'stopped') {
            if (isReady) {
                client.setActivity({
                    details: 'Idling',
                    state: 'Waiting for media...',
                    largeImageKey: assetLarge,
                    largeImageText: 'VLC Media Player',
                    smallImageKey: assetStop,
                    smallImageText: 'Stopped',
                    instance: true,
                });
            }
            return;
        }

        if (stateStr === 'playing' || stateStr === 'paused') {
            const filename = cleanString(data.information?.category?.meta?.filename || "");
            const title = cleanString(data.information?.category?.meta?.title || "");
            const showName = cleanString(data.information?.category?.meta?.showName || "");
            const season = data.information?.category?.meta?.seasonNumber || "";
            const episode = data.information?.category?.meta?.episodeNumber || "";
            
            // Current Time & Duration
            const time = data.time || 0; // seconds
            const length = data.length || 0; // seconds
            const now = Date.now();
            
            // Audio & Quality
            // Note: information.category.Stream N is not standard JSON structure in axios response usually?
            // VLC JSON is weird: {"information": {"category": {"meta": {...}, "Stream 0": {...}}}}
            // We need to pass the category object to our helpers
            const category = data.information?.category || {};
            const audio = getAudioLanguages(category);
            const quality = getQualityTags(category);

            let top = "";
            let bot = "";
            let query = "";

            if (showName && episode) {
                top = showName;
                if (quality) top += ` ● ${quality}`;
                bot = `S${season}E${episode}`;
                if (audio) bot += ` ● ${audio}`;
                query = `${showName} S${season}E${episode}`;
            } else if (title) {
                top = title;
                if (quality) top += ` ● ${quality}`;
                bot = "Video";
                if (audio) bot += ` ● ${audio}`;
                query = title;
            } else {
                top = filename || "Unknown Media";
                if (quality) top += ` ● ${quality}`;
                bot = "Video";
                query = filename;
            }

            const stateLabel = stateStr.charAt(0).toUpperCase() + stateStr.slice(1);
            const botState = `${bot} (${stateLabel})`;

            const activity = {
                details: top,
                state: botState,
                largeImageKey: assetLarge,
                largeImageText: 'VLC Media Player',
                smallImageKey: stateStr === 'playing' ? assetPlay : assetPause,
                smallImageText: stateLabel,
                instance: true,
                buttons: [
                    { label: BUTTON_LABEL, url: generateButtonUrl(query, PROVIDER, CUSTOM_URL) }
                ]
            };

            if (stateStr === 'playing' && length > 0) {
                // Calculate end timestamp
                // Discord expects milliseconds
                // VLC gives current position in seconds and length in seconds
                // End time = Now + (Length - Current) * 1000
                const remaining = (length - time);
                if (remaining > 0) {
                    activity.endTimestamp = now + (remaining * 1000);
                }
            }

            if (isReady) {
                client.setActivity(activity);
            }
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.response?.status === 401) {
             // VLC not running or auth failed
             console.log('[VLC] Connection Failed. Is VLC open with Web Interface enabled?');
             if (isReady) {
                 client.clearActivity();
             }
        } else {
            console.error('[Error]', error.message);
        }
    }
}

// =============================================================
// INIT
// =============================================================

client.login({ clientId: CLIENT_ID }).catch(err => {
    console.error('[Discord] Failed to connect:', err);
});

setInterval(updateActivity, POLL_INTERVAL);

console.log('Starting VLC Discord RPC Node...');
console.log(`Connecting to VLC at ${VLC_HOST}:${VLC_PORT}...`);
console.log('Make sure VLC Web Interface is enabled with password: ' + VLC_PASSWORD);
