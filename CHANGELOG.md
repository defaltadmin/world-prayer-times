# Changelog

All notable changes to World Prayer Times are documented here.

## [1.12.0] — 2026-06-18

### Fixed
- **CRITICAL: Blank page on load** — Deleted 6 orphan `#btn-*` wirings (btn-settings, btn-help, btn-share, btn-ical, btn-course, btn-notify) that threw `TypeError` on null elements removed by Card Nav redesign. These buttons were replaced by `#nav-*` items in `initCardNav()` but the old JS wirings were never cleaned up, killing the entire IIFE and leaving `#rows` empty.
- **Course panel wiring** — Extracted `openCoursePanel()` function; `initCardNav` now calls it directly instead of trying to click a non-existent `#btn-course`
- **Class overlay day filter** — Uses London day-of-week (`Intl.DateTimeFormat('Europe/London')`) instead of browser-local `getDay()`. Fixes class overlays showing wrong day for users east/west of London.
- **Notification timer leak** — `schedulePrayerNotifs()` now tracks setTimeout IDs in `_notifTimers[]` and clears them before re-scheduling. Previously, toggling notifications or midnight refresh accumulated orphan timers.
- **Null guards** — Added `if (el)` guards to `#fmt-btn`, `#lang-sel`, `#alarm-sel`, `#test-chime`, `#close-panel`, `#course-pw-btn`, `#course-pw-input`, `#course-lock-btn` assignments
- **AudioContext resume** — Added `.catch(()=>{})` to prevent unhandled rejections on Safari
- **Loader error path** — Error handler now calls `hideLoader()` instead of leaving spinner spinning alongside error message
- **Enrolled shape validation** — `localStorage` loaded enrolled data validated for correct shape (array of objects with string start/end, integer day)
- **Nominatim User-Agent** — Removed dead code (browser fetch strips forbidden headers; Referer is sufficient)
- **package.json** — Version updated to 1.12.0

### Audit Notes
- GLM 5.2 audit: 1 critical + 4 high + 4 medium + 2 low fixes applied
- GLM 5.2 audit: 2 findings dismissed (H1 conflict wrap mathematically correct for actual use cases, L5 Permissions-Policy not exploitable as-is)

## [1.10.0] — 2026-06-16

### Fixed
- **renderAll race condition** — Generation counter prevents duplicate rows on rapid city add/remove
- **URL clamp** — selStart clamped after dur parsed (prevents e>24 breaking conflict detection)
- **iOS alarm warning** — Toast when notifications enabled on iOS (tab must stay open)
- **iOS AudioContext** — Resume on visibilitychange for Safari background tab
- **Dot grid perf** — Resize debounced 150ms, dirty flag skips redraw when dots at rest
- **Midnight refresh timezone** — Uses user city timezone instead of browser local
- **Merged intervals** — updateClsCountdown merged into tickClocks (single 1s interval)
- **enrolled save** — Strips alarmFired/computed fields before localStorage
- **sanitizeName** — Strips invisible/bidi Unicode characters
- **closeM** — Clears add city modal search on any close
- **Course panel** — Password cleared on panel close
- **Password shake** — Reflow forces animation restart on rapid submit
- **scrollToNow** — Respects prefers-reduced-motion
- **loadFromURL order** — Runs after loadSavedCities (URL overrides saved)
- **Card nav** — Escape closes menu, inert on #app when open
- **Course panel a11y** — role=dialog, aria-labelledby, panel-bg aria-hidden
- **color-scheme** — Updates on theme toggle for browser scrollbars
- **overscroll-behavior** — contain on class timetable (mobile scroll bleed)
- **iCal** — Comma escape in DESCRIPTION per RFC 5545
- **Custom cities** — Cap at 20 entries in localStorage
- **package.json** — Version updated to 1.10.0
- **SECURITY.md** — Supported versions updated

## [1.9.0] — 2026-06-16

