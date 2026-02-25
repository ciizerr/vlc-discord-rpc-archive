# <img src="https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/vlc-discord-site/public/assets/vlc-discord-icon.png" alt="VLC Discord Icon" width="45" height="45"> VLC Discord Rich Presence (Node.js & WindHawk) <img src="https://windhawk.net/logo-white.07a58d8408c12a46b52785c91e5f2e9e.svg" alt="Windhawk Icon" width="45" height="45">

<div align="center">  
    
![GitHub license](https://img.shields.io/github/license/ciizerr/vlc-discord-rpc-archive?style=for-the-badge&color=green)
![GitHub stars](https://img.shields.io/github/stars/ciizerr/vlc-discord-rpc-archive?style=for-the-badge&color=yellow)
![Discord RPC](https://img.shields.io/badge/Discord%20RPC-v4.0.1-5865F2?style=for-the-badge&logo=discord&logoColor=white)

<br>

**Your media, now live on Discord.**
Minimalist integration for VLC Media Player to display what you're watching or listening to with rich details.

[Features](#-features) • [Windhawk Mod (Recommended)](#-windhawk-mod-recommended) • [Node.js (Alternative)](#-nodejs-alternative) • [Config & Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

Display rich presence data directly from VLC to your Discord profile.

- **🆕 Smart Cover Art Engine**: Automatically fetches and displays album art and movie posters (local metadata or scraped from the web).
- **📝 Metadata Scrubber**: Intelligently strips piracy site URLs, scene releases, and junk tags for clean titles.
- **🎧 Context-Aware Status**: Switches dynamically between "Listening to...", "Watching TV...", and "Watching Movie...".
- **📊 Live Progress**: Functional progress bar tracking your media playback tracking.
- **🏷️ Rich Metadata**: Displays resolution (4K, 1080p), HDR, and audio languages.
- **🔍 "Search This" Button**: One-click search on Google, IMDb, or YouTube directly from your profile.
- **🎨 Theme Support**: Light and Dark mode icons available.

---
## ↪ Preview

**Default Theme:**
![Default](https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/screenshots/themes/default.gif)

**Dark Theme:**
![Dark](https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/screenshots/themes/dark_.gif)

---
## 🚀 One-Time VLC Setup (Required for All Methods)

For this tool to read data from VLC, you must enable its Web Interface:

1. Open VLC Media Player.
2. Go to `Tools` -> `Preferences` (or press `Ctrl+P`).
3. In the bottom-left corner, under *Show settings*, select **All**.
4. Navigate to `Interface` -> `Main interfaces`.
5. Check the box for **Web**.
6. Expand `Main interfaces` on the left and click **Lua**.
7. Set the **Lua HTTP Password** to `1234`.
8. **Save** and restart VLC.

---
## 🦅 Windhawk Mod (Recommended - Windows Only)

The easiest and most efficient way to use this integration on Windows. It injects directly into VLC, using zero extra background processes.

1. Download and install **[Windhawk](https://windhawk.net/)**.
2. Open Windhawk and go to the **Explore** tab.
3. Search for **["VLC Discord Rich Presence"](https://windhawk.net/mods/vlc-discord-rpc)**.
4. Click **Install** and accept the prompt.
5. Setup is complete! The mod will run automatically whenever VLC is open. You can configure settings directly in the Windhawk UI.

---
## 🟢 Node.js (Alternative - Mac / Linux / Advanced)

If you are not on Windows, or prefer running it as a standalone script, you can use the Node.js version.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- Git

### Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/ciizerr/vlc-discord-rpc-archive.git
    cd vlc-discord-rpc-archive/node-source/v1.1.1
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure & Run**:
    * Edit the `config.json` file in that directory to change behavior (Cover Art, Junk Words, Themes).
    * Start the script:
    ```bash
    npm start
    ```

---
## ⚙️ Configuration (Node.js)

For the Node.js version, customize behavior by editing the `config.json` file in the `v1.1.1` folder.

| Key | Description | Default |
| :--- | :--- | :--- |
| `CLIENT_ID` | Discord Application ID | `1465711556418474148` |
| `VLC_PASSWORD` | VLC HTTP Password | `:1234` |
| `SHOW_COVER_ART` | Enable web image scraping (`true` / `false`) | `true` |
| `THEME` | Icon theme prefix (`""` or `"dark_"`) | `""` |
| `PROVIDER` | Search target (`Google`, `YouTube`, `IMDb`) | `Google` |
| `CUSTOM_JUNK_WORDS` | Array of words to hide in titles | `["mysite", "10bit"]` |

*(Windhawk users will find all these exact same settings inside the Windhawk Mod configuration page).*

---
## 🛠️ Troubleshooting

<details>
<summary><strong>No presence appearing on Discord?</strong></summary>

1.  Ensure Discord is installed & running.
2.  Verify VLC HTTP interface is enabled and password matches exactly `1234`.
3.  Restart both VLC and the script/Windhawk.
</details>

<details>
<summary><strong>"Authentication failed" error (Node.js)?</strong></summary>

Double-check the password set in VLC: *Preferences -> All -> Interface -> Main interfaces -> Lua -> Lua HTTP Password*.
</details>

<details>
<summary><strong>Cover art not showing?</strong></summary>

Cover art fetches rely on embedded ID3 tags, or matching the filename to an online database (Bing Images). If it shows the default cone, it means your file lacks embedded art and online scraping couldn't find a confident match for the title.
</details>

---

<div align="center">

**Made with ❤️ by [ciizerr](https://github.com/ciizerr)**

Licensed under **MIT**.

</div>
