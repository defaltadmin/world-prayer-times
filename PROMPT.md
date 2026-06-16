# Prayer Times App — Full Audit Prompt

**Repo:** https://github.com/defaltadmin/world-prayer-times  
**Live:** https://prayer.mscarabia.com  
**Stack:** Single vanilla HTML file (index.html), no frameworks, no build tools

---

## Project Structure

| File | Purpose |
|------|---------|
| `index.html` | **The entire app** — HTML + CSS + JS in one file (~1942 lines) |
| `wrangler.toml` | Cloudflare Pages config |
| `_headers` | Cloudflare HTTP headers |
| `_redirects` | Cloudflare redirects |
| `package.json` | Project metadata only (no deps) |
| `CHANGELOG.md` | Version history |

**Key point:** There is only ONE code file — `index.html`. All CSS is inline in `<style>`, all JS is inline in `<script>`. No separate .js or .css files.

---

## What the App Does

A prayer times coordination tool for Muslims worldwide. Users can:
1. See prayer times for multiple cities on a 24-hour visual timeline
2. Drag a selection bar to find meeting windows that don't conflict with prayer times
3. Add cities worldwide via Nominatim geocoding
4. Export enrolled classes + safe meeting windows to iCal
5. View course info (Sannatayn & Tafseer) behind a password gate
6. Enrolled classes show as overlays on the timeline at correct local times

---

## Architecture Inside index.html

### CSS (~400 lines)
- CSS variables for theming (dark/light)
- Glass morphism, modals, panels, prayer blocks
- Mobile responsive (`@media max-width: 768px`)
- Coarse pointer touch targets (`@media pointer: coarse`)
- Reduced motion (`@media prefers-reduced-motion`)

### HTML (~220 lines)
- Loading screen, Islamic pattern background (CSS SVG)
- Header with buttons (help, course, share, iCal, notifications, settings, location)
- Status bar with conflict badge and "Use my location" button
- Legend strip, ruler, timeline with city rows
- Modals: Settings, Help, Add City, Privacy
- Course panel (slide-out with password gate)
- Footer

### JavaScript (~1300 lines)
- **Config:** CITIES array (5 defaults), POOL (13 cities), CLASSES (14 course sessions)
- **State:** cities, cache, selection, userCity, lang, enrolled
- **i18n:** English + Arabic translations for all UI strings, SUBJECTS map for class names
- **Time utilities:** getOff(), getLocalHours(), getOffsetForDate(), fmtH(), pct()
- **API:** fetchPrayer() with cache key = city:lat:lng:method:dateKey
- **Rendering:** renderRow(), renderAll(), renderRuler(), updateSel()
- **Conflicts:** checkConflicts() using local prayer times from API
- **Course:** Password gate, class schedule, enrollment toggles
- **Geolocation:** "Use my location" button (NOT auto-prompt)
- **Init:** Renders immediately with browser timezone, geolocation optional

---

## Key Functions Reference

| Function | Purpose |
|----------|---------|
| `getOff(tz)` | UTC offset using Intl API |
| `getLocalHours(tz)` | Current local time as decimal hours |
| `getOffsetForDate(tz,y,m,d)` | UTC offset for a specific date (DST-safe) |
| `fmtH(h)` | Format decimal hours to 12h/24h string |
| `fetchPrayer(city)` | Fetch from Aladhan API, cache with coordinate-aware key |
| `renderRow(city)` | Build city row DOM — uses `pd.loc[name]` directly for prayer block positioning |
| `renderAll()` | Render all cities (user row excluded from timeline) |
| `updateSel()` | Position selection bar, update ARIA |
| `checkConflicts()` | Detect overlaps using local prayer times vs selection |
| `updateCD()` | Countdown to next prayer |
| `detectUser()` | Set user city from localStorage or browser timezone |
| `requestLocation()` | Geolocation on button click (not auto) |
| `renderRuler()` | Draw 24h ruler with hour marks |
| `updateNow()` | Position NOW line using `getLocalHours()` |
| `renderToggles()` | Course enrollment checkboxes |
| `compCls(cls)` | Compute class timestamps — DST-safe London local → UTC via getOffsetForDate() |
| `exportICal()` | Generate .ics file with enrolled classes + meeting window |
| `updateUI()` | Update all translated text on language change |

---

## API Usage

- **Aladhan API** (`api.aladhan.com/v1/timings/`) — prayer times by coordinates
- **Nominatim** (`nominatim.openstreetmap.org/search`) — city geocoding
- **Google Fonts** — Inter, JetBrains Mono, Amiri

---

## What's Already Fixed (Don't Re-flag)

These issues have been identified and resolved:

