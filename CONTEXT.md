# World Prayer Times — Full Context

**Version:** 1.25.2 | **Live:** https://prayer.mscarabia.com | **Stack:** Single-file vanilla JS, Aladhan API, Nominatim, Cloudflare Pages + Worker

---

## What It Does

A prayer times coordination tool for Muslims worldwide. Users see prayer times for multiple cities on a 24-hour visual timeline, find safe meeting windows that don't conflict with Salah, manage a class schedule, and export to calendar.

---

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | THE ENTIRE APP — HTML + inline CSS (~680 lines) + inline JS (~2050 lines). ~2700 lines total. |
| `manifest.json` | PWA manifest — app name, theme, SVG icons |
| `sw.js` | Service worker — network-first for navigation, cache-first for static assets |
| `_headers` | Cloudflare Pages HTTP headers — CSP (includes Worker domain), HSTS |
| `_redirects` | SPA fallback, robots.txt exclusion |
| `robots.txt` | Crawler directives |
| `wrangler.toml` | Cloudflare Pages config |
| `worker/index.js` | Cloudflare Worker — serves meeting links only on correct password |
| `worker/wrangler.toml` | Worker config |
| `package.json` | Scripts only |
| `CHANGELOG.md` | Version history |
| `CONTEXT.md` | This file |
| `PRD.md` | Product requirements |
| `README.md` | Project docs |
| `SECURITY.md` | Security policy |
| `LICENSE` | MIT |

---

## Architecture

### Security Model (Meeting Links)

Meeting links are **not in the frontend source code**. They live in a Cloudflare Worker:

1. Student types password → `attemptUnlock()` → `unlockCourse(val)` → `fetch(Worker, {headers: {'X-Course-Pw': rawPassword}})`
2. Worker hashes password server-side, compares against stored hash
3. On match: returns JSON array of 7 Teams meeting URLs
4. Frontend caches in `sessionStorage.wp_links` and renders via DOM APIs
5. On reload: reads from cache (no re-fetch needed)
6. On lock: clears cache + DOM + memory

**Key security properties:**
- `COURSE_PW_CHECK` hash is in frontend source (UI gate only) — NOT sent to Worker
- Worker accepts only raw password, hashes server-side
- Scraping the hash from source → Worker rejects it
- `Cache-Control: no-store` on Worker responses

### JS State Model

Plain `let` globals (no state object). All mutable state at module level:
- `cities`, `cache`, `selStart`, `selDur` — core app state
- `enrolled` — class enrollments (persisted to localStorage)
- `lang`, `h24`, `dark`, `alarm` — user preferences
- `userCity` — detected/saved location
- `_meetingLinks` — fetched from Worker (memory only, cleared on lock)

### Timezone Conversion

Single-source-of-truth utilities:
- `localToUTC(localH, offset)` — `(((localH - offset) % 24) + 24) % 24`
- `utcToLocal(utcH, offset)` — `((utcH + offset) % 24 + 24) % 24`
- `getOffsetHours(tz)` — current moment offset via `Intl.DateTimeFormat`
- `getOffsetForDate(tz, y, m, d)` — DST-aware offset for specific date

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

### Security
- CSP (Aladhan + Nominatim + Worker domain, worker-src, manifest-src)
- X-Frame-Options: DENY
- Geocoded names sanitized
- Password hash pre-computed (local UI gate only)
- Nominatim rate limited
- Meeting links served from authenticated Worker (raw password hashed server-side)

---

## Version History

| Version | Key Changes |
|---------|-------------|
| **1.25.2** | Fixed unlockCourse scope bug: pass pw as param, cache links in sessionStorage |
| **1.25.1** | Send raw password to Worker, hash server-side (hash no longer accepted) |
| **1.25.0** | Meeting links served from Cloudflare Worker (real auth) |
| **1.24.0** | GLM audit: obfuscated links, class countdown roll-forward, SW network-first nav, iOS zoom, safe area, Intl perf, pull-to-refresh, theme label, multi-touch, DOM APIs |
| **1.23.0** | Teams meeting links behind password gate |
| **1.22.0** | Removed S/alias dual-state bug, fixed renderClassesRow London offset, a11y, removed sweepLogo RAF |
| **1.21.0** | Removed bookmarks, footer donate, privacy visible, meeting links dropdown |
| **1.20.0** | Multiple meeting slots bookmarks (later removed) |
| **1.19.0** | PWA, donation popup, location icon fix, Arabic fixes, inline classes row |
| **1.18.0** | UTC consolidation (localToUTC/utcToLocal), state object (later removed) |
| **1.17.x** | Privacy fixes, CSP cleanup, iCal escaping, visual polish |

