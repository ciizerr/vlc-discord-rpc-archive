# Changelog

## v1.2.0 (2026-07-22)

## ✨ Added

- Added a **multi-engine metadata scraper** for more accurate movie and TV information.
- Added **TVMaze support** for TV shows, providing faster lookups and improving metadata accuracy.
- Added richer metadata, including:
  - Official title
  - Release year
  - ⭐ Rating
  - Genres
  - Runtime
  - High-quality poster artwork
- Added a **30-day local metadata cache** to speed up repeat lookups and reduce unnecessary network requests.
- Reorganized mod settings into clear categories for easier navigation.

## 🚀 Improved

- Improved metadata lookup speed with faster loading times.
- Improved title matching for files containing scene names, quality tags, release groups, and other unnecessary text.
- Improved overall metadata accuracy for both movies and TV shows.
- Improved reliability when fetching metadata and artwork.
- Automatically removes expired cached metadata to keep the local cache clean and up to date.
- Improved compatibility with existing settings so previous configurations continue to work after updating.
- Improved overall stability when enabling, disabling, or reloading the mod.

## 🛠️ Fixed

- Fixed incorrect posters being displayed for movies that are part of a collection (box sets). The correct movie poster is now shown.
- Fixed metadata matching issues caused by noisy or poorly formatted filenames.
- Fixed cases where title cleaning could accidentally remove parts of valid movie or TV show names.
- Fixed duplicate metadata notifications in some situations.

> **Note:** This is the **final release supporting Windhawk v1.x.x**.

## v1.1.5 (2026-05-11)

### New
- Music activity on Discord now shows:  
  - **Listening to [Song title]**  
  - **Listening to [Artist]**  
  - **Listening to [Album]**  
- VLC port is detected in most setups, so you don’t need to enter the port number manually.  
- The mod now reads your VLC Lua HTTP password directly, so you can use any password without extra setup.  

### Fixes
- Toast notifications no longer repeat or display the wrong track.  
- The image scraper now provides more accurate artwork instead of random results.  
- Port detection works correctly across different VLC configurations, including non‑default ports.  

### Improvements
- Added `wh_log()` entries to make debugging and tracking media simpler.  
- Artwork handling has been refined for sharper and more consistent images.  

Special thanks to **@josephct** for suggesting the music activity feature and for identifying the VLC port issue that could stop Rich Presence from working. 


## v1.1.4 (2026-04-11)

**What's New:**

_New Features_

- **Toast Notifications:** Added an option to enable Windows toast notifications. When enabled, a sleek notification will appear on your desktop whenever a new media file starts playing, showing the title, metadata, and cover art.

_Enhanced Customization_

- **Modular Layout Toggles:** Added new settings to independently hide the current Chapter number and Audio Language. This allows for a cleaner layout if you prefer to only show specific details.

## v1.1.3 (2026-03-13)

**What's New:**

_Fixes & Performance Improvements_

- Discord Status Updates: Your status now updates instantly when a song or video changes. Cover art uploading now runs in the background, so Discord no longer freezes while waiting for images.
- Local Album Art: Some users could not upload local artwork because our previous image host (~~`0x0.st`~~) was silently blocking certain connections. We have switched to `uguu.se`, which is more reliable and automatically deletes images after ~~24~~ 3 hours.

_Visual Enhancements_

- Minimal Mode Toggle **(new)** : You can now enable Minimal Mode in the settings. Instead of choosing a separate theme, this toggle hides the play/pause/stop badges while keeping your current theme (such as Dark Mode) active. This allows the cover art to fill the entire square.

_Improvements & Fixes_

- Formatting and Search: Episode formatting now uses proper spacing (e.g., S01 E01 instead of S01E01). This improves readability and makes the Search This button results more accurate.

## v1.1.2 (2026-02-27)

**What's New:**

_Fixes & Performance Improvements_

- High CPU Usage Fix: Resolved a performance issue introduced in v1.1.1 where the metadata cleaner caused high CPU load. Implemented a state-change cache so the heavy metadata scrubber only runs when the source media actually changes.
- TV Show Artwork Accuracy: Improved the external artwork fetching logic to better distinguish TV series from movies with similar titles, ensuring more accurate thumbnail matches.

