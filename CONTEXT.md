# World Prayer Times — Full Context

**Version:** 1.28.0 | **Live:** https://prayer.mscarabia.com | **Repo:** https://github.com/defaltadmin/world-prayer-times

**Stack:** Single-file vanilla JS, Aladhan API, Nominatim, Cloudflare Pages + Worker

---

## File & Folder Structure

```
world-prayer-times/
├── index.html              ← THE ENTIRE APP (~2700 lines, ~150KB)
│   ├── <style> (~680 lines)   CSS: vars, glass, prayer blocks, responsive
│   ├── Constants (~200 lines)  City presets (13 with nameAr), classes (13 slots), i18n
│   ├── State (~30 lines)       Plain let globals (cities, cache, selStart, enrolled, lang...)
│   ├── Utilities (~100 lines)  localToUTC, utcToLocal, getOffsetHours, getOffsetForDate, fmtH
│   ├── API (~80 lines)         fetchPrayer — Aladhan, 10s timeout, caching
│   ├── Rendering (~300 lines)  renderRow, renderAll, renderClassesRow, renderRuler, drawGridlines
│   ├── Conflict (~60 lines)    checkConflicts — Map-based O(n)
│   ├── Classes (~60 lines)     compCls — London times → UTC, rolls forward to next week
│   ├── Geocoding (~80 lines)   Nominatim, 400ms debounce + 1s rate limit
│   ├── iCal (~60 lines)        RFC 5545: RRULE, DTSTAMP, escaped descriptions, 72-char fold
│   ├── Notifications (~40 lines) Browser Notification API, 5 min before prayer
│   ├── UI (~200 lines)         Drag selection (15-min snap), resize, keyboard
│   ├── Course (~80 lines)      unlockCourse(pw), lockCourse, _renderMeetingLinks
│   ├── Effects (~100 lines)    Dot grid canvas, border glow (static), location coach-mark
│   └── Init (~80 lines)        Loads state, renders, starts intervals
│
├── manifest.json            PWA manifest — app name, theme, SVG icons
├── sw.js                    Service worker — network-first nav, cache-first assets
├── _headers                 CSP (Aladhan + Nominatim + Worker URL), HSTS, security headers
├── _redirects               SPA fallback, robots.txt exclusion
├── robots.txt               Crawler directives
├── wrangler.toml            Cloudflare Pages config
│
├── worker/                  Cloudflare Worker (separate deployment)
│   ├── index.js             Worker script — password hash + meeting links API
│   └── wrangler.toml        Worker config (name: prayer-times-links)
│
├── package.json             Scripts only (wrangler deploy), no runtime deps
├── CHANGELOG.md             Version history (1.0.0 → 1.25.3)
├── CONTEXT.md               This file — everything for AI review
├── PRD.md                   Product requirements document
├── README.md                Project docs
├── SECURITY.md              Security policy
├── LICENSE                  MIT
├── .gitignore               node_modules, .wrangler, Lighthouse JSONs
└── .git/                    Git repo (default branch: main)
```

---

## What It Does

A prayer times coordination tool for Muslims worldwide. Users see prayer times for multiple cities on a 24-hour visual timeline, find safe meeting windows that don't conflict with Salah, manage a class schedule, and export to calendar.

---

## Security Model

### Meeting Links (Cloudflare Worker)

Meeting links are **not in the frontend source code**. They live in a Cloudflare Worker:

1. Student types password → `attemptUnlock()` → `unlockCourse(val)` → `fetch(Worker, {headers: {'X-Course-Pw': rawPassword}})`
2. Worker hashes password server-side (same algorithm as frontend `hashStr()`), compares against stored hash `988ecb15`
3. On match: returns JSON array of 7 Teams meeting URLs
4. Frontend caches in `sessionStorage.wp_links` and renders via DOM APIs
5. On reload: reads from cache (no re-fetch needed)
6. On lock: clears cache + DOM + memory

**Key security properties:**
- `COURSE_PW_CHECK` hash is in frontend source (UI gate only) — NOT sent to Worker
- Worker accepts only raw password, hashes server-side
- Scraping the hash from source → Worker rejects it (hash is no longer a valid password)
- `Cache-Control: no-store` on Worker responses
- CSP allows only the specific Worker domain (not wildcard)

**Worker URL:** `https://prayer-times-links.info-mscarabia.workers.dev/api/links`

### Other Security
- CSP via meta tag + `_headers` (Aladhan + Nominatim + Worker URL only)
- X-Frame-Options: DENY
- Geocoded names sanitized (HTML, quotes, bidi)
- Password hash pre-computed (local UI gate only)
- Nominatim rate limited (1s + debounce)