### Fixed
- **Focus trap** — Added to all modals and course panel, Shift+Tab wraps
- **Focus restore** — openM/closeM save and restore activeElement
- **wp_u rounding** — 3dp coords, localStorage migration for existing 1dp users
- **Share links** — Geocoded cities excluded (session-only), toast warning
- **sw.js** — v4, network-first for HTML (fixes stale cache)
- **AbortController** — Cancels stale Nominatim requests on new keystroke
- **Layout caching** — tl-inner offsetWidth cached, invalidated on resize
- **Keyboard transition** — Selection bar transition disabled during keydown
- **Search a11y** — role=combobox, aria-autocomplete, aria-controls, aria-expanded, aria-live
- **Remove button** — SVG pointer-events none (mobile tap fix)
- **Noscript** — Fallback message for JS-disabled users
- **Mobile perf** — Glass saturate reduced to 120% on mobile
- **iCal UID** — Includes teacher name for uniqueness
- **Enrolled save** — Strips alarmFired/computed fields before localStorage
- **Alarm interval** — Early return when no classes enrolled
- **Card nav** — aria-expanded on hamburger, role=dialog on menu

## [1.8.1] – 2026-06-16

### Added
- **Border glow effect** — Conic gradient follows mouse cursor around card edges (course panel info cards, logo)
- **Spotlight card** — Radial gradient follows mouse on info-links and nav items
- **Mobile performance** — All cursor-tracking effects disabled on touch devices (`pointer: coarse`)

## [1.8.0] – 2026-06-16

### Added
- **Dot grid interactive background** — Canvas-based dot grid with mouse proximity effect (dots light up and push away from cursor, spring back with damping). Respects prefers-reduced-motion.
- **Card nav menu** — Hamburger menu replaces 8 header buttons with a slide-out panel grouped into cards: Navigate, Course, Share & Export, Settings.
- **Glass morphism enhanced** — Added saturate(180%) and box-shadow to glass surfaces
- **Animations** — Fade-in on load, prayer block hover spring, card lift on hover, NOW line pulse, chip bounce, selection bar glow
- **Arabic NOW label** — `[lang="ar"]` CSS override for "الآن"

## [1.7.10] – 2026-06-16

### Fixed
- **Nominatim User-Agent** — Version bumped to 1.7.10
- **Notifications timezone** — Uses `pd.tz` from API instead of stored `userCity.tz`
- **Dead code** — Removed unused `cpQuickLinks` variable

## [1.7.9] – 2026-06-16

### Fixed
- **renderAll double-call** — Only re-renders if detectUser found a real saved location
- **loadFromURL zero values** — `parseFloat('0')` no longer treated as falsy
- **renderToggles Intl** — Hoisted formatter (1 instance instead of 7 per render)
- **NOW label Arabic** — Added `[lang="ar"]` CSS override for "الآن"
- **Countdown 1s** — Moved updateCD into tickClocks (was 10s interval, seconds looked broken)

## [1.7.8] – 2026-06-16

### Fixed
- **Password hash** — Corrected pre-computed hash (was MD5 of "password", now actual hash of "thequrangroup")
- **AudioContext leak** — Single shared instance reused across calls
- **Countdown accuracy** — Removed 24h clamp, shows actual time to next prayer
- **Day header i18n** — Class timetable day names use Intl for Arabic
- **Nominatim User-Agent** — Version bumped to 1.7.8

## [1.7.7] – 2026-06-16

### Fixed
- **Password plaintext removed** — Pre-computed hash constant, plaintext never in source
- **detectUser race condition** — Init restores from localStorage before London fallback
- **loadSavedCities ordering** — Custom geocoded cities restored to POOL before ID lookup
- **iCal meeting window date** — Uses Intl for user timezone date (near-midnight fix)
- **UTC offset display** — Shows +5:30 instead of +5.5 for half-hour timezones
- **Quick Links translation** — Added id, fixed broken CSS selector
- **City row CSS** — Removed orphaned accent styling from removed user row

## [1.7.6] – 2026-06-16

### Fixed
- **Light mode prayer block contrast** — Background opacity increased for WCAG AA compliance
- **Time normalization** — Replaced repetitive while loops with `(x + 24) % 24` modulo pattern

## [1.7.5] – 2026-06-16

### Fixed
- **iCal meeting window UTC** — Local selection times now converted to UTC using user's timezone offset
- **Nominatim User-Agent** — Added per Nominatim ToS requirement
- **Prayer block focus** — Added `:focus` CSS with outline for keyboard navigation
- **Class overlay accessibility** — Added `title` and `aria-label` with teacher + time info
- **Privacy modal dismiss** — "Got it" button now sets localStorage and hides banner
- **City row hover** — Increased opacity from 0.01 to 0.03 for visibility
- **fmtH Infinity** — Now handles `Infinity` and `-0` inputs
- **loadFromURL validation** — Coordinates validated before adding cities

## [1.7.4] – 2026-06-16

