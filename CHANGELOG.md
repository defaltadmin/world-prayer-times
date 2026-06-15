# Changelog

All notable changes to World Prayer Times are documented here.

## [1.6.1] – 2026-06-15

### Fixed
- **Ruler misalignment** — Hour marks now align correctly with prayer blocks using `(100% - label-w)` formula
- **Prayer block widths** — Uses actual API prayer windows instead of hardcoded 18-min fallback
- **Geocoded city timezone** — Shows city's timezone, not user's local timezone
- **Conflict detection** — Uses actual prayer window durations instead of hardcoded 18-min windows
- **Scroll sync infinite loop** — Added lock flag to prevent ruler/timeline scroll fighting
- **Conflict badge** — Correct X icon and deduplicated conflict list with overflow count
- **Prayer countdown** — Fixed incorrect time calculation using UTC-based conversion instead of broken Date parsing

### Changed
- **Arabic i18n expanded** — All UI elements now translate to Arabic (settings, modals, buttons, labels)
- **Language toggle removed** — Header language button removed; language selection only in Settings
- **Geolocation optional** — Site loads immediately with browser timezone; geolocation runs in background
- **Faster load** — No longer blocks on geolocation permission dialog

### Added
- **Scroll to Now button** — Clock icon in header to jump timeline to current time

### Removed
- **Qibla direction** — Compass icon removed (not useful on desktop)

## [1.6.0] – 2026-06-15

### Added
- **Worldwide city search** — Nominatim geocoding (any city, not just 13 presets)
- **Custom city persistence** — Geocoded cities saved to localStorage
- **Privacy notice** — Dismissible banner + full privacy modal on first visit
- **Prayer legend strip** — Color-coded key above timeline
- **Toast notifications** — Smooth fade-in for share, export, etc.
- **Keyboard control** — Arrow keys move selection, [ ] resize
- **Arabic prayer names** — فجر، ظهر، عصر، مغرب، عشاء when lang=ar
- **Hijri date** — Shows Islamic calendar date in header

### Fixed
- **Timeline overlap** — Pixel-based positioning fixes NOW line alignment
- **Legend i18n** — Updates on language switch
- **Header date perf** — Cached, only recomputes on day change
- **userCity lat/lng** — Stores rounded coords for return visits
- **Touch listeners** — Fixed passive flag syntax for iOS/Android
- **hour12 inversion** — Clock shows correct 12h/24h format
- **compCls day bug** — getUTCDay() replaced with getDay()
- **Notification icon** — Now shows app icon instead of manifest.json
- **iCal memory leak** — Blob URLs revoked after download

### Security
- **CSP headers** — Content-Security-Policy with nominatim whitelist
- **Geolocation privacy** — Only rounded coords stored (±11km)
- **Service worker** — API responses no longer cached permanently

## [1.5.0] – 2026-06-15

### Security
- **CSP headers** — Content-Security-Policy added to _headers
- **Geolocation privacy** — Only timezone stored, not coordinates
- **iCal memory leak** — Blob URLs now revoked after download
- **Service worker** — API responses no longer cached permanently

### Fixed
- **Touch listeners** — Fixed passive flag syntax for iOS/Android
- **hour12 inversion** — Clock now shows correct 12h/24h format
- **compCls day bug** — getUTCDay() replaced with getDay()
- **Notification icon** — Now shows app icon instead of manifest.json

### Added
- **Toast system** — Non-intrusive feedback for share, export, etc.
- **Arabic prayer names** — فجر، ظهر، عصر، مغرب، عشاء when lang=ar
- **Hijri date** — Shows Islamic calendar date in header
- **Keyboard control** — Arrow keys move selection, [ ] resize
- **Canvas debounce** — Resize handler debounced to 150ms
- **SEO meta tags** — Open Graph and Twitter card tags
- **Performance** — Countdown updated every 10s instead of every 1s

## [1.4.0] – 2026-06-15

### Added
- **City persistence** – Selected cities saved to localStorage, restored on reload
- **Qibla direction** – Compass icon on each city row showing direction to Mecca
- **Prayer notifications** – Browser alerts 5 minutes before each Salah
- **Service worker** – Offline caching for faster loads and PWA support
- **Notification toggle** – Bell icon in header to enable/disable alerts

### Fixed
- **City save on add/remove** – Changes persist across sessions
- **Enhanced iCal** – Proper CALSCALE, UIDs, date-stamped filenames

## [1.3.0] – 2026-06-15

### Added
- **iCal export** – Download calendar event for selected safe meeting window
- **Robust city matching** – Share links handle "New York" vs "newyork" and special characters
- **Calendar icon** – New button in header for quick export

### Fixed
- **City deduplication** – Share links no longer create duplicate city entries
- **URL parsing** – Handles normalized city keys (alphanumeric only)

## [1.2.0] – 2026-06-15

### Added
- **Dynamic prayer block widths** – Blocks now use actual duration from Aladhan API instead of fixed 30min
- **Sunrise marker** – Yellow vertical line at each city's sunrise time
- **Share button** – Generates URL with cities, time window, and language params
- **URL parsing** – Loads shared city selection from URL params
- **PWA manifest** – Installable as home screen app on mobile
- **Auto-scroll NOW line** – Timeline centers on current time on load
- **Test chime button** – Preview alarm sound in Settings

### Fixed
- **Dark mode contrast** – City names pure white, clock text crisp light gray
- **Sidebar width** – 140px desktop, 120px mobile (properly isolated from timeline)
- **NOW line positioning** – Smoother animation, white text on red background
- **Text overlap** – Increased padding and line-height in city labels
- **Text clipping** – Added overflow handling for long city names
- **Alarm sounds** – Cleaner, simpler notification tones
- **Conflict detection** – Realistic prayer durations (Fajr 20min, Dhuhr 15min, etc.)
- **User location fallback** – No more 400 API errors on geolocation denial
- **Duplicate Istanbul** – Removed from city pool
- **URL share parsing** – Now handles city names and IDs correctly

### Changed
- **Color scheme** – Teal/cyan accent (#2dd4bf) instead of blue
- **Islamic background** – Elegant octagonal star pattern (was simple interlocking stars)
- **Enrollment panel** – Organized by day with proper timetable layout
- **NOW line** – Thicker (2.5px) with glow effect

## [1.1.0] – 2026-06-14

### Added
- **Loading screen** – Spinner while prayer data loads
- **Islamic geometric background** – Canvas-drawn pattern
- **SVG icons** – Replaced all emojis with inline SVGs
- **Course panel** – Proper links with WhatsApp/timetable/meetings/recordings icons
- **Mobile responsive** – Optimized for touch devices

### Fixed
- **CLS issues** – Reduced from 0.103 to 0.034
- **Console errors** – Fixed Aladhan API 400 error on fallback
- **How to Use modal** – Removed duplicate (was showing twice)

## [1.0.0] – 2026-06-14

### Added
- Initial release
- 24-hour timeline with city rows
- Real-time prayer data from Aladhan API
- Selection bar with conflict detection
- Dark/light theme
- EN/AR language support
- Course enrollment panel
- Cloudflare Pages deployment

---

## Credits

| Change | Source |
|--------|--------|
| Dynamic block widths | Grok recommendation |
| Share links | Grok recommendation |
| PWA manifest | Grok recommendation |
| Color scheme | Gemini visual audit |
| Sidebar isolation | Gemini layout fix |
| Conflict detection | Gemini logic fix |
| NOW line positioning | Gemini architecture fix |
| Course panel redesign | MiMo implementation |
| Islamic background | MiMo implementation |