---

## JS State Model

Plain `let` globals (no state object — S/alias system was removed in v1.22.0 due to async render race conditions):

- `cities`, `cache`, `selStart`, `selDur` — core app state
- `enrolled` — class enrollments (persisted to localStorage `wp_e2`)
- `lang`, `h24`, `dark`, `alarm` — user preferences
- `userCity` — detected/saved location
- `_meetingLinks` — fetched from Worker (memory only, cleared on lock)

---

## Timezone Conversion

Single-source-of-truth utilities:
- `localToUTC(localH, offset)` — `(((localH - offset) % 24) + 24) % 24`
- `utcToLocal(utcH, offset)` — `((utcH + offset) % 24 + 24) % 24`
- `getOffsetHours(tz)` — current moment offset via `Intl.DateTimeFormat`
- `getOffsetForDate(tz, y, m, d)` — DST-aware offset for specific date

All timezone math uses these utilities. No inline offset subtraction remains.

---

## Features

### Core
- 24h timeline with colored prayer blocks (Fajr=cyan, Dhuhr=gold, Asr=orange, Maghrib=red, Isha=purple)
- Fixed 30-min visual blocks (intentionally decoupled from conflict detection)
- Aladhan API (10s timeout, cached per city+date)
- Multi-city: 5 presets + unlimited via Nominatim (capped at 20)
- Selection bar: 15-min snap, drag + keyboard
- Conflict detection: Map-based O(n), shows which prayer/cities
- NOW line: pure CSS calc, continuous
- 30-min dotted gridlines
- Inline classes row at bottom of timeline
- Prayer block click centers selection in user's timezone (converts through UTC)

### Azkar Ticker (NEW)
- Floating pill at bottom: glass morphism, centered, 520px max, rounded 16px
- 32 adhkar (19 shared + 6 morning + 7 evening) with Arabic, transliteration, English
- A'udhu bi kalimat is evening-only (Ahmad/Nasai, Hisn #97)
- Controls: prev/next navigation, pause/play, counter (1/N), close
- Toggle checkboxes: show/hide transliteration, show/hide translation (persisted to localStorage)
- Auto-advance: reading-time-based (Arabic char count × 40ms, clamped 5–15s)
- Pause/resume: freezes current adhkar, resumes timer without re-fading
- Cross-fade transitions with progress bar
- aria-live gated to user-initiated only (no screen reader spam) — both Arabic and English divs
- aria-hidden on collapsed tr/en divs (prevents screen reader announcement of hidden content)
- Dismiss time-scoped to 24h (re-appears next day)
- Safe-area insets for iPhone home indicator
- prefers-reduced-motion respected
- Arrow key scope guard: global keydown skips when focus is inside azkar bar
- Period re-evaluation: 60s interval compares list, rebuilds only if period changed
- Geocoded cities: uses pd.tz from prayer cache (not city.tz which may be stale UTC)

### Course System
- Password-gated (hash-based local check + Worker API for links)
- Class timetable (13 slots/week, verified against TQG PDF)
- Enrolled classes overlay on timeline + dedicated classes row
- Class countdown rolls forward to next week after today's last class
- Per-class Teams meeting links (fetched from Worker on unlock, cached in sessionStorage)
- WhatsApp groups, timetable PDF, recording links

### Export & Sharing
- iCal export (RFC 5545: RRULE, DTSTAMP, escaped descriptions, 72-char folding)
- Share link (URL with cities, time window, language)

### UX
- Dark/light theme (CSS vars, label shows target state)
- Full Arabic RTL (prayer names, city names via `getCityName()`, Hijri date, Nominatim Accept-Language)
- Glass morphism, dot grid, border glow (static, no RAF loop)
- Location coach-mark (transparent overlay, ring)
- Location button stays visible after enabling
- Toast notifications, privacy banner + modal
- Card nav slide-out menu
- FAB add-city on mobile
- PWA (manifest + service worker, network-first for navigation)
- Donation link in footer (LaunchGood)

### Accessibility
- `role="main"` + `aria-label` on timeline
- Meeting links toggle: `role="button"`, `tabindex="0"`, `aria-expanded`, keyboard handler
- Dropdown: `role="group"`, `aria-label`
- Focus trap on modals + card nav
- `aria-live="polite"` on status badge
- Touch targets ≥44px (includes `.info-link`, `#meeting-links-toggle`)