### Fixed
- **Course panel i18n** — All hardcoded English strings now translatable to Arabic (attendance, deposit, quick links, WhatsApp groups, timetable, meeting links, recording links, I'm Enrolled)
- **Prayer block keyboard accessibility** — Added `tabindex="0"`, `role="button"`, and Enter/Space key handlers

## [1.7.3] – 2026-06-16

### Fixed
- **iCal midnight wrap** — Duration calculation handles classes crossing UTC midnight (`if (durH < 0) durH += 24`)
- **detectUser fallback** — Preserves London coords (51.51, -0.13) when no saved location exists
- **dateKey memoized** — Per-timezone cache avoids `Intl.DateTimeFormat` in drag hot path
- **Notifications at midnight** — `schedulePrayerNotifs()` re-called after midnight refresh
- **Screen reader spam** — `aria-live="polite"` moved from status-bar to status-badge only
- **Ruler labels** — Added `aria-hidden="true"` to prevent screen reader spam
- **RTL timeline** — Forced `direction: ltr` on timeline/ruler containers
- **Prayer block overflow** — Width capped at timeline boundary for midnight-wrapping blocks
- **Resize handles** — Added `role="button"` and `aria-label` for accessibility
- **iCal XSS** — `sanitizeName()` now strips newlines (`\n\r`)
- **getComputedStyle caching** — `--label-w` cached, refreshed on resize only
- **Dead code** — Removed unused `dk` variable from `checkConflicts()`
- **fmtH NaN** — Returns `--:--` instead of `NaN:NaN` on invalid input

## [1.7.2] – 2026-06-16

### Fixed
- All 12 audit findings from Kimi 2.7 review verified and confirmed in main index.html
- Note: Previous reviewer (Kimi) read from stale `.worktrees/` copy — all fixes were already in main file

### Verified (from v1.7.1)
- Geocoding ID collision fix at line 1789 (`*100)/100`)
- Dead user row code removed (file: 1942 lines, was 1970)
- Notifications gated on `userCity?.lat` at line 1923
- iCal RRULE at line 1624
- `getOffsetForDate()` at lines 1415, 1444
- `aria-valuenow="10"` at line 532
- Stale `mOffset` comment removed
- Cache pruning `filter+delete` at line 914
- Prayer block `aria-label` at line 1053
- `tabindex="0"` on resize handles at lines 533-534
- `SUBJECTS` map at lines 777, 1083
- `_lastGeoCall` rate limit at lines 1768, 1779-1780

## [1.7.1] – 2026-06-16

### Fixed
- **Geocoding ID collision** — Lat/lng rounded to 2 decimal places instead of integers, preventing distinct cities from getting identical IDs
- **Dead user row code** — Removed placeholder row, pin icon, YOU badge, and `isUser` checks from `renderRow()` (user row no longer rendered)
- **Notifications before geolocation** — `schedulePrayerNotifs()` now gated on `userCity.lat` to prevent scheduling for wrong location
- **iCal recurrence** — Enrolled class events now include `RRULE:FREQ=WEEKLY;BYDAY=XX` for recurring weekly events
- **compCls DST off-by-one** — London offset now computed per class date via `getOffsetForDate()`, not current date
- **ARIA aria-valuenow** — Fixed initial HTML value to match post-init state
- **Prayer block accessibility** — Added `aria-label` with prayer name and time range
- **Cache pruning** — Simplified to `filter().forEach(delete)` pattern
- **Stale comment** — Removed outdated `mOffset` reference in `detectUser`

### Added
- **Arabic class subjects** — `SUBJECTS` translation map for course overlay labels
- **Nominatim rate limit** — 1s minimum between geocoding requests

### Changed
- **Selection bar tabindex** — Moved from parent overlay to resize handles for better mobile keyboard UX

## [1.7.0] – 2026-06-16

### Fixed
- **Prayer timing accuracy** — Blocks now use `pd.loc[name]` (local prayer times) directly for positioning instead of converting UTC→master via `toMaster()`. This eliminates the timezone offset confusion where blocks were shifted by the user's local offset relative to UTC.
- **Conflict detection** — Now compares local prayer times against the selection directly, consistent with visual block positioning.
- **NOW line** — Uses `getLocalHours(userCity.tz)` directly instead of UTC→master conversion.
- **Class overlays** — `compCls()` now properly converts London local class times to UTC by subtracting the London offset (BST=UTC+1, GMT=UTC+0). Overlays on the timeline convert UTC to each city's local time.
- **Course panel toggle** — Panel now properly shows locked/unlocked state based on session storage when opened. Previously the toggle logic was inverted.
- **iCal export** — Now exports enrolled class events at correct times in addition to the selected meeting window.

### Removed
- **Globe/Qibla wireframe** — Canvas-based Earth visualization removed (~200 lines). Was janky on desktop, not useful for the app's purpose.
- **"You" user row** — User's detected location row removed from the timeline. User city still used for prayer calculations but no longer displayed as a row.
- **`toMaster()` function** — Eliminated entirely. All positioning now uses local times directly.
- **`mOffset` variable** — No longer needed. Was the source of the timing bug (set to user's London offset, applied to all cities).

### Changed
- **Prayer block positioning** — Uses `pd.loc[name]` (local hours) directly instead of `toMaster(pd.utc[name])`.
- **Sunrise marker** — Uses `pd.loc.Sunrise` directly.
- **Ruler NOW marker** — Uses `getLocalHours()` directly.
- **All timing functions** — Eliminated unnecessary UTC→master conversion layer.

## [1.6.3] – 2026-06-15

### Added
- **Wireframe globe** — Canvas-based Earth visualization below city list
  - Coastlines, latitude/longitude grid, city dots at correct positions
  - Red dots with pulsing antenna lines during prayer time
  - Teal dots for cities outside prayer time
  - Slow rotation (pauses on prefers-reduced-motion, pauses when off-screen)
  - Responsive to dark/light theme
- **"Use my location" button** — Replaces auto-prompt; shows in status bar until location is granted
  - User row shows hint text when location not yet granted
  - Translated to Arabic

### Fixed
- **Timezone offset** — Replaced getOff() with proper Intl UTC-parts calculation
- **Cache key** — Now includes coordinates, method, and local date (not just city ID)
- **Light mode labels** — City name/clock/offset use CSS vars instead of hardcoded colors
- **fmtH 9:60** — Fixed rounding that could produce invalid times
- **compCls** — Uses Intl for London date (works from any timezone)
- **hidden class** — Added missing `.hidden { display: none !important }`
- **Course button title** — Fixed to say "Course info" not "Settings"
- **mOffset refresh** — Updates before renderAll to prevent race condition
- **Globe battery** — Pauses when off-screen via IntersectionObserver
- **Touch targets** — All buttons/chips 44px on coarse pointer devices
- **Modal Escape** — Pressing Escape closes open modals
- **Status bar a11y** — Added aria-live="polite" for screen readers
- **Canvas a11y** — Added aria-hidden="true" to decorative globe
- **Footer links** — Added noreferrer to external links

## [1.6.2] – 2026-06-15

### Fixed
- **Countdown timezone** — Uses API timezone (pd.tz) instead of userCity.tz for accurate countdown
- **User city tz update** — User's city now updates timezone from API response
- **Remove button touch target** — Increased from 16px to 28px for mobile accessibility
- **iCal export** — Uses UTC timestamps instead of local time (was timezone-offset)
- **Course password error** — Now translated to Arabic when lang=ar
- **Canvas resize** — Debounced to 300ms (was 150ms)
- **Dead code removed** — Empty forEach in updateUI
- **Conflict detection midnight-wrap** — Fixed inverted overlap logic for blocks wrapping midnight
- **Fallback duration** — Single source of truth (FALLBACK_DUR const) for prayer block widths and conflict detection
- **Service worker** — Removed broken sw.js registration (file didn't exist)
- **Cache refresh** — Now refreshes at local midnight instead of every 30 min
- **Mobile touch targets** — All interactive elements now 44px on mobile (resize handles, icons, prayer blocks, remove buttons)
- **Background pattern** — Replaced canvas with CSS SVG pattern (zero JS, GPU-composited, no battery drain)
- **Dead code** — Removed unused fmtICal function

### Changed
- **Islamic background** — Now CSS SVG data-URI instead of canvas (faster, sharper, no resize redraw)
- **Dead PWA refs removed** — manifest link and CSP worker-src/manifest-src removed (no sw.js exists)

### Security
- **CSP tightened** — Removed unused worker-src and manifest-src directives

### Accessibility
- **Selection bar a11y** — Added role="slider", aria-label, aria-valuenow/valuetext, focus ring
- **Cache eviction** — Stale day-keys pruned on each fetch to prevent memory leak

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
