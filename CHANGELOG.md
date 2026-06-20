# Changelog

All notable changes to World Prayer Times are documented here.

## [1.23.0] — 2026-06-20

### Fixed
- **Teams meeting links behind password gate** — Meeting link URLs (containing auth tokens) are no longer in the initial HTML. They are injected into the DOM only when the course panel is unlocked via password. Cleared from DOM on lock. Prevents source-view access to class meeting links.

## [1.22.0] — 2026-06-20

### Fixed
- **CRITICAL: Removed `S`/alias dual-state system** — Reverted to plain `let` globals. The `S` object + `_syncAliases()`/`_writeAliases()` pattern introduced a silent correctness bug: when `renderAll()` is async, mutations to aliases mid-flight get overwritten by stale `S` values on the next render cycle. Plain globals were never the actual problem.
- **`renderClassesRow()` London offset** — Fixed to use `Intl.DateTimeFormat` for London's calendar date instead of UTC date, preventing wrong DST offset around BST/GMT transitions.
- **Meeting links toggle accessibility** — Added `role="button"`, `tabindex="0"`, `aria-expanded`, `aria-controls`, and `Enter`/`Space` keyboard handler. Added `role="group" aria-label` to the dropdown container.
- **Removed `sweepLogo()` perpetual RAF** — Logo border-glow is now static (no animation loop). Eliminates a never-ending `requestAnimationFrame` chain.
- **Mobile touch targets** — Added `.info-link` and `#meeting-links-toggle` to the `@media (pointer: coarse)` selector for 44px minimum touch targets.
- **City name overflow** — Added `overflow:hidden; text-overflow:ellipsis` on mobile for long Arabic city names.
- **Meeting links styling** — Replaced inline `style.cssText` with proper CSS classes (`.meeting-link-item`, `.meeting-link-name`, `.meeting-link-join`).

## [1.21.0] — 2026-06-20

### Fixed
- **Removed bookmarks** — Removed entire bookmark/save-window feature (not useful enough, would confuse users).
- **Donate in footer** — Moved donation link from floating popup to inline footer section (always visible, no dismissal needed). Links to LaunchGood campaign.
- **Privacy policy visible** — Footer privacy link now uses accent color + font-weight 600 so it's clearly visible (was muted color, easy to miss).
- **Meeting links dropdown** — Replaced Google Doc link with expandable dropdown showing per-class Microsoft Teams join links (Adab, Aqaaid, Arabic, Fiqh, Hadith, Seerah, Tafseer).

## [1.20.0] — 2026-06-20

### Added
- **Multiple meeting slots (bookmarks)** — Save and compare multiple safe windows on the timeline. Click the bookmark icon (flag) in the status bar to save the current selection. Bookmarked windows appear as translucent cyan bands on the ruler. Click any band to jump to that window. Delete with the × button on hover. Persisted to localStorage. Prevents duplicate saves at the same position. Shows count on the icon when bookmarks exist.

## [1.19.0] — 2026-06-20

### Added
- **PWA support** — Added `manifest.json` with app name, theme, and icons. Added `sw.js` service worker with cache-first strategy for static assets and network-first for API calls. Added `<link rel="manifest">` and Apple meta tags. CSP updated with `worker-src 'self'` and `manifest-src 'self'`.
- **Donation popup** — Floating corner popup linking to LaunchGood campaign (Keep Quran Classes Free for 500 Students). Dismissible, auto-hides after tap.
- **Inline classes row** — Dedicated "Classes" row at the bottom of the timeline showing enrolled classes for today as teal blocks. Uses London offset for accurate positioning. Shows class count and subject names. Only appears when classes are enrolled and today has scheduled classes.

### Fixed
- **Location icon stays visible** — After enabling geolocation, the location button now stays visible with accent color and "Location enabled" title instead of disappearing.
- **Arabic: city names** — Added `nameAr` to all 13 city presets. Added `getCityName()` helper. City labels, popular chips, search results, and conflict badges now show Arabic names when `lang='ar'`.
- **Arabic: Nominatim search** — Geocoding API `Accept-Language` header now switches between `'ar'` and `'en'` based on current language setting.
- **Arabic: date/time formatting** — Header date, city clocks, and Hijri date now use `'ar-EG'` locale when language is set to Arabic (was hardcoded `'en-US'`).