1. ~~Ruler marks misalignment~~ — Fixed with `(100% - label-w)` formula
2. ~~Prayer block widths using durMap~~ — Now uses `pw` from API
3. ~~Geocoded cities showing user timezone~~ — Updates from `pd.tz`
4. ~~Conflict detection hardcoded 18-min~~ — Uses actual prayer windows
5. ~~Scroll sync infinite loop~~ — Lock flag prevents it
6. ~~Countdown wrong timezone~~ — Uses `getLocalHours(pd.tz)`
7. ~~iCal export UTC issue~~ — Uses `Date.UTC()` correctly
8. ~~Canvas battery drain~~ — Replaced with CSS SVG pattern
9. ~~Service worker 404~~ — Registration removed
10. ~~30-min cache wipe~~ — Now refreshes at midnight
11. ~~Touch targets <44px~~ — Fixed on mobile
12. ~~getOff() wrong calculation~~ — Uses Intl UTC-parts
13. ~~Cache key ignoring coordinates~~ — Now includes lat:lng:method
14. ~~Light mode labels invisible~~ — Use CSS vars
15. ~~fmtH 9:60~~ — Fixed rounding
16. ~~compCls wrong outside London~~ — Uses Intl for London date
17. ~~Missing .hidden class~~ — Added
18. ~~mOffset race condition~~ — Refreshed before renderAll
19. ~~Globe never pauses~~ — IntersectionObserver added
20. ~~Escape doesn't close modals~~ — Added handler
21. ~~Status bar not announced~~ — aria-live="polite"
22. ~~Duplicate class enrollment~~ — Key includes start time
23. ~~Auto-prompt geolocation~~ — Replaced with "Use my location" button
24. ~~Prayer timing inaccurate~~ — Uses `pd.loc[name]` directly
25. ~~Globe removed~~ — Canvas wireframe removed
26. ~~User "You" row removed~~ — No longer displayed
27. ~~toMaster() / mOffset eliminated~~ — Local times used directly
28. ~~Course panel toggle broken~~ — Proper locked/unlocked state on open
29. ~~Class overlays wrong timezone~~ — compCls converts London local → UTC
30. ~~iCal missing enrolled classes~~ — Export includes all enrolled events
31. ~~Geocoding ID collision~~ — Uses 2 decimal places for lat/lng in ID
32. ~~Dead user row code~~ — Placeholder, pin icon, YOU badge removed from renderRow
33. ~~Notifications fire before geolocation~~ — Gated on userCity.lat
34. ~~iCal single-use events~~ — Enrolled classes use RRULE:FREQ=WEEKLY
35. ~~compCls DST off-by-one~~ — Offset computed per class date via getOffsetForDate()
36. ~~ARIA aria-valuenow mismatch~~ — Fixed to match post-init value
37. ~~Prayer blocks lack aria-label~~ — Added for screen readers
38. ~~Nominatim no rate limit~~ — 1s minimum between requests enforced
39. ~~Arabic class subjects~~ — SUBJECTS translation map added
40. ~~iCal midnight wrap~~ — Duration handles classes crossing UTC midnight
41. ~~detectUser fallback~~ — Preserves London coords when no saved location
42. ~~dateKey memoized~~ — Per-timezone cache avoids Intl in hot path
43. ~~Notifications at midnight~~ — Re-scheduled after midnight refresh
44. ~~Screen reader spam~~ — aria-live on status-badge only
45. ~~Ruler labels~~ — aria-hidden for screen readers
46. ~~RTL timeline~~ — Forces direction: ltr on timeline containers
47. ~~Prayer block overflow~~ — Width capped at timeline boundary
48. ~~Resize handles a11y~~ — role=button + aria-label
49. ~~iCal XSS newlines~~ — sanitizeName strips \n\r
50. ~~getComputedStyle cache~~ — --label-w cached, refreshed on resize
51. ~~Dead dk variable~~ — Removed from checkConflicts
52. ~~fmtH NaN~~ — Returns --:-- on invalid input

---

## What NOT to Suggest

- **Don't suggest splitting into multiple files** — constraint is single HTML
- **Don't suggest React/Vue/frameworks** — vanilla JS only
- **Don't suggest npm packages** — no build tools
- **Don't suggest adding a globe/canvas visualization** — was removed intentionally
- **Don't suggest WebGL for globe** — globe was removed
- **Don't re-flag issues marked as fixed above**

---

## What to Audit

1. **Correctness:** Prayer times accurate for all timezones? Countdown correct?
2. **Edge cases:** Midnight wrap, DST transitions, invalid timezones
3. **Mobile:** Touch targets ≥44px, responsive layout, scroll performance
4. **Accessibility:** ARIA labels, keyboard navigation, screen reader support
5. **Security:** XSS via geocoded names, CSP compliance
6. **Performance:** API call frequency, memory usage
7. **Code quality:** Dead code, duplicated logic, naming consistency
8. **Visual:** Light/dark mode contrast, prayer block readability
9. **i18n:** Arabic completeness, RTL layout
10. **Course panel:** Password gate UX, class overlays at correct local times, iCal export

---

## Known Issues to Fix

1. **DST edge cases** — Prayer times may shift during DST transitions if the API returns stale offsets

---

## Enhancement Ideas

1. **Prayer time notifications** — Browser notifications 5 minutes before each Salah (partially implemented)
2. **Custom color themes** — Allow user to customize prayer block colors
3. **Dark mode auto-switch** — Follow system preference via `prefers-color-scheme`
4. **Analytics** — Track most used cities and time windows (privacy-friendly, no PII)
5. **Unit tests** — Hidden `?test=1` mode for time calculation assertions

---

## Output Format

For each issue found:
```
[SEVERITY] — Title
Where: function/line reference
What: description
Fix: code or approach
```

Group by: Critical → High → Medium → Low → Suggestions

Only flag real issues — don't re-report fixed items.
