# Changelog

## v1.1.1 (2026-02-23)

**What's New:**

_Metadata & Visuals_

* External Artwork Fetching **(new)** : If a media file lacks embedded artwork, the mod now seamlessly attempts to find and display relevant cover art or movie posters online.
* Advanced Metadata Cleaning: Introduced aggressive filtering to remove junk text (like website names, resolutions, or release group tags) from titles and artist names, resulting in a much cleaner Rich Presence.
* Release Year Parsing: Added support for extracting the release year from filenames to improve metadata accuracy and artwork matching.


## v1.1.0 (2026-02-09)

**What's New:**

_Visual Enhancements_

* Cover Art Integration **(new)** : Discord now displays actual album art and movie posters when available (for files with embedded artwork).
* Privacy Options: Added a new setting to disable cover art display and revert to the classic VLC icon.
* Progress Bar: Replaced plain timestamps with a functional progress bar.

_Smarter Status Updates_

* Contextual Status: Activity status now adapts automatically **(new)** :

  * Listening to [Song Title] for music.
  * Watching [Movie Title] for videos.

* Audio Language: Active audio track language (e.g., English, Japanese) is now shown for video files.

_Improvements & Fixes_

* Improved Layout:

  * Music: Displays Song, Artist, and Album (album shown on hover).
  * TV Shows: Automatically detects and shows Season/Episode format (e.g., S01E05).

* Technical Fixes:

  * Quality Indicators: Fixed display of tags for 4K, HDR, 10-bit, and 1080p content.


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