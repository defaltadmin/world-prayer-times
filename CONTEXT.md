# World Prayer Times — Full Context

**Version:** 1.21.0 | **Live:** https://prayer.mscarabia.com | **Stack:** Single-file vanilla JS, Aladhan API, Nominatim, Cloudflare Pages

---

## What It Does

A prayer times coordination tool for Muslims worldwide. Users see prayer times for multiple cities on a 24-hour visual timeline, find safe meeting windows that don't conflict with Salah, manage a class schedule, and export to calendar.

---

## Architecture

`index.html` — the ENTIRE app. ~2560 lines. No build step, no npm runtime deps.

| Section | Lines | What |
|---------|-------|------|
| `<style>` | ~660 | CSS vars, glassmorphism, gridlines, spotlight, responsive |
| Constants | ~200 | City presets, class schedule (13 slots), prayer windows, i18n |
| State | ~30 | Global vars (cities, cache, selections, language) |
| Utilities | ~100 | `getOff()`, `getLocalHours()`, `fmtH()`, `pct()`, `clamp()` |
| API | ~80 | `fetchPrayer()` — Aladhan API, 10s timeout, caching |
| Rendering | ~300 | `renderRow()`, `renderAll()`, `renderRuler()`, `drawGridlines()` |
| Conflict | ~60 | `checkConflicts()` — prayer/selection overlap, Map-based O(n) |
| Class schedule | ~100 | `compCls()` — London class times → UTC |
| Geocoding | ~80 | Nominatim, 400ms debounce + 1s rate limit |
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

### Course System
- Password-gated class timetable (13 slots/week, verified against TQG PDF)
- Enrolled classes overlay on timeline, filtered by London day-of-week
- Next class countdown, quick links (WhatsApp, timetable, meetings, recordings)

### Export & Sharing
- iCal export (RFC 5545 compliant: RRULE, DTSTAMP, escaped descriptions, 72-char line folding)
- Share link (URL with cities, time window, language)

### UX
- Dark/light theme (CSS vars, instant toggle)
- Full Arabic RTL support (prayer names, Hijri date, all labels)
- Glass morphism (blur, saturate, gradient, inset highlight)
- Dot grid interactive background (canvas, mouse proximity, disabled on touch)
- Border glow + spotlight card effects
- Location coach-mark with ring highlight (non-blocking, transparent overlay)
- Toast notifications, privacy banner + modal
- Card nav slide-out menu (single wiring site for all actions)
- FAB add-city button on mobile
- Reduced motion support

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
- CSP (meta + _headers, Aladhan + Nominatim only)
- X-Frame-Options: DENY
- Geocoded names sanitized (HTML, quotes, bidi)
- Password hash pre-computed, Nominatim rate limited

---

## Version History (condensed)

| Version | Key Changes |
|---------|-------------|
| **1.19.0** | PWA (manifest + service worker), donation popup, location icon stays visible, Arabic city names + Nominatim + date formatting |
| **1.18.0** | Code quality: consolidated UTC conversion (localToUTC/utcToLocal), state object (S + setState), getOffsetForDate moved to utilities |
| **1.17.1** | Removed dead loc-overlay click handler, orphaned ringPulse keyframe |
| **1.17.0** | Privacy: coords 1dp, CSP cleanup, privacy banner fix. iCal escaping, focus trap, Safari AbortSignal, AudioContext pre-arm, volume slider, prayer text horizontal |
| **1.16.1** | Palette revert to teal/cyan, popup viewport clamp, FAB icon color |
| **1.16.0** | Visual overhaul: IBM Plex Sans Arabic, gridlines, 15-min snap, location spotlight, mobile FAB, loading progress, smooth animations |
| **1.15.0** | Class timetable corrected (re-parsed from PDF), location onboarding, non-render-blocking fonts |
| **1.14.0** | Countdown grace, NOW line CSS calc, card nav inert fix, prayer+class overlap, glassmorphism, robots.txt |
| **1.13.0** | Prayer block width matches conflict window, cache-key fix, mobile label init, iCal escaping, conflict O(n) |
| **1.12.1** | Menu lock (Escape + inert), prayer blocks fixed 30min, privacy banner auto-dismiss |
| **1.12.0** | CRITICAL blank page fix, class overlay London day, notification timer leak, null guards |
| **1.11.0** | iCal DTSTAMP, fetch timeout, localStorage try/catch, loader timing, midnight refresh |
| **1.10.0** | renderAll race condition, iOS fixes, card nav, course panel a11y |
| **1.9.0** | Focus trap, wp_u rounding, share links, search a11y, mobile perf |
| **1.8.x** | Dot grid background, card nav menu, glass morphism, animations |
| **1.7.x** | Prayer timing accuracy, conflict detection, i18n, geocoding, notifications |
| **1.6.x** | Worldwide city search, privacy notice, keyboard control, Arabic support |
| **1.0.0** | Initial release |

