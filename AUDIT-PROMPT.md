# Audit Prompt for LLMs (DeepSeek, Kimi, Qwen, MiniMax, etc.)

## What You're Reviewing

A single-page prayer times web app (`index.html`, ~2500 lines, ~150KB). Pure vanilla JS, no frameworks. Deploys to Cloudflare Pages.

## Folder Structure

```
world-prayer-times/
├── index.html          ← THE ENTIRE APP (HTML + inline CSS + inline JS, ~2500 lines)
├── _headers            ← Cloudflare Pages HTTP headers (CSP, HSTS, cache control)
├── _redirects          ← Cloudflare Pages redirects (SPA fallback)
├── wrangler.toml       ← Cloudflare Pages config
├── package.json        ← Scripts only (wrangler deploy), no runtime deps
├── CHANGELOG.md        ← Version history (1.0.0 → 1.11.0)
├── SECURITY.md         ← Security policy
├── README.md           ← Project docs
├── LICENSE             ← MIT
├── .gitignore
└── .git/
```

**Key fact:** There is only ONE source file — `index.html`. Everything (HTML structure, ~900 lines of CSS, ~1500 lines of JS) is inline. There are no imports, no bundler, no node_modules runtime dependency.

## What the App Does

1. **Prayer times timeline** — Fetches real prayer times from Aladhan API for multiple cities, renders them as colored blocks on a 24h horizontal timeline
2. **Conflict detection** — Users drag a selection bar to find safe meeting windows that don't overlap prayer times
3. **Class schedule** — Overlays enrolled class times (Fiqh, Tafseer, Seerah, etc.) on the timeline, filtered by day of week
4. **Multi-city** — Users can add cities worldwide via Nominatim geocoding
5. **iCal export** — Exports meeting windows and class schedules as .ics files
6. **Notifications** — Browser notifications 5 min before prayer times
7. **Dark/light theme** — Toggle with CSS custom properties
8. **EN/AR language** — Full Arabic support including RTL

## Architecture (inside index.html)

| Section | Lines | What it does |
|---------|-------|-------------|
| `<style>` | ~900 | All CSS — CSS vars, glass morphism, dot grid, responsive |
| Constants | ~200 | City presets, class schedule, prayer windows, i18n strings |
| State | ~30 | Global variables (cities, cache, selections, language) |
| Utilities | ~100 | `getOff()`, `getLocalHours()`, `fmtH()`, `pct()`, `clamp()` |
| API | ~80 | `fetchPrayer()` — Aladhan API with caching + 10s timeout |
| Rendering | ~300 | `renderRow()`, `renderAll()`, `renderRuler()`, `renderToggles()` |
| Conflict | ~60 | `checkConflicts()` — prayer/selection overlap detection |
| Class schedule | ~100 | `compCls()` — converts London class times to UTC, `updateEnrolled()` |
| Geocoding | ~80 | Nominatim search with debounce + 1s rate limit |
| iCal | ~60 | ICS file generation with RRULE + DTSTAMP per RFC 5545 |
| Notifications | ~40 | Browser Notification API scheduling |
| UI interactions | ~200 | Drag selection, resize handles, keyboard shortcuts |
| Init/bootstrap | ~80 | Loads saved state, renders, starts intervals |
| Visual effects | ~100 | Dot grid canvas, border glow, spotlight cards |

## Bugs Already Fixed (v1.14.0)

These were identified and fixed in prior audits. **Do NOT report these again:**

1. **Class day filtering** — Was showing ALL enrolled classes regardless of day. Fixed with `enrolled.filter(cls => cls.day === today)`
2. **Loader timing** — Was hiding after 100ms regardless of API state. Now waits 1.5s
3. **Double renderAll()** — Was called twice on init, causing race conditions. Removed redundant call
4. **Midnight refresh loop** — Was re-firing every 60s if calculated time was wrong. Now waits full 24h if < 5 min
5. **Cache busting** — Added no-cache meta tags for browser caching
6. **iCal DTSTAMP** — Added required `DTSTAMP` field to all VEVENT entries per RFC 5545
7. **Fetch timeout** — Aladhan API calls now have 10s timeout via `AbortSignal.timeout()`
8. **Nominatim User-Agent** — Removed dead code (browser strips forbidden headers; Referer is sufficient)
9. **localStorage safety** — Added try/catch to all `setItem` calls
10. **CRITICAL blank page** — Deleted 6 orphan `#btn-*` wirings (btn-settings/help/share/ical/course/notify) that threw TypeError on null elements removed by Card Nav redesign
11. **Class overlay day** — Uses London day-of-week via `Intl.DateTimeFormat('Europe/London')` instead of browser-local `getDay()`
12. **Notification timer leak** — `schedulePrayerNotifs()` tracks setTimeout IDs in `_notifTimers[]` and clears before re-scheduling
13. **Null guards** — All `$('#fmt-btn')`, `$('#lang-sel')`, `$('#alarm-sel')`, `$('#test-chime')`, course panel buttons wrapped in `if (el)` checks
14. **AudioContext resume** — Added `.catch(()=>{})` to prevent Safari unhandled rejections
15. **Loader error path** — Error handler calls `hideLoader()` instead of leaving spinner spinning
16. **Enrolled validation** — Loaded from localStorage with shape check (array of objects with string start/end, integer day)
17. **Course panel** — Extracted `openCoursePanel()` called directly from `initCardNav()`
18. **Prayer block width matches conflict window** — Visual blocks use pw (prayer window) from API instead of fixed 30min. `durHours` computed from `pd.pw[name]` converted to local time.
19. **Geocoded city cache-key drift** — `prayerCacheKey()` includes `city.tz` in key; `renderRow()` uses local `tz` variable instead of mutating `city.tz`.
20. **Mobile label-width init** — `_cachedLabelW` initialized from computed CSS at startup, not just on resize.
21. **iCal line folding/escaping** — DESCRIPTION values escaped (`,;\n\`); lines folded at 73 chars per RFC 5545.
22. **btn-now/btn-location null guards** — Added `if (el)` checks consistent with v1.12.0 pattern.
23. **Resize re-layout** — Debounced `updateSel()` in resize handler.
24. **Prayer at 00:00 notification** — `!pt` changed to `pt === undefined` to avoid falsy-zero skip.
25. **Midnight refresh DST offset** — Uses `getOffsetForDate()` for target date, not current offset.
26. **Conflict detection O(n²)** — City lookup uses Map instead of per-iteration `.find()`.
27. **Countdown wrong next prayer** — 2-min grace period (`l > lh - GRACE`), undefined guard, `??` fallback.
28. **NOW line misaligned** — Pure CSS calc instead of JS pixel math, matching ruler/blocks.
29. **Card nav menu frozen** — Moved menu outside `#app` so `inert` doesn't disable it.
30. **Prayer + class text overlap** — Stacked vertically: prayer upper lane, class bottom band (0.58rem accent).
31. **Glassmorphism polish** — Enhanced glass with gradient, deeper blur, inset top highlight.
32. **Ruler label readability** — Font size 0.6rem → 0.65rem.
33. **Lighthouse a11y** — Added `role="main"` and `aria-label` to timeline region.
34. **Border-radius consistency** — Modal/info-card standardized to 12px.

## Design Decisions (do NOT flag as issues)

- **`_renderGen` counter** handles render race conditions (not a bug)
- **`'unsafe-inline'` in CSP** is required for a single-file static app on Cloudflare Pages (nonces not practical)
- **Aladhan API handles all prayer time calculations** — the client only positions blocks using the returned times
- **Cache is cleared at midnight** — memory impact is negligible (max ~600 entries for 20 cities × 30 days)
- **Prayer blocks already have** `tabindex="0"`, `role="button"`, `aria-label`, and keyboard handlers
- **Card Nav is the single wiring site** — all header actions (share, ical, notify, course, settings, help) are wired in `initCardNav()` via `#nav-*` items. The old `#btn-*` header buttons no longer exist in HTML.
- **Nominatim User-Agent** cannot be set client-side (browser strips forbidden headers); Referer header is sufficient for low-volume use

## What to Audit

Please check for:

### Critical (will break the app)
- JavaScript errors that prevent rendering
- API calls that fail silently
- Race conditions between async operations (note: `_renderGen` already handles render races)
- Memory leaks (growing arrays, unclosed intervals)
- Infinite loops or recursive calls without base cases

### High (affects users)
- Prayer times calculated incorrectly for edge cases (DST transitions, date line, half-hour timezones like India)
- Class schedule not matching London BST/GMT transitions
- iCal export producing invalid .ics files (check RFC 5545 compliance)
- Geocoding returning wrong cities
- localStorage quota exceeded (custom cities growing unbounded)

### Medium (code quality)
- Dead code that should be removed
- Duplicate logic that could be consolidated
- Missing error handling on network requests
- Accessibility issues (keyboard navigation, screen readers)
- CSP violations (inline scripts, missing nonces)

### Low (polish)
- CSS issues (layout shifts, overflow, z-index conflicts)
- Mobile touch target sizes
- Performance (unnecessary re-renders, layout thrashing)
- Browser compatibility (Safari quirks, old Chrome)

## How to Report

For each issue found, provide:
1. **Severity:** Critical / High / Medium / Low
2. **Location:** Function name or line range
3. **Problem:** What's wrong
4. **Fix:** Exact code change needed (old → new)
5. **Why:** Why this is a problem

## Constraints

- This is a SINGLE FILE app — no build step, no npm runtime deps
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)
- Must not break existing features
- Must maintain CSP compliance (no new external scripts)
- Arabic (RTL) support must be preserved