_Advanced Filtering & Processing_

- Dynamic Filter Syncing: The metadata cleaner now remotely fetches and locally caches community-maintained junk word and tag filters. This ensures the cleaner stays highly accurate and up-to-date over time without requiring mod updates.

_Enhanced Customization_

- Modular Mod Settings: Added dedicated toggles in the Windhawk settings to individually enable or disable Quality Tags (`ShowQualityTags`) and the Metadata Cleaner (`EnableMetadataCleaner`) based on user preference.
- Strict Local Mode: Added `StrictLocalMode` to completely disable remote filter syncing for users who prefer their mod to only use hardcoded, offline filters.

## v1.1.1 (2026-02-23)

**What's New:**

_Metadata & Visuals_

- External Artwork Fetching **(new)** : If a media file lacks embedded artwork, the mod now seamlessly attempts to find and display relevant cover art or movie posters online.
- Advanced Metadata Cleaning: Introduced aggressive filtering to remove junk text (like website names, resolutions, or release group tags) from titles and artist names, resulting in a much cleaner Rich Presence.
- Release Year Parsing: Added support for extracting the release year from filenames to improve metadata accuracy and artwork matching.

## v1.1.0 (2026-02-09)

**What's New:**

_Visual Enhancements_

- Cover Art Integration **(new)** : Discord now displays actual album art and movie posters when available (for files with embedded artwork).
- Privacy Options: Added a new setting to disable cover art display and revert to the classic VLC icon.
- Progress Bar: Replaced plain timestamps with a functional progress bar.

_Smarter Status Updates_

- Contextual Status: Activity status now adapts automatically **(new)** :
  - Listening to [Song Title] for music.
  - Watching [Movie Title] for videos.

- Audio Language: Active audio track language (e.g., English, Japanese) is now shown for video files.

_Improvements & Fixes_

- Improved Layout:
  - Music: Displays Song, Artist, and Album (album shown on hover).
  - TV Shows: Automatically detects and shows Season/Episode format (e.g., S01E05).

- Technical Fixes:
  - Quality Indicators: Fixed display of tags for 4K, HDR, 10-bit, and 1080p content.

## v1.0.3 (2026-01-29)

**Mod Stability & Core Improvements**

This version includes cumulative updates (skipping internal v1.0.1/v1.0.2) to significantly improve stability, error handling, and data safety.

- **Thread Safety**: Replaced the volatile stop flag with `std::atomic<bool>` to prevent potential race conditions during thread termination.
- **Robust JSON Parsing**:
  - Implemented a new, robust string extractor that correctly handles escaped quotes (`\"`) within JSON values, ensuring metadata like "Show Name" or "Episode Title" doesn't break parsing.
  - Added safety checks for numeric extraction to prevent crashes on malformed data.
- **Data Sanitization**:
  - Added `SanitizeString` to strip control characters and convert double quotes to single quotes in Discord Rich Presence details. This prevents Discord IPC errors caused by invalid JSON payloads.
- **Connection Resilience**:
  - Refactored the main worker loop to automatically attempt reconnection to the VLC HTTP interface if the connection is lost or unstable.
  - Added logic to re-establish the WinHTTP session handles dynamically.
- **Idle State Detection**:
  - Improved logic for detecting "Stopped" states to correctly switch the Discord status to "Idling" when VLC is open but not playing media.

## v1.0.0 (Initial Release)

**Mod Description**

This mod seamlessly integrates VLC Media Player with Discord to display rich playback status, media metadata (movies, TV shows, anime), and quality tags (e.g., 4K, HDR).

**Key Features**

- **Smart Recognition**: Automatically parses media titles to identify Show Name, Season, Episode, or Movie titles.
- **Quality Tags**: Displays tags for resolution (4K, 1080p) and HDR status.
- **Interactive Buttons**: Adds a "Search This" button redirecting to Google, IMDb, or YouTube.
- **Customizable**: Users can switch between "Default" and "Dark" icon themes and configure the Search Provider via Mod Settings.