---

## Audit Trail (74 fixed items)

These were identified and fixed across 11 audit rounds (MiMo, Z.ai, GLM 5.2, Gemini, Sonnet). **Do NOT report these again:**

1. Class day filtering (enrolled.filter by day)
2. Loader timing (1.5s wait)
3. Double renderAll() removed
4. Midnight refresh loop (24h fallback)
5. Cache busting meta tags
6. iCal DTSTAMP field
7. Fetch timeout (AbortSignal 10s)
8. Nominatim User-Agent removed
9. localStorage try/catch
10. CRITICAL blank page (6 orphan btn wirings)
11. Class overlay London day (Intl.DateTimeFormat)
12. Notification timer leak (_notifTimers[])
13. Null guards (fmt-btn, lang-sel, alarm-sel, etc.)
14. AudioContext resume .catch()
15. Loader error path (hideLoader)
16. Enrolled shape validation
17. Course panel (openCoursePanel extracted)
18. Prayer block width matches conflict window
19. Geocoded city cache-key drift
20. Mobile label-width init
21. iCal line folding/escaping
22. btn-now/btn-location null guards
23. Resize re-layout (debounced updateSel)
24. Prayer at 00:00 notification (pt === undefined)
25. Midnight refresh DST offset
26. Conflict detection O(n²) → O(n)
27. Countdown wrong next prayer (2-min grace)
28. NOW line misaligned (pure CSS calc)
29. Card nav menu frozen (moved outside #app)
30. Prayer + class text overlap (stacked lanes)
31. Glassmorphism polish
32. Ruler label readability (0.65rem)
33. Lighthouse a11y (role=main, aria-label)
34. Border-radius consistency (12px)
35. CSP Cloudflare beacon
36. Class timetable corrected (re-parsed from PDF)
37. Sheikh prefix on teacher names
38. Enrolled storage key (wp_e2)
39. Location onboarding banner
40. Non-render-blocking fonts
41. Deposit removed
42–46. Visual overhaul: palette, font, NOW line continuous, 30-min gridlines, 15-min snapping
47. Location spotlight (coach-mark with ring)
48. Mobile responsive (label 90px, FAB, horizontal prayer text)
49. Loading progress (per-city tracking)
50. Smooth animations (Material Design easing)
51. Prayer text overflow (ellipsis, min-width 22px)
52. CSP Zaraz/RUM removed (cleaned)
53. Friday Hadith removed
54. Prayer blocks fixed 30min (reverted from variable)
55. Scroll-to-now removed
56. Palette reverted to teal/cyan
57. Location popup viewport clamp
58. FAB icon color
59. GPS coords rounded to ±11km (1dp)
60. CSP cleaned (Aladhan + Nominatim only)
61. Privacy banner no longer fakes consent
62. iCal SUMMARY escaped
63. Card nav focus trap
64. Resize handles ARIA (role=button removed)
65. Safari AbortSignal fallback
66. Scroll sync (requestAnimationFrame)
67. AudioContext unlock (pointerdown/keydown)
68. Prayer text horizontal (clamp())
69. Location coach-mark (no dark overlay)
70. Privacy policy link
71. Volume slider
72. iCal line folding (72 chars)
73. Dead loc-overlay click handler removed
74. Orphaned ringPulse keyframe removed

---

## Design Decisions (do NOT flag as issues)

- `'unsafe-inline'` required for single-file static app on Cloudflare Pages
- Prayer blocks fixed 30min — intentionally decoupled from conflict detection windows (pw)
- Card Nav sits OUTSIDE `#app` — so `inert` doesn't disable the menu
- NOW line uses pure CSS calc — matches ruler/blocks exactly
- Countdown uses 2-min grace — prevents just-passed prayer flickering
- `pd.loc[name]` values are in `pd.tz` timezone — do NOT switch to browser timezone
- 15-min snapping is intentional — users requested finer control
- Gridlines drawn once by `drawGridlines()` — don't re-render on renderAll()
- Palette is teal/cyan (CSS variables, propagate everywhere)
- Font is IBM Plex Sans Arabic — native Latin + Arabic support
- FAB only visible on mobile — desktop uses inline add-row
- Nominatim User-Agent can't be set client-side — Referer sufficient for low volume
- 3-5 cities doesn't need virtualization

---

## Code Map (key locations in index.html)

| Area | Lines | Notes |
|------|-------|-------|
| CSS variables | 27–46 | `:root` — all colors, sizes |
| Glass morphism | 84–93 | `.glass` with gradient, blur, inset |
| Prayer blocks | 378–401 | Fixed 30min, 5 colors, hover/focus |
| Selection bar | 412–432 | 15-min snap, resize handles |
| NOW line | 434–447 | Pure CSS calc, no transition |
| Card nav | 164–211 | Slide-out, single wiring site |
| Location coach | 646–660 | Transparent overlay, ring, mobile |
| fetchPrayer() | ~80 | Aladhan API + cache + timeout |
| renderRow/renderAll | ~300 | Timeline + progress bar |
| checkConflicts | ~60 | Map-based O(n) |
| compCls | ~100 | London class times → UTC |
| Geocoding | ~80 | Nominatim + debounce + rate limit |
| iCal | ~60 | ICS + RRULE + DTSTAMP |
| Notifications | ~40 | Browser Notification API |
| Selection drag | ~200 | Pointer events, snap, keyboard |
| Init | ~80 | Loads state, renders, intervals |

---

## Known Limitations (by design, not bugs)

- Conflict wrap-midnight: mathematically correct, dismissed
- Nominatim compliance: 1s rate limit + debounce, acceptable
- CSP `'unsafe-inline'`: required for single-file app
- Performance: 3-5 cities doesn't need virtualization

---

## Roadmap (what could come next)

### High Impact
1. **Push notifications** — service worker + Web Push (currently requires tab open)
2. **PWA manifest** — installable as home screen app
3. **Multiple meeting slots** — save/bookmark multiple safe windows
4. **City groups/presets** — save named city sets ("Work", "Family")
5. **Print-friendly view** — clean timeline for sharing

### Medium Impact
6. Qibla direction compass overlay
7. Hijri calendar events/reminders
8. Custom prayer methods (MWL, ISNA, Egypt, etc.)
9. Offline support (service worker caching)
10. Data export/import (backup localStorage as JSON)

### Low Impact
11. Search history (last 5 cities)
12. Keyboard shortcuts guide modal
13. Haptic feedback on drag snap (mobile)

---

## Deployment

```bash
wrangler pages deploy . --project-name world-prayer-times
```

## Git

```bash
git add index.html CHANGELOG.md AUDIT-PROMPT.md
git commit -m "description"
git push origin master
```