## [1.18.0] — 2026-06-20

### Refactored
- **Consolidated UTC conversion** — Extracted `localToUTC()` and `utcToLocal()` utilities. Replaced 3 duplicated inline offset-subtraction patterns in `fetchPrayer()`, `compCls()`, and `exportICal()` with shared functions. Also replaced manual `(utc + offset + 24) % 24` patterns in `checkConflicts()` and `renderRow()`. Single source of truth for timezone math.
- **Consolidated `getOffsetForDate()`** — Moved from class-schedule section to time utilities section (alongside `getOffsetHours()` and `getOff()`). Same function, same code, better discoverability.
- **State object (`S`)** — All mutable state (cities, cache, selStart, selDur, userCity, enrolled, lang, alarm, etc.) collected into a single `S` object. Added `setState()` for controlled mutation. Existing `let` aliases preserved for backward compatibility, synced via `_syncAliases()`/`_writeAliases()` at render boundaries.

## [1.17.1] — 2026-06-19

### Fixed
- **Location coach dead click listener** — Removed `#loc-overlay` click handler (element has `pointer-events:none` so it could never fire). Clicking outside the coach card now behaves the same as clicking nowhere; only the explicit "Skip for now" / "Enable" buttons dismiss it.
- **Orphaned `@keyframes ringPulse`** — Removed dead CSS animation (leftover from dark overlay removal in v1.17.0). No element references it anymore.

## [1.17.0] — 2026-06-19

### Privacy (GLM audit)
- **H1: Coords rounded to ±11km** — GPS stored as 1dp (was 3dp). Migration downgrades existing 3dp to 1dp. Matches privacy policy promise.
- **H2: CSP cleaned** — Removed dead Google Analytics / Zaraz / RUM allowances from both meta tag and `_headers`. CSP now only allows Aladhan API + Nominatim.
- **H3: Privacy banner no longer fakes consent** — Auto-hide after 5s only hides the banner, doesn't write `wp_privacy_ok`. Only the OK/Got it buttons mark consent.

### Fixed
- **M1: iCal SUMMARY escaped** — `esc()` applied to SUMMARY and class DESCRIPTION per RFC 5545.
- **M2: Card nav focus trap** — Added `trapFocus()` to card nav menu (matches `aria-modal="true"`).
- **M3: Resize handles ARIA** — Removed `role="button"` (keyboard resize is via Arrow/[/], not handles).
- **M5: Safari AbortSignal fallback** — Feature-detects `AbortSignal.timeout` before using it. Safari 15 gets no signal instead of TypeError.
- **M6: Scroll sync** — Replaced decorative `_scrollLock` with `requestAnimationFrame`-based sync.
- **M7: AudioContext unlock** — Pre-arms on first `pointerdown`/`keydown` so class alarms play reliably.
- **L3: Dead `needsLocation` flag removed.**
- **L4: iCal line folding** — Fixed off-by-one (72 chars, was 73).

### Added
- **Prayer text horizontal** — Changed from vertical to horizontal with `clamp(0.5rem, 1.2vw, 0.7rem)` for dynamic scaling.
- **Location popup soft suggestion** — No dark overlay, just a floating coach-mark with ring highlight. Dismissible.
- **Privacy policy link** — Added to footer, opens privacy modal.
- **Volume slider** — Added to alarm settings UI (0-100%, controls oscillator gain).
- **Add city gradient** — Darker gradient background behind "Add City" row for visibility.

### Removed
- **Dark overlay from location coach-mark** — Replaced with transparent overlay (suggestion only).

## [1.16.1] — 2026-06-19