---

## Audit Trail (74 fixed items)

Do NOT report these again. Verified across 12 audit rounds (MiMo, Z.ai, GLM 5.2, Gemini, Sonnet, GLM):

1–9: Loader timing, double renderAll, midnight refresh, cache busting, iCal DTSTAMP, fetch timeout, Nominatim UA, localStorage try/catch
10–16: Blank page fix, class overlay London day, notification timer leak, null guards, AudioContext .catch(), loader error path, enrolled validation
17–26: Course panel, prayer block width, cache-key drift, mobile label init, iCal escaping, btn-now/location guards, resize re-layout, prayer 00:00, midnight DST, conflict O(n)
27–34: Countdown grace, NOW line CSS, card nav inert, prayer+class overlap, glassmorphism, ruler labels, Lighthouse a11y, border-radius
35–41: CSP beacon, class timetable, Sheikh prefix, enrolled key, location onboarding, non-render fonts, deposit removed
42–56: Visual overhaul (palette, font, NOW line, gridlines, 15-min snap, spotlight, mobile, progress, animations, prayer overflow, CSP clean, Friday removed, blocks 30min, scroll-to-now removed, palette reverted)
57–74: Popup viewport clamp, FAB color, coords 1dp, CSP cleaned, privacy banner, iCal escaping, focus trap, ARIA, Safari AbortSignal, scroll sync, AudioContext unlock, prayer text horizontal, coach-mark, privacy link, volume slider, iCal fold, dead click handler, ringPulse keyframe
75–84: S/alias dual-state removed, renderClassesRow London offset, meeting links toggle a11y, sweepLogo RAF removed, mobile touch targets, city name overflow, Teams links behind password gate, unlockCourse scope fix, raw password to Worker, Worker server-side hash

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

---

## Code Map

| Area | Lines | Notes |
|------|-------|-------|
| CSS variables | 27–46 | `:root` |
| Safe area CSS | 641–642 | `env(safe-area-inset-*)` |
| iOS input fix | 667 | `font-size: 16px !important` |
| Meeting links CSS | 440–450 | `.meeting-link-item` |
| Prayer blocks | 378–401 | Fixed 30min, 5 colors |
| Selection bar | 412–432 | 15-min snap |
| NOW line | 434–447 | Pure CSS calc |
| Card nav | 164–211 | Slide-out |
| Location coach | 646–660 | Transparent overlay |
| State globals | ~1050 | Plain `let`s, no S object |
| `localToUTC()` | ~1204 | `(((localH - offset) % 24) + 24) % 24` |
| `getOffsetForDate()` | ~1206 | DST-aware offset |
| `fetchPrayer()` | ~1260 | Aladhan API + cache |
| `renderRow()` | ~1368 | City row |
| `renderClassesRow()` | ~1497 | Inline classes row (Intl-based London offset) |
| `renderAll()` | ~1536 | Renders all rows |
| `checkConflicts()` | ~1694 | Map-based O(n) |
| `compCls()` | ~1810 | London class times → UTC, rolls forward to next week |
| `unlockCourse(pw)` | ~2167 | Fetches from Worker, caches in sessionStorage |
| `_renderMeetingLinks()` | ~2195 | Builds DOM from links array |
| Geocoding | ~2220 | Nominatim + debounce + dynamic Accept-Language |
| `exportICal()` | ~2100 | ICS + RRULE + DTSTAMP |
| Notifications | ~2380 | Browser Notification API |
| Selection drag | ~1760 | Tracks touch.identifier |

---

## Deployment

```bash
# Frontend — auto-deploys to prayer.mscarabia.com from main branch
git push origin master:main

# Worker — deploys to prayer-times-links.info-mscarabia.workers.dev
cd worker && wrangler deploy
```

---

## Worker Setup

```
worker/
├── index.js        # Worker script (password hash + meeting links)
└── wrangler.toml   # Worker config
```

Worker URL: `https://prayer-times-links.info-mscarabia.workers.dev/api/links`
- `GET /api/links` with `X-Course-Pw: <raw password>` → 200 + JSON (on correct hash) or 403
- Same `hashStr()` algorithm as frontend, computed server-side

---

## Known Limitations

- Password is shared among all students (convenience gate, not real access control)
- CSP `'unsafe-inline'` required for single-file app
- `unsafe-inline` weakens XSS mitigation (not actionable without build step)
- DST midnight refresh may fire at wrong time once per year (spring forward)
- Teams lobby-enabled meetings would be the truly secure solution (option 3)
