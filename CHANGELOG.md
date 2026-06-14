# Changelog

All notable changes to World Prayer Times are documented here.

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