### Fixed
- **Palette reverted** — Restored original teal/cyan palette (gold experiment reverted per user preference). All 52 hardcoded color literals restored.
- **Location popup viewport clamp** — Coach-mark now centers under button, clamps to 12px viewport margins, adds caret arrow, repositions on resize. Mobile bottom-sheet at ≤520px. (Sonnet audit fix)
- **FAB icon color** — Updated to match teal palette (#091117 on #2dd4bf accent).

## [1.16.0] — 2026-06-19

### Visual Overhaul
- **Color palette** — Kept original teal/cyan palette (reverted gold experiment per user preference).
- **Font** — IBM Plex Sans Arabic replaces Inter. Native Arabic/Latin support, more distinctive than generic Inter.
- **NOW line** — Single continuous line across ruler and timeline (z-index 60, ruler-now bridges border gap with bottom:-4px).
- **30-min gridlines** — Faint dotted vertical lines every 30 minutes via `drawGridlines()` for drag reference.
- **Selection bar** — Snaps to 15-minute increments (quarters, 0.25h) instead of 30-minute halves. Keyboard step 0.25h.
- **Location spotlight** — Coach-mark overlay with pulsing ring around location button, dimmed background, "Enable" / "Skip for now" CTA. Replaces floating tooltip. Now properly clamped to viewport, adds caret arrow, mobile bottom-sheet at ≤520px, repositions on resize.
- **Mobile responsive** — Label width 90px (was 120px), horizontal prayer text on mobile, floating add-city FAB button (52px circle, fixed bottom-right).
- **Loading progress** — Progress bar + "Loading prayer times… (3/5)" with per-city tracking in `renderAll()`.
- **Smooth animations** — Material Design easing `cubic-bezier(0.4,0,0.2,1)` on modals, card nav, menu transitions.
- **Prayer text overflow** — Ellipsis on narrow blocks, min-width 22px prevents collapse.

### Fixed
- **CSP violations** — Added Cloudflare Zaraz/RUM domains to `_headers` CSP (`prayer.mscarabia.com/cdn-cgi/zaraz`, `/rum`). Console errors cleared.
- **Friday classes** — Confirmed no classes on Friday (Hadith removed, only Adab was previously removed).
- **Prayer blocks** — Fixed 30-minute visual duration (reverted from variable pw windows).
- **Scroll-to-now removed** — Header button and card nav item deleted (not useful).
- **Location popup** — Replaced floating tooltip with spotlight coach-mark (overlay + ring + positioned card).

### Removed
- **Scroll-to-now button** — Header clock icon and card nav "Scroll to Now" item
- **Location floating popup** — Replaced with spotlight coach-mark
- **Old loc-popup CSS** — Removed `.loc-popup` and `.loc-popup-arrow` styles

## [1.15.0] — 2026-06-19

### Fixed
- **CSP blocks Cloudflare beacon** — Added `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src` in both meta tag and `_headers`. Cloudflare beacon now loads without CSP violations.
- **Class timetable corrected** — Re-parsed from TQG PDF. Previous AI had ~9 of 14 wrong (wrong days, swapped subjects, phantom slots). Now exact match to official timetable. Removed Friday classes (no class from now on).
- **Teacher names** — Added "Sheikh" prefix to all teacher names (Sheikh Ammar, Sheikh Aakif, Sheikh Abdel-Nasser, Sheikh Ahmad, Sheikh Abdelaziz).
- **Enrolled storage key** — Bumped `wp_e` → `wp_e2` so users get a clean slate with corrected schedule.

### Added
- **Location onboarding banner** — Dismissible bottom banner: "Enable location for accurate prayer times where you are" with Enable / Not now buttons. Remembered via `wp_loc_prompted`. Auto-shows for new users without saved location. Header 📍 button remains as persistent fallback.
- **Non-render-blocking fonts** — Google Fonts loaded with `media="print" onload` swap pattern. Eliminates render-blocking CSS for Performance score.

### Removed
- **Deposit info-card** — Removed £100 deposit card from course panel (Attendance card + Quick Links untouched).

## [1.14.0] — 2026-06-19

### Fixed
- **Bug 1: Countdown wrong next prayer** — Added 2-min grace period so a just-passed prayer isn't skipped mid-minute. Uses `l > lh - GRACE` with undefined guard and `??` fallback for Fajr.
- **Bug 2: NOW line misaligned** — Replaced JS pixel math with pure CSS `calc(var(--label-w) + (100% - var(--label-w)) * ${m/24})`, matching ruler-now and prayer blocks exactly. No more width cache drift.
- **Bug 3: Card nav menu frozen/broken** — Moved `#card-nav-overlay` and `#card-nav-menu` OUTSIDE `#app` so `inert` on `#app` no longer disables the menu. All menu items, close button, and overlay clicks now work. Root cause was inert scope, not focus trapping.
- **Bug 4: Prayer + class text overlap** — Stacked vertically: prayer blocks in upper lane (`top:4px; bottom:18px`), class overlays as readable bottom bands (`height:13px; bottom:3px`). Row height bumped to 58px. Class text 0.45rem → 0.58rem with accent color.

### Added
- **robots.txt** — Static robots.txt for search engine crawlers. Excluded from SPA catch-all in `_redirects`. Fixes Lighthouse SEO `is-crawlable` flag (0.58 → 1.0).

### Polish
- **Glassmorphism** — Enhanced `.glass` with gradient overlay, deeper blur (24px), inset top highlight. Same highlight added to card nav menu.
- **Text readability** — Ruler labels 0.6rem → 0.65rem. Class overlay text bumped and given accent color for contrast.
- **Lighthouse a11y** — Added `role="main"` and `aria-label` to timeline region.
- **Border-radius** — Standardized modal and info-card from 14px/10px to 12px. Small elements (chips, buttons) keep 6-8px.

## [1.13.0] — 2026-06-19

### Fixed
- **H1: Prayer block width matches conflict window** — Visual blocks now use the actual prayer window (pw) from the API instead of a fixed 30-minute duration. Fajr, Asr, Isha blocks now correctly span up to 1.5h, matching what conflict detection uses. Fixes the core trust issue where "Safe Window" could appear despite overlapping prayer windows.
- **H2: Geocoded city cache-key drift** — prayerCacheKey() now includes `city.tz` in the key, preventing cache misses when renderRow updates a geocoded city's timezone from 'UTC' to the real tz. Also changed renderRow to use a local `tz` variable instead of mutating `city.tz`.
- **M1: Mobile label-width misalignment** — `_cachedLabelW` now initialized from computed CSS at startup, not just on resize. Fixes 20px NOW line / selection bar offset on mobile at first load.
- **M2: iCal line folding and escaping** — DESCRIPTION values now escaped (commas, semicolons, backslashes, newlines) per RFC 5545. All lines folded at 73 chars for Apple Calendar / Outlook compatibility.
- **M3: Guard btn-now and btn-location wirings** — Added `if (el)` null guards consistent with v1.12.0 fix pattern, preventing TypeError if elements are removed.
- **L1: Resize re-layouts selection bar** — Debounced `updateSel()` call added to resize handler so selection bar stays aligned after window resize / device rotation.
- **L2: Prayer at 00:00 notification fix** — Changed `!pt` to `pt === undefined` so a prayer at exactly midnight (possible at extreme latitudes) is not skipped.
- **L3: Midnight refresh DST-correct offset** — Uses `getOffsetForDate()` for the target midnight date instead of current offset, preventing 1h early/late refresh on DST transition nights.
- **L4: Conflict detection O(n²) → O(n)** — checkConflicts() builds a Map once instead of searching arrays inside the loop.

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

## [1.12.1] — 2026-06-18

### Fixed
- **Menu lock** — Escape key handler now removes `inert` from `#app` (was closing menu visually but leaving page frozen)
- **Prayer blocks fixed 30min** — All blocks now exactly 30 minutes wide (was variable based on next prayer time)
- **Prayer block typography** — White text (`#fff`), 0.7rem font, dark text-shadow for readability
- **Privacy banner auto-dismiss** — Banner hides after 5 seconds automatically

### Audit Notes
- Gemini visual audit: 3 fixes applied (menu lock, contrast, ruler)
- Gemini false positive: countdown timer already uses per-city timezone via `getLocalHours(pd.tz)`

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
