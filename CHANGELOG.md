# Changelog

## v1.0.3 (2026-01-29)

**Mod Stability & Core Improvements**

This version includes cumulative updates (skipping internal v1.0.1/v1.0.2) to significantly improve stability, error handling, and data safety.

-   **Thread Safety**: Replaced the volatile stop flag with `std::atomic<bool>` to prevent potential race conditions during thread termination.
-   **Robust JSON Parsing**:
    -   Implemented a new, robust string extractor that correctly handles escaped quotes (`\"`) within JSON values, ensuring metadata like "Show Name" or "Episode Title" doesn't break parsing.
    -   Added safety checks for numeric extraction to prevent crashes on malformed data.
-   **Data Sanitization**:
    -   Added `SanitizeString` to strip control characters and convert double quotes to single quotes in Discord Rich Presence details. This prevents Discord IPC errors caused by invalid JSON payloads.
-   **Connection Resilience**:
    -   Refactored the main worker loop to automatically attempt reconnection to the VLC HTTP interface if the connection is lost or unstable.
    -   Added logic to re-establish the WinHTTP session handles dynamically.
-   **Idle State Detection**:
    -   Improved logic for detecting "Stopped" states to correctly switch the Discord status to "Idling" when VLC is open but not playing media.

## v1.0.0 (Initial Release)

**Mod Description**

This mod seamlessly integrates VLC Media Player with Discord to display rich playback status, media metadata (movies, TV shows, anime), and quality tags (e.g., 4K, HDR).

**Key Features**

-   **Smart Recognition**: Automatically parses media titles to identify Show Name, Season, Episode, or Movie titles.
-   **Quality Tags**: Displays tags for resolution (4K, 1080p) and HDR status.
-   **Interactive Buttons**: Adds a "Search This" button redirecting to Google, IMDb, or YouTube.
-   **Customizable**: Users can switch between "Default" and "Dark" icon themes and configure the Search Provider via Mod Settings.