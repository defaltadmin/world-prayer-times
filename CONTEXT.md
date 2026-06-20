# World Prayer Times — Full Context

**Version:** 1.23.0 | **Live:** https://prayer.mscarabia.com | **Stack:** Single-file vanilla JS, Aladhan API, Nominatim, Cloudflare Pages

---

## What It Does

A prayer times coordination tool for Muslims worldwide. Users see prayer times for multiple cities on a 24-hour visual timeline, find safe meeting windows that don't conflict with Salah, manage a class schedule, and export to calendar.

---

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | THE ENTIRE APP — HTML + inline CSS (~670 lines) + inline JS (~2050 lines). ~2700 lines total. |
| `manifest.json` | PWA manifest — app name, theme, SVG icons for installability |
| `sw.js` | Service worker — cache-first for static assets, network-first for API calls |
| `_headers` | Cloudflare Pages HTTP headers — CSP, HSTS, cache control |
| `_redirects` | Cloudflare Pages redirects — SPA fallback, robots.txt exclusion |
| `robots.txt` | Search engine crawler directives |
| `wrangler.toml` | Cloudflare Pages config |
| `package.json` | Scripts only (wrangler deploy), no runtime deps |
| `CHANGELOG.md` | Complete version history |
| `CONTEXT.md` | This file — everything Sonnet needs |
| `PRD.md` | Product requirements document |
| `README.md` | Project docs |
| `SECURITY.md` | Security policy |
| `LICENSE` | MIT |
| `.gitignore` | node_modules, .wrangler, Lighthouse JSONs |

---

## Architecture