### Mobile
- Safe area insets (iPhone notch/home indicator)
- `viewport-fit=cover`
- `overscroll-behavior-y: contain` (no pull-to-refresh)
- Input font-size 16px (no iOS auto-zoom)
- City name `text-overflow: ellipsis` for long Arabic names
- Touch drag tracks `touch.identifier` (no multi-touch hijack)

### Performance
- Non-render-blocking fonts
- Resize debounced
- `updateClsCountdown` runs every 10s (not every 1s)
- Glass blur reduced on mobile

---

## Version History

| Version | Key Changes |
|---------|-------------|
| **1.28.0** | Azkar ticker: floating pill cycling 32 morning/evening adhkar (Arabic + transliteration + English), navigatable, pauseable, toggle transliteration/translation, localStorage persistence, dismiss 24h, aria-live gated, safe-area, reduced-motion. 5 Opus review rounds, 21 fixes: corrected 7 repeat counts, geocoded tz, aria-live English, navigate guard, pause/resume without re-fade, aria-hidden collapsed divs, arrow key scope guard, period re-evaluation, A'udhu bi kalimat moved to evening-only, skeleton rows, countdown pill removed, transliteration typo, timer race, state-stomp guard. |
| **1.27.2** | Folder cleanup: consolidate to single index.html, CLS fix (hero space reservation), tabular-nums countdown, staggered row entrance, reduced-motion hardening, prayer label no-wrap |
| **1.27.1** | Round 2: hero never-empty, prayer short codes, tl-min floor, light contrast, 100dvh, loader timing |
| **1.27.0** | Opus audit Phase 1-4: brand color unified (teal), hero countdown, prayer contrast 0.85, haptics, type scale tokens, theme transition, responsive (tablet/landscape/FAB safe-area), og:image, apple-touch-icon |
| **1.26.1** | Background fix: `--surface` moved to `html`, `body` transparent — dot grid + gradient now render |
| **1.26.0** | Redesign: Add City polish, footer shimmer bar, legend chips, meeting links accordion with skeleton/chevron/aria |
| **1.25.4** | Panel z-index fix (NOW line behind panel), meeting links error fallback with retry |
| **1.25.3** | CSP Worker URL fix, centerSel timezone bug, compCls dedup, Worker server-side hash |
| **1.25.2** | unlockCourse scope bug fix (pass pw as param, sessionStorage cache) |
| **1.25.1** | Send raw password to Worker, hash server-side |
| **1.25.0** | Meeting links served from Cloudflare Worker |
| **1.24.0** | GLM audit: 12 fixes (countdown, SW, iOS, safe area, perf, pull-to-refresh, theme, touch, DOM APIs) |
| **1.23.0** | Teams links behind password gate |
| **1.22.0** | S/alias dual-state removed, renderClassesRow London offset, a11y, sweepLogo removed |
| **1.21.0** | Bookmarks removed, footer donate, privacy visible, meeting links dropdown |
| **1.19.0** | PWA, Arabic fixes, inline classes row |
| **1.18.0** | UTC consolidation (localToUTC/utcToLocal) |
| **1.17.x** | Privacy fixes, CSP cleanup, visual polish |

---

## Audit Trail (102 fixed items)

Do NOT report these again. Verified across 12+ audit rounds:

1–9: Loader timing, double renderAll, midnight refresh, cache busting, iCal DTSTAMP, fetch timeout, Nominatim UA, localStorage try/catch
10–16: Blank page fix, class overlay London day, notification timer leak, null guards, AudioContext .catch(), loader error path, enrolled validation
17–26: Course panel, prayer block width, cache-key drift, mobile label init, iCal escaping, btn-now/location guards, resize re-layout, prayer 00:00, midnight DST, conflict O(n)
27–34: Countdown grace, NOW line CSS, card nav inert, prayer+class overlap, glassmorphism, ruler labels, Lighthouse a11y, border-radius
35–41: CSP beacon, class timetable, Sheikh prefix, enrolled key, location onboarding, non-render fonts, deposit removed
42–56: Visual overhaul (palette, font, NOW line, gridlines, 15-min snap, spotlight, mobile, progress, animations, prayer overflow, CSP clean, Friday removed, blocks 30min, scroll-to-now removed, palette reverted)
57–74: Popup viewport clamp, FAB color, coords 1dp, CSP cleaned, privacy banner, iCal escaping, focus trap, ARIA, Safari AbortSignal, scroll sync, AudioContext unlock, prayer text horizontal, coach-mark, privacy link, volume slider, iCal fold, dead click handler, ringPulse keyframe
75–84: S/alias dual-state removed, renderClassesRow London offset, meeting links toggle a11y, sweepLogo RAF removed, mobile touch targets, city name overflow, Teams links behind password gate, unlockCourse scope fix, raw password to Worker, Worker server-side hash, CSP Worker URL fix, centerSel timezone fix, compCls timestamp dedup
85–90 (Opus v1.27.0): Brand color unified (teal), duplicate prayer-block CSS removed, theme-color synced, API fallback toast, dot-grid RAF loop stop, og:image meta tags
91–96 (Opus v1.27.0): Type scale tokens, hero countdown, prayer contrast 0.85, haptics (vibrate), focus-visible FAB+meeting-links, theme transition
97–102 (Opus v1.27.0): backdrop-filter 16px, apple-touch-icon, emoji→SVG, tablet breakpoint, FAB safe-area, landscape legend collapse
103–107 (Opus v1.27.2): CLS fix (hero height reservation), tabular-nums countdown, staggered row entrance animation, reduced-motion decorative neutralization, prayer label no-wrap lock

