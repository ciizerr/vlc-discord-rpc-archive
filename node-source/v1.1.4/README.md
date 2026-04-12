# VLC Discord RPC v1.1.4 (Node.js)

This is a Node.js port of the Windhawk mod v1.1.4 logic.

## New in v1.1.4
- **Toast Notifications**: Added multi-platform desktop toast notifications using `node-notifier` whenever a track changes.
- **Dynamic Filter Syncing**: By default, the metadata scrubber will pull the absolute latest piracy / ad-tag filters from the main repository so it stays up-to-date.
- **Uguu.se Image Uploads**: Replaced ~~`0x0.st`~~ with `uguu.se` for reliable local album art remote uploading.
- **Minimal Mode Toggle**: Hide the play/pause badges and playback state from the "small image" of Discord Rich Presence for a cleaner aesthetic.
- **Modular Toggles**: Added the ability to selectively hide Quality Tags, Chapter Numbers, and Audio Languages.

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
    "CUSTOM_JUNK_WORDS": ["mysite", "ripper_name", "8k"],
    "SHOW_NOTIFICATIONS": false,
    "MINIMAL_MODE": false,
    "ENABLE_METADATA_CLEANER": true,
    "STRICT_LOCAL_MODE": false,
    "SHOW_QUALITY_TAGS": true,
    "SHOW_CHAPTER": true,
    "SHOW_AUDIO_LANGUAGE": true
}
```

- **`SHOW_NOTIFICATIONS`**: Set to true to enable desktop toasts when the song changes.
- **`MINIMAL_MODE`**: Set to true to omit the small icon badges (play/stop/pause) from the rich presence.
- **`ENABLE_METADATA_CLEANER`**: Analyzes media titles and removes messy tags from the rich presence.
- **`STRICT_LOCAL_MODE`**: Disallows fetching the newest metadata filter updates from the GitHub assets, and only uses the hard-coded default plus your `CUSTOM_JUNK_WORDS`.
- **`SHOW_COVER_ART`**: Set to `true` to enable automatic uploading/scraping. Set to `false` for instant default VLC icons.

## Usage
```bash
npm start
```