### HTML Structure
- Loading screen with progress bar
- Islamic pattern background (CSS SVG)
- Dot grid canvas (interactive, mouse proximity)
- Header (logo, title, countdown, hamburger)
- Status bar (conflict badge, selection display, location button)
- Legend (prayer color key)
- Ruler (hour marks)
- Timeline (city rows + class row + selection bar + NOW line)
- Add City modal
- Privacy modal
- Course panel (slide-out)
- Card nav menu (slide-out, outside #app for inert safety)
- Footer (credits, privacy, donate link)

### CSS (~670 lines)
- CSS variables for all colors (teal/cyan palette)
- Glass morphism effects
- Prayer block styles (5 colors, hover/focus)
- Selection bar with resize handles
- NOW line (pure CSS calc)
- Card nav slide-out
- Location coach-mark (transparent overlay, ring)
- Modal system
- Responsive (mobile FAB, touch targets ≥44px)
- Reduced motion support
- RTL support

### JS (~2050 lines)

| Section | Lines | What |
|---------|-------|------|
| Constants | ~200 | City presets (13 with nameAr), class schedule (13 slots), prayer windows, i18n |
| State (`S` object) | ~30 | All mutable state collected, `setState()` with auto-render |
| Utilities | ~100 | `localToUTC()`, `utcToLocal()`, `getOffsetHours()`, `getOffsetForDate()`, `getLocalHours()`, `fmtH()`, `pct()`, `clamp()` |
| API | ~80 | `fetchPrayer()` — Aladhan API, 10s timeout, caching |
| Rendering | ~300 | `renderRow()`, `renderAll()`, `renderRuler()`, `drawGridlines()`, `renderClassesRow()`, `renderToggles()` |
| Conflict | ~60 | `checkConflicts()` — Map-based O(n) |
| Class schedule | ~60 | `compCls()` — London class times → UTC |
| Geocoding | ~80 | Nominatim, 400ms debounce + 1s rate limit, dynamic Accept-Language |
| iCal | ~60 | RFC 5545: RRULE, DTSTAMP, escaped descriptions, 72-char folding |
| Notifications | ~40 | Browser Notification API, 5 min before prayer |
| UI interactions | ~200 | Drag selection (15-min snap), resize, keyboard |
| Init/bootstrap | ~80 | Loads saved state, renders, starts intervals |
| Visual effects | ~100 | Dot grid canvas, border glow, spotlight, location coach-mark |

---

## Features (what's built)

### Core
- 24h horizontal timeline with colored prayer blocks (Fajr=cyan, Dhuhr=gold, Asr=orange, Maghrib=red, Isha=purple)
- Fixed 30-min visual blocks (intentionally decoupled from conflict detection)
- Real-time prayer data from Aladhan API (10s timeout, cached per city+date)
- Multi-city: 5 presets + unlimited via Nominatim geocoding (capped at 20)
- Selection bar: 15-min snap, drag + keyboard (arrows, brackets, Shift)
- Conflict detection: shows which prayer, which cities, in real time
- NOW line: pure CSS calc, continuous across ruler + timeline
- 30-min dotted gridlines
- Inline classes row at bottom of timeline

### Course System
- Password-gated class timetable (13 slots/week, verified against TQG PDF)
- Enrolled classes overlay on timeline + dedicated classes row
- Next class countdown
- Quick links: WhatsApp groups, timetable PDF, per-class Teams meeting links (dropdown), recording links

### Export & Sharing
- iCal export (RFC 5545 compliant: RRULE, DTSTAMP, escaped descriptions, 72-char line folding)
- Share link (URL with cities, time window, language)

### UX
- Dark/light theme (CSS vars, instant toggle)
- Full Arabic RTL support (prayer names, Hijri date, all labels, city names via `getCityName()`)
- Glass morphism (blur, saturate, gradient, inset highlight)
- Dot grid interactive background (canvas, mouse proximity, disabled on touch)
- Border glow + spotlight card effects
- Location coach-mark with ring highlight (non-blocking, transparent overlay)
- Location button stays visible after enabling (accent color indicator)
- Toast notifications, privacy banner + modal
- Card nav slide-out menu (single wiring site for all actions)
- FAB add-city button on mobile
- Reduced motion support
- PWA: manifest.json + service worker (installable, cache-first)
- Donation link in footer (LaunchGood campaign)

### Accessibility
- `role="main"` + `aria-label` on timeline
- `aria-label` on all interactive elements
- Keyboard: arrows, brackets, Escape, Tab
- Focus trap on modals + card nav, focus restore on close
- `aria-live="polite"` on status badge
- Touch targets ≥44px

### Performance
- Non-render-blocking fonts (`media="print" onload`)
- Resize debounced (150ms dot grid, 100ms selection)
- Glass blur reduced on mobile (12px vs 24px)
- localStorage try/catch, notification timer cleanup

### Security
- CSP (meta + _headers, Aladhan + Nominatim + worker-src + manifest-src)
- X-Frame-Options: DENY
- Geocoded names sanitized (HTML, quotes, bidi)
- Password hash pre-computed, Nominatim rate limited

---

## Version History

| Version | Key Changes |
|---------|-------------|
| **1.21.0** | Removed bookmarks, footer donate, privacy visible, meeting links dropdown (7 Teams links) |
| **1.20.0** | Multiple meeting slot bookmarks (later removed) |
| **1.19.0** | PWA (manifest + service worker), donation popup, location icon stays visible, Arabic city names + Nominatim + date formatting, inline classes row |
| **1.18.0** | Code quality: consolidated UTC conversion (localToUTC/utcToLocal), state object (S + setState) |
| **1.17.1** | Removed dead loc-overlay click handler, orphaned ringPulse keyframe |
| **1.17.0** | Privacy: coords 1dp, CSP cleanup, privacy banner fix. iCal escaping, focus trap, Safari AbortSignal, AudioContext pre-arm, volume slider |
| **1.16.x** | Visual overhaul: IBM Plex Sans Arabic, gridlines, 15-min snap, location spotlight, mobile FAB, palette revert |
| **1.15.0** | Class timetable corrected, location onboarding, non-render-blocking fonts |
| **1.14.0** | Countdown grace, NOW line CSS calc, card nav inert fix, glassmorphism |
| **1.13.0** | Prayer block width matches conflict window, conflict O(n) |
| **1.12.x** | CRITICAL blank page fix, class overlay day, notification timer leak |
| **1.11.0** | iCal DTSTAMP, fetch timeout, localStorage try/catch |

---

## Audit Trail (74 fixed items)

Do NOT report these again — all verified across 11 audit rounds (MiMo, Z.ai, GLM 5.2, Gemini, Sonnet):

1–9: Loader timing, double renderAll, midnight refresh, cache busting, iCal DTSTAMP, fetch timeout, Nominatim UA, localStorage try/catch
10–16: Blank page fix, class overlay London day, notification timer leak, null guards, AudioContext .catch(), loader error path, enrolled validation
17–26: Course panel, prayer block width, cache-key drift, mobile label init, iCal escaping, btn-now/location guards, resize re-layout, prayer 00:00, midnight DST, conflict O(n)
27–34: Countdown grace, NOW line CSS, card nav inert, prayer+class overlap, glassmorphism, ruler labels, Lighthouse a11y, border-radius
35–41: CSP beacon, class timetable, Sheikh prefix, enrolled key, location onboarding, non-render fonts, deposit removed
42–56: Visual overhaul (palette, font, NOW line, gridlines, 15-min snap, spotlight, mobile, progress, animations, prayer overflow, CSP clean, Friday removed, blocks 30min, scroll-to-now removed, palette reverted)
57–74: Popup viewport clamp, FAB color, coords 1dp, CSP cleaned, privacy banner, iCal escaping, focus trap, ARIA, Safari AbortSignal, scroll sync, AudioContext unlock, prayer text horizontal, coach-mark, privacy link, volume slider, iCal fold, dead click handler, ringPulse keyframe

---

## Design Decisions (do NOT flag as issues)

- `'unsafe-inline'` required for single-file static app on Cloudflare Pages
- Prayer blocks fixed 30min — intentionally decoupled from conflict detection
- Card Nav sits OUTSIDE `#app` — so `inert` doesn't disable the menu
- NOW line uses pure CSS calc — matches ruler/blocks exactly
- Countdown uses 2-min grace — prevents just-passed prayer flickering
- `pd.loc[name]` values are in `pd.tz` timezone — do NOT switch to browser timezone
- 15-min snapping is intentional
- Gridlines drawn once — don't re-render on renderAll()
- Palette is teal/cyan (CSS variables)
- Font is IBM Plex Sans Arabic — native Latin + Arabic
- FAB only visible on mobile
- Nominatim User-Agent can't be set client-side
- 3-5 cities doesn't need virtualization
- State object `S` with backward-compat `let` aliases synced at render boundaries

---

## Code Map

| Area | Lines | Notes |
|------|-------|-------|
| CSS variables | 27–46 | `:root` — all colors, sizes |
| Glass morphism | 84–93 | `.glass` with gradient, blur, inset |
| Prayer blocks | 378–401 | Fixed 30min, 5 colors |
| Selection bar | 412–432 | 15-min snap, resize handles |
| NOW line | 434–447 | Pure CSS calc |
| Card nav | 164–211 | Slide-out, single wiring site |
| Location coach | 646–660 | Transparent overlay, ring |
| State (`S`) | ~1090 | All mutable state, `setState()` |
| `localToUTC()` | ~1204 | `(((localH - offset) % 24) + 24) % 24` |
| `utcToLocal()` | ~1205 | `((utcH + offset) % 24 + 24) % 24` |
| `getOffsetForDate()` | ~1206 | DST-aware offset for specific date |
| `fetchPrayer()` | ~1260 | Aladhan API + cache + timeout |
| `renderRow()` | ~1368 | City row with prayer blocks + class overlays |
| `renderClassesRow()` | ~1497 | Inline classes row |
| `renderAll()` | ~1536 | Renders all rows + classes + bookmarks |
| `checkConflicts()` | ~1694 | Map-based O(n) |
| `compCls()` | ~1810 | London class times → UTC |
| Geocoding | ~2190 | Nominatim + debounce + rate limit |
| `exportICal()` | ~2070 | ICS + RRULE + DTSTAMP |
| Notifications | ~2350 | Browser Notification API |
| Selection drag | ~2440 | Pointer events, snap, keyboard |
| Init | ~2480 | Loads state, renders, intervals |

---

## Deployment

```bash
# Auto-deploys to prayer.mscarabia.com when pushed to main branch
git push origin master:main

# Or manual deploy
wrangler pages deploy . --project-name world-prayer-times --branch=master
```

Cloudflare Pages tracks the `main` branch for production. Push to `main` = instant deploy to `prayer.mscarabia.com`.

---

## Known Limitations (by design, not bugs)

- Conflict wrap-midnight: mathematically correct
- Nominatim compliance: 1s rate limit + debounce
- CSP `'unsafe-inline'`: required for single-file app
- Performance: 3-5 cities doesn't need virtualization
- Password gate: client-side hash only (soft gate, not real security)
