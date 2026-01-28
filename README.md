# VLC Discord Rich Presence (Node.js & WinHawk)  

![GitHub release (latest by date)](https://img.shields.io/github/v/release/ciizerr/vlc-discord-rpc-archive) ![GitHub license](https://img.shields.io/github/license/ciizerr/vlc-discord-rpc-archive) ![GitHub stars](https://img.shields.io/github/stars/ciizerr/vlc-discord-rpc-archive?style=flat) ![Discord RPC version](https://img.shields.io/badge/Discord%20RPC-4.0.1-blue)  

**VLC Discord Rich Presence** brings your VLC playback information straight to Discord, showing what you’re watching or listening with beautiful icons, quality tags, audio‑language hints and a handy “Search this” button.

> **Demo** – See the presence in action on Discord (link to a short video or GIF if you have one).  

---

## Table of Contents  

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
  - [Running the client](#running-the-client)  
- [Usage](#usage)  
- [Development](#development)  
- [Deployment](#deployment)  
- [API Documentation (Node client)](#api-documentation-node-client)  
- [Contributing](#contributing)  
- [Troubleshooting & FAQ](#troubleshooting--faq)  
- [Roadmap](#roadmap)  
- [License & Credits](#license--credits)  

---

## Overview  

VLC Discord Rich Presence (RPC) is a lightweight Node.js service (with an optional WinHawk C++ overlay) that polls VLC’s HTTP interface and updates your Discord status in real time. It works with any media VLC can play—movies, TV shows, music, podcasts—displaying:

* Title / filename  
* Playback state (Playing / Paused / Stopped)  
* Video quality (4K, 1080p, HDR, etc.)  
* Active audio languages (e.g., `en | fr`)  
* A custom “Search this” button that opens Google, Bing, IMDb, YouTube, or any URL you define  

The project is **zero‑configuration out of the box** (default password `1234`, port `8080`). All settings are exposed as constants at the top of `node-source/v1.0.0/index.js` or via environment variables.

---

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **Live playback sync** | Updates Discord every second while VLC is playing or paused. | ✅ Stable |
| **Rich media metadata** | Shows title, episode/season, video resolution, HDR flag, and audio languages. | ✅ Stable |
| **Theme support** | Switch between the default or a dark theme by changing `THEME_PREFIX`. | ✅ Stable |
| **Custom search button** | One configurable button that opens a search on Google, Bing, IMDb, YouTube, or a custom URL. | ✅ Stable |
| **Graceful idle handling** | Shows “Idling – Waiting for media…” when VLC is stopped. | ✅ Stable |
| **Cross‑platform** | Node.js version works on Windows/macOS/Linux; WinHawk version provides a native overlay for Windows. | ✅ Stable |
| **Docker ready** | Official Dockerfile (see `Deployment`) for containerised usage. | ✅ Stable |
| **Extensible** | Simple helper functions (`getAudioLanguages`, `getQualityTags`) can be forked for extra metadata. | ✅ Stable |

---

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Runtime** | Node.js ≥ 14 | Async/await, modern JS features |
| **Discord RPC** | `discord-rpc@4.0.1` | Official IPC client for Discord |
| **HTTP client** | `axios@1.6.0` | Fast, promise‑based HTTP requests |
| **VLC interface** | VLC HTTP API (enabled via *Tools → Preferences → All → Interface → Main interfaces → HTTP*) | Provides JSON status endpoint |
| **Optional native overlay** | WinHawk (C++/C#) | Windows‑only DLL that injects the same RPC logic without Node.js |
| **Containerisation** | Docker (official Node image) | One‑click deployment |

---

## Architecture  

```
repo/
├─ assets/                # screenshots, contribution guidelines
├─ node-source/           # pure‑JS implementation
│   └─ v1.0.0/
│       ├─ index.js       # main polling loop & Discord RPC logic
│       ├─ package.json   # npm metadata
│       └─ package-lock.json
├─ windhawk-source/       # optional WinHawk C++ overlay (v1.0.0)
│   └─ vlc-discord-rpc.wh.cpp
└─ screenshots/           # UI mock‑ups for setup & themes
```

* **index.js** – Creates a Discord RPC client, polls VLC’s `status.json` every `POLL_INTERVAL` (default 1 s), builds a rich presence payload, and pushes it to Discord.  
* **Helpers** – `cleanString`, `getAudioLanguages`, `getQualityTags`, `generateButtonUrl` encapsulate the transformation of VLC JSON into user‑friendly text.  
* **Configuration constants** – All tunable values (client ID, VLC password/host/port, theme prefix, button provider) are defined at the top of the file and can be overridden via environment variables (see *Configuration*).  

The data flow:

1. **VLC** → HTTP GET `http://HOST:PORT/requests/status.json` (basic auth)  
2. **Node client** → Parses JSON → extracts metadata via helpers  
3. **Discord RPC** → `client.setActivity(payload)` updates the presence  

---

## Getting Started  

### Prerequisites  

| Requirement | Minimum version |
|-------------|-----------------|
| **Node.js** | 14.x (LTS) |
| **npm** | 6.x |
| **VLC** | 3.0.0 (HTTP interface must be enabled) |
| **Discord** | Desktop client (or web) with Rich Presence support |
| **(Optional) Docker** | 20.10+ |

> **VLC HTTP Interface** – Open VLC → *Tools → Preferences → All → Interface → Main interfaces → HTTP* → check the box, set a password (default `1234`), and note the port (default `8080`).  

### Installation  

```bash
# Clone the repository
git clone https://github.com/ciizerr/vlc-discord-rpc-archive.git
cd vlc-discord-rpc-archive/node-source/v1.0.0

# Install dependencies
npm ci   # uses package-lock.json for reproducible install
```

### Configuration  

You can edit the constants directly in `index.js` **or** export environment variables before running the script.

| Variable | Description | Default |
|----------|-------------|---------|
| `CLIENT_ID` | Discord application client ID (must match the RPC app you created) | `1465711556418474148` |
| `VLC_PASSWORD` | Password for VLC’s HTTP interface | `1234` |
| `VLC_PORT` | Port where VLC serves the API | `8080` |
| `VLC_HOST` | Host address (usually `127.0.0.1`) | `127.0.0.1` |
| `THEME_PREFIX` | Prefix for asset keys (`''` for default, `'dark_'` for dark theme) | `''` |
| `PROVIDER` | Search button provider (`Google`, `Bing`, `IMDb`, `YouTube`, `Custom`) | `Google` |
| `CUSTOM_URL` | URL used when `PROVIDER` is `Custom` | `''` |
| `BUTTON_LABEL` | Text displayed on the Discord button | `Search This` |
| `POLL_INTERVAL` | Milliseconds between VLC polls | `1000` |

**Example (Unix/macOS):**

```bash
export CLIENT_ID=1465711556418474148
export VLC_PASSWORD=superSecret
export THEME_PREFIX=dark_
export PROVIDER=YouTube
npm start
```

**Example (Windows PowerShell):**

```powershell
$env:CLIENT_ID = "1465711556418474148"
$env:VLC_PASSWORD = "superSecret"
$env:THEME_PREFIX = "dark_"
$env:PROVIDER = "YouTube"
npm start
```

### Running the client  

```bash
npm start
# or directly:
node index.js
```

You should see a console line similar to:

```
[Discord] Connected as YourDiscordUsername
```

Open Discord → you’ll now see a rich presence showing the current VLC media.

---

## Usage  

### Basic flow  

1. **Start VLC** and enable the HTTP interface (see prerequisites).  
2. **Run the Node client** (`npm start`).  
3. **Play any media** – Discord will automatically update with title, quality, audio languages, and a functional “Search This” button.  

### Customising the button  

```js
// In index.js (or via env vars)
const PROVIDER = 'IMDb';          // Options: Google, Bing, IMDb, YouTube, Custom
const CUSTOM_URL = '';            // Only used when PROVIDER === 'Custom'
const BUTTON_LABEL = 'Find on IMDb';
```

The button will appear as **Find on IMDb** and open an IMDb search for the current title/episode.

### Switching themes  

Place your custom Discord assets (icons) in the Discord developer portal with keys:

* `vlc_icon`, `play_icon`, `pause_icon`, `stop_icon` (default theme)  
* `dark_vlc_icon`, `dark_play_icon`, … (dark theme)  

Then set `THEME_PREFIX = 'dark_'` to use the dark assets.

### Example code snippet (copy‑paste)  

```bash
# .env (optional)
CLIENT_ID=1465711556418474148
VLC_PASSWORD=1234
VLC_HOST=127.0.0.1
VLC_PORT=8080
THEME_PREFIX=
PROVIDER=Google
BUTTON_LABEL=Search This
POLL_INTERVAL=1000
```

```bash
# Start the service
npm start
```

---

## Development  

### Setting up a dev environment  

```bash
# Fork & clone the repo
git clone https://github.com/your-username/vlc-discord-rpc-archive.git
cd vlc-discord-rpc-archive/node-source/v1.0.0

# Install dependencies
npm install

# Run lint (if you add ESLint) or just start
npm start
```

### Testing  

The project currently has **no automated test suite**. You can manually verify by:

1. Changing a constant (e.g., `PROVIDER = 'YouTube'`).  
2. Restarting the client.  
3. Observing the updated button URL in Discord.  

Feel free to add Jest/Mocha tests for the helper functions (`cleanString`, `getAudioLanguages`, `getQualityTags`).

### Code style  

* Use **ESLint** with the `eslint:recommended` rules.  
* Prefer `const`/`let` over `var`.  
* Keep line length ≤ 120 characters.  

### Debugging tips  

* **Connection issues** – Ensure VLC’s HTTP interface is reachable (`curl http://127.0.0.1:8080/requests/status.json`).  
* **Authentication failures** – Verify the password matches `VLC_PASSWORD`.  
* **Discord not updating** – Check that the Discord client is running and that the application ID (`CLIENT_ID`) belongs to a registered Rich Presence app.  

---

## Deployment  

### Docker (recommended for production)  

```dockerfile
# Dockerfile (place in node-source/v1.0.0/)
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

ENV CLIENT_ID=1465711556418474148
ENV VLC_PASSWORD=1234
ENV VLC_HOST=host.docker.internal   # points to host machine
ENV VLC_PORT=8080
ENV THEME_PREFIX=
ENV PROVIDER=Google
ENV BUTTON_LABEL="Search This"
ENV POLL_INTERVAL=1000

CMD ["node", "index.js"]
```

Build & run:

```bash
docker build -t vlc-discord-rpc .
docker run -d --name vlc-rpc \
  --network host   # needed for host‑only VLC HTTP access
  vlc-discord-rpc
```

### Native Windows (WinHawk)  

The `windhawk-source/v1.0.0/vlc-discord-rpc.wh.cpp` file contains a WinHawk‑compatible DLL that injects the same RPC logic without Node.js. Compile it with the WinHawk SDK and place the resulting `.wh.dll` in the WinHawk plugins folder. Detailed steps are in the WinHawk documentation (outside the scope of this README).

---

## API Documentation (Node client)  

The client does **not expose a public HTTP API**; it only communicates with Discord via IPC. The only external interaction is the **VLC status endpoint**:

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| `GET` | `http://<VLC_HOST>:<VLC_PORT>/requests/status.json` | Basic (username: empty, password: `VLC_PASSWORD`) | Returns JSON containing playback state, current time, length, metadata, and stream information. |

> **Note** – The structure of `status.json` is documented by VLC: https://wiki.videolan.org/Documentation:Modules/http_intf/  

---

## Contributing  

1. **Fork** the repository.  
2. **Create a feature branch** (`git checkout -b feat/awesome-feature`).  
3. **Make your changes** – keep the code style consistent.  
4. **Update documentation** (README, screenshots, etc.) if you add new features.  
5. **Submit a Pull Request** – describe the problem solved and reference any related issues.  

### Development workflow  

| Step | Command |
|------|---------|
| Install dependencies | `npm ci` |
| Run locally | `npm start` |
| Lint (if ESLint added) | `npm run lint` |
| Build Docker image | `docker build -t vlc-discord-rpc .` |

### Code review guidelines  

* Verify that the presence updates correctly for all playback states.  
* Ensure no hard‑coded secrets remain (use env vars).  
* Check that new assets are added to the Discord developer portal with matching keys.  

---

## Troubleshooting & FAQ  

| Issue | Cause | Solution |
|-------|-------|----------|
| **No presence appears** | Discord RPC client not connected (wrong `CLIENT_ID` or Discord not running). | Verify `CLIENT_ID` matches the app you created in the Discord Developer Portal and that Discord is open. |
| **“Authentication failed” in console** | VLC password mismatch. | Open VLC → *Tools → Preferences → All → Interface → Main interfaces → HTTP* and set the password to the value of `VLC_PASSWORD`. |
| **Presence always shows “Idling”** | VLC HTTP interface disabled or blocked by firewall. | Enable the HTTP interface and allow inbound traffic on `VLC_PORT`. Test with `curl http://127.0.0.1:8080/requests/status.json`. |
| **Button opens the wrong URL** | `PROVIDER` or `CUSTOM_URL` mis‑configured. | Set `PROVIDER` to one of the supported values or provide a full URL in `CUSTOM_URL`. |
| **Assets don’t show** | Asset keys missing in Discord application. | Upload the required images (`vlc_icon`, `play_icon`, `pause_icon`, `stop_icon`, optionally prefixed with `dark_`) in the *Rich Presence* assets tab. |
| **Docker container can’t reach VLC** | Container network isolation. | Run the container with `--network host` (Linux) or map the host’s IP (`host.docker.internal` on macOS/Windows). |

If you still encounter problems, open an issue with logs and a description of your environment.

---

## Roadmap  

| Milestone | Planned Features |
|-----------|------------------|
| **v1.1.0** | • Configurable polling interval via env var<br>• Support for VLC playlists (show next track)<br>• Unit tests for helper functions |
| **v2.0.0** | • Web UI for live configuration<br>• macOS‑only native overlay (Swift)<br>• Internationalisation of presence text |
| **Future** | • Integration with Plex/Kodi<br>• Automatic asset generation from media thumbnails |

Contributions that target any of these items are especially welcome!

---

## License & Credits  

**License:** ISC – see `LICENSE` file.  

**Author:** *ciizerr* (GitHub: [ciizerr](https://github.com/ciizerr))  

**Contributors:** See `assets/contributions.md` for a full list of community contributors.  

**Third‑party attributions:**  

* **discord-rpc** – © Discord Inc. (MIT)  
* **axios** – © Matt Zabriskie (MIT)  
