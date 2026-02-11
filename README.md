# <img src="https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/vlc-discord-site/public/assets/vlc-discord-icon.png" alt="VLC Discord Icon" width="45" height="45"> VLC Discord Rich Presence to (Node.js & WindHawk) <img src="https://windhawk.net/logo-white.07a58d8408c12a46b52785c91e5f2e9e.svg" alt="Windhawk Icon" width="45" height="45">

<div align="center">  
    
![GitHub release (latest by date)](https://img.shields.io/github/v/release/ciizerr/vlc-discord-rpc-archive?style=for-the-badge&color=blueviolet)
![GitHub license](https://img.shields.io/github/license/ciizerr/vlc-discord-rpc-archive?style=for-the-badge&color=green)
![GitHub stars](https://img.shields.io/github/stars/ciizerr/vlc-discord-rpc-archive?style=for-the-badge&color=yellow)
![Discord RPC](https://img.shields.io/badge/Discord%20RPC-v4.0.1-5865F2?style=for-the-badge&logo=discord&logoColor=white)

<br>

**Your media, now live on Discord.**
Minimalist integration for VLC Media Player to display what you're watching or listening to with rich details.

[Features](#-features) • [Installation](#-installation) • [Configuration](#-configuration) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

Display rich presence data directly from VLC to your Discord profile.

- **🆕 Cover Art Integration**: Automatically fetches and displays album art and movie posters.
- **🎧 Smart Status**: Context-aware status updates ("Listening to...", "Watching...").
- **📊 Live Progress**: Functional progress bar tracking your media playback.
- **🏷️ rich Metadata**: Displays resolution (4K, 1080p), HDR, and audio languages.
- **🔍 "Search This" Button**: One-click search on Google, IMDb, or YouTube directly from your profile.
- **🎨 Theme Support**: Light and Dark mode icons available.
- **🛡️ Privacy Controls**: Option to hide cover art if preferred.

---
## ↪ Preview

![Default](https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/screenshots/themes/default.gif)
![Dark](https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/screenshots/themes/dark_.gif)

---
## 🚀 Installation

### Prerequisites

- **Node.js** (v14+)
- **VLC Media Player** (v3.0+)
- **Discord Desktop App**

### Quick Start

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ciizerr/vlc-discord-rpc-archive.git
    cd vlc-discord-rpc-archive/node-source/v1.0.0
    ```

2.  **Install dependencies**:
    ```bash
    npm ci
    ```

3.  **Enable VLC HTTP Interface**:
    *   Open VLC -> `Tools` -> `Preferences` -> `All` (bottom left) -> `Interface` -> `Main interfaces`.
    *   Check `Web` (or `HTTP remote control interface` on older versions).
    *   Go to `Main interfaces` -> `Lua` (in the left sidebar).
    *   Set **Lua HTTP Password** to `1234` (or your preferred password).

4.  **Run the Client**:
    ```bash
    npm start
    ```

---

## ⚙️ Configuration

Customize the behavior by editing `index.js` or setting environment variables.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `CLIENT_ID` | Discord Application ID | `1465711556418474148` |
| `VLC_PASSWORD` | VLC HTTP Password | `1234` |
| `VLC_PORT` | VLC Web Interface Port | `8080` |
| `THEME_PREFIX` | Icon theme prefix (`''` or `'dark_'`) | `''` |
| `PROVIDER` | Search button target (`Google`, `YouTube`, `IMDb`) | `Google` |
| `POLL_INTERVAL` | Updates frequency (ms) | `1000` |

### Environment Setup (Example)

**Windows (PowerShell)**:
```powershell
$env:VLC_PASSWORD = "1234"
$env:PROVIDER = "YouTube"
npm start
```

**Linux/macOS**:
```bash
export VLC_PASSWORD="1234"
export PROVIDER="YouTube"
npm start
```

---

## 🛠️ Troubleshooting

<details>
<summary><strong>No presence appearing on Discord?</strong></summary>

1.  Ensure Discord is installed & running.
2.  Verify VLC HTTP interface is enabled and password matches `1234`.
3.  Check if `CLIENT_ID` is correct.
4.  Restart both VLC and the script.

</details>

<details>
<summary><strong>"Authentication failed" error?</strong></summary>

Double-check the password set in VLC Preferences -> All -> Interface -> Main interfaces -> Lua -> Lua HTTP Password.

</details>

<details>
<summary><strong>Cover art not showing?</strong></summary>

Cover art works for local files with embedded metadata. Ensure your media files have tagged artwork.

</details>

---

<div align="center">

**Made with ❤️ by [ciizerr](https://github.com/ciizerr)**

Based on `discord-rpc` and `axios`. Licensed under **MIT**.

</div>
