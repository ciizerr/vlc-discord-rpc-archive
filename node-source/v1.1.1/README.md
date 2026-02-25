# VLC Discord RPC v1.1.1 (Node.js)

This is a Node.js port of the Windhawk mod v1.1.1 logic.

## New in v1.1.1
- **Omni-Scrubber (`CleanMetadata`)**: Intelligently removes PIRATE sites, extensions (`1080p`, `x264`), brackets, and promotional lines from media titles.
- **Smart Online Cover Art**: If a song/movie doesn't have an embedded cover, the script automatically searches Bing Images and fetches the best poster/cover available (requires `SHOW_COVER_ART` to be enabled).
- **External Configuration (`config.json`)**: Settings can now be customized directly via JSON without editing code.

## Prerequisites
- Node.js installed.
- VLC Media Player with Web Interface enabled (Password: `1234`, Port: `8080`).

## Installation
```bash
npm install
```

## Configuration (`config.json`)
You can edit the `config.json` file in this directory to tweak options:

```json
{
    "CLIENT_ID": "1465711556418474148",
    "VLC_PASSWORD": ":1234",
    "VLC_PORT": 8080,
    "POLLING_INTERVAL": 1000,
    "SHOW_COVER_ART": true,
    "THEME": "",
    "PROVIDER": "Google",
    "CUSTOM_URL": "",
    "BUTTON_LABEL": "Search This",
    "CUSTOM_JUNK_WORDS": ["mysite", "ripper_name", "8k"]
}
```

- **`SHOW_COVER_ART`**: Set to `true` to enable automatic uploading/scraping. Set to `false` for instant, non-blocking default VLC icons.
- **`CUSTOM_JUNK_WORDS`**: An array of explicit words/phrases to crop out of your playback titles.

## Usage
```bash
npm start
```