---

## Design Decisions (do NOT flag as issues)

- `'unsafe-inline'` required for single-file static app
- Prayer blocks fixed 30min — intentionally decoupled from conflict detection
- Card Nav sits OUTSIDE `#app` — inert safety
- NOW line uses pure CSS calc
- Countdown uses 2-min grace
- `pd.loc[name]` values are in `pd.tz` timezone
- 15-min snapping is intentional
- Gridlines drawn once
- Palette is teal/cyan (CSS variables)
- Font is IBM Plex Sans Arabic
- FAB only visible on mobile
- Nominatim User-Agent can't be set client-side
- 3-5 cities doesn't need virtualization
- Meeting links: Worker auth is defense-in-depth, not substitute for Teams lobby-enabled meetings
- `COURSE_PW_CHECK` in frontend is UI gate only — Worker hashes raw password server-side
- Share link doesn't include timezone context — recipient gets sharer's selStart in their own timezone

---

## Known Issue (fixed)

### Backgrounds not rendering — FIXED in v1.26.1
Root cause: `body { background: var(--surface) }` was opaque, painting over the fixed canvas (`#dot-grid`, z-index 0) and `body::before` gradient (z-index -1). z-index never mattered — the solid color was always on top.
Fix: Moved `--surface` to `html`, set `body { background: transparent }`. Both backgrounds now render correctly.

---

## Deployment

```bash
# Frontend — auto-deploys to prayer.mscarabia.com on push to main
git push origin main

# Worker — deploys to prayer-times-links.info-mscarabia.workers.dev
cd worker && wrangler deploy
```

**Single branch:** `main` — push to deploy.

---

## Code Map (key line numbers in index.html)

| Area | Lines | Notes |
|------|-------|-------|
| CSS variables | 27–46 | `:root` |
| Safe area CSS | 641–642 | `env(safe-area-inset-*)` |
| iOS input fix | 667 | `font-size: 16px !important` |
| Meeting links CSS | 440–450 | `.meeting-link-item` |
| Prayer blocks | 378–401 | Fixed 30min, 5 colors |
| centerSel (timezone-fixed) | ~1425 | Converts city local → UTC → user local |
| Selection bar | 412–432 | 15-min snap |
| NOW line | 434–447 | Pure CSS calc |
| Card nav | 164–211 | Slide-out |
| Location coach | 646–660 | Transparent overlay |
| State globals | ~1050 | Plain `let`s |
| `localToUTC()` | ~1204 | `(((localH - offset) % 24) + 24) % 24` |
| `getOffsetForDate()` | ~1206 | DST-aware offset |
| `fetchPrayer()` | ~1260 | Aladhan API + cache |
| `renderRow()` | ~1368 | City row + prayer blocks |
| `renderClassesRow()` | ~1497 | Inline classes (Intl-based London offset) |
| `renderAll()` | ~1536 | Renders all rows |
| `checkConflicts()` | ~1694 | Map-based O(n) |
| `compCls()` | ~1870 | London → UTC, rolls forward, reuses utcStartH for ts |
| `unlockCourse(pw)` | ~2167 | Fetches from Worker, caches in sessionStorage |
| `_renderMeetingLinks()` | ~2195 | Builds DOM from links array |
| Geocoding | ~2220 | Nominatim + debounce + dynamic Accept-Language |
| `exportICal()` | ~2100 | ICS + RRULE + DTSTAMP |
| Notifications | ~2380 | Browser Notification API |
| Selection drag | ~1760 | Tracks touch.identifier |
