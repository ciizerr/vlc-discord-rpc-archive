# VLC Discord RPC v1.1.0 (Node.js)

This is a Node.js port of the Windhawk mod v1.1.0 logic.

## Features
- **Cover Art Upload**: Automatically uploads local album art to `0x0.st`.
- **Quality Tags**: Detects 4K, HDR, 1080p, etc.
- **Audio Languages**: Displays audio tracks (e.g., "jpn", "eng").
- **Smart Activity**: Distinguishes between Listening, Watching TV, and Watching Movies.

## Prerequisites
- Node.js installed.
- VLC Media Player with Web Interface enabled (Password: `1234`, Port: `8080`).

## Installation
```bash
npm install
```

## Usage
```bash
npm start
```

## Configuration
Edit `index.js` variables at the top of the file to change:
- `CLIENT_ID`
- `VLC_PASSWORD`
- `POLLING_INTERVAL`
