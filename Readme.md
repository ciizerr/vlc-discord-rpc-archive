# VLC Discord Rich Presence Archive

This repository hosts the source code for the **VLC Discord Rich Presence** mod for [Windhawk](https://windhawk.net/). This mod seamlessly integrates VLC Media Player with Discord to display your current playback status, including media metadata, resolution tags, and elapsed time.

## 🌟 Features

*   **Smart Recognition**: Automatically identifies Movies, TV Shows (including Season/Episode numbers), and Anime.
*   **Quality Tags**: Displays resolution and format tags (e.g., 4K, HDR, 1080p, 720p) based on the media file properties.
*   **Interactive Buttons**: Adds a "Search This" button to your Discord status that can redirect to Google, IMDb, Bing, or YouTube.
*   **Visual Themes**: Supports customizable icon sets, including a "Dark Mode" variant for better aesthetic integration.
*   **Live Playback Status**: Accurately shows elapsed time, remaining time, and pauses/idle states in real-time.

## 📂 Repository Structure

*   **`windhawk-source/`**: Contains the C++ source code for the Windhawk mod.
    *   `v1.0.0/`: The source for version 1.0.0.
*   **`assets/`**: Resources and images used by the project.
*   **`screenshots/`**: Preview images of the mod in action.

## 🛠️ Prerequisites

To use this mod, you need:
1.  **VLC Media Player**: Installed and configured (see setup below).
2.  **Windhawk**: To compile and inject the mod into VLC.
3.  **Discord**: The desktop client must be running for Rich Presence to appear.

## ⚙️ Setup Instructions

For this mod to successfully retrieve data from VLC, you must enable the VLC Web Interface.

1.  Open **VLC Media Player**.
2.  Navigate to **Tools** > **Preferences** (or press `Ctrl+P`).
3.  In the bottom-left corner, under *Show settings*, select **All**.
4.  Navigate to **Interface** > **Main interfaces**.
5.  On the right panel, check the box for **Web**.
6.  In the left sidebar, expand *Main interfaces* and click on **Lua**.
7.  Under *Lua HTTP*, configure the following:
    *   **Password**: `1234`
    *   **Port**: `8080`
8.  Click **Save** and **Restart VLC**.

## 🎨 Configuration

You can customize the mod behavior via the Windhawk Mod Settings:

*   **Client ID**: Power users can provide a custom Discord Application ID to use their own uploaded assets.
*   **Icon Theme**: Choose between the `Default` (Orange Cone) or `Dark` (Dark Mode) themes.
*   **Search Provider**: Customize the "Search This" button to open results in Google, Bing, IMDb, YouTube, or a Custom URL.
*   **Button Label**: Rename the text on the interactive button (e.g., "Find Info").

## 🤝 Feedback & Support

For bug reports, feature suggestions, or general feedback:
*   **Discord**: `ciizerr`
*   **GitHub**: [vlc-discord-rpc-archive](https://github.com/ciizerr/vlc-discord-rpc-archive)

---
*Made with ❤️ by ciizerr*
