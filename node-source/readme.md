# VLC Discord RPC (Node.js Version)

This folder contains a Node.js implementation of the VLC Discord Rich Presence logic. It allows you to run the rich presence client on any platform that supports Node.js (Windows, macOS, Linux).

## 🚀 Getting Started

### Prerequisites

*   **Node.js**: Install from [nodejs.org](https://nodejs.org/).
*   **VLC Media Player**: Configured with Web Interface.

### Setup VLC

1.  Open VLC.
2.  Go to **Preferences** -> **Show All Setttings**.
3.  **Interface** -> **Main interfaces** -> Enable **Web**.
4.  **Interface** -> **Main interfaces** -> **Lua** -> set **Password** to `1234`.

### Installation

1.  Navigate to the source directory:
    ```bash
    cd v1.0.0
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the script:
    ```bash
    npm start
    ```

## ⚙️ Configuration

You can modify `v1.0.0/index.js` to change the settings if needed:
- `CLIENT_ID`: Your Discord Application ID.
- `VLC_PASSWORD`: If you set a different password in VLC.
- `THEME_PREFIX`: Set to `'dark_'` for dark mode icons.
