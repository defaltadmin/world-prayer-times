# Product Requirements Document — World Prayer Times

## Overview

A single-page prayer times coordination tool for Muslims worldwide. Users can see prayer times for multiple cities on a 24-hour visual timeline, find safe meeting windows that don't conflict with Salah, manage a class schedule, and export to calendar.

**Live:** https://prayer.mscarabia.com
**Version:** 1.17.1
**Stack:** Vanilla HTML/CSS/JS (single file, ~2560 lines), Aladhan API, Nominatim geocoding, Cloudflare Pages

## Core Features

### 1. Prayer Times Timeline
- 24-hour horizontal timeline with stacked city rows
- Colored blocks for each prayer (Fajr=cyan, Dhuhr=gold, Asr=orange, Maghrib=red, Isha=purple)
- Fixed 30-minute visual blocks per prayer (intentionally decoupled from conflict detection windows)
- Sunrise marker (yellow vertical line)
- Red NOW line showing current time across all rows (pure CSS calc, continuous across ruler + timeline)
- Ruler with hour labels above the timeline
- 30-minute dotted gridlines for drag reference

### 2. Multi-City Support
- 5 preset cities (London, Riyadh, Mumbai, Brussels, New York)
- 8 additional cities in the pool (Dubai, Istanbul, Cairo, Lagos, Jakarta, Singapore, Karachi, KL)
- Add any city worldwide via Nominatim geocoding search (400ms debounce + 1s rate limit)
- Custom cities saved to localStorage (capped at 20)
- Each city shows: name, live clock, UTC offset
- Remove cities (minimum 1 required)

### 3. Conflict Detection
- Draggable cyan selection bar on the timeline (15-minute snapping)
- Resize handles on left/right edges
- Keyboard controls (Arrow keys step 0.25h, [ ] resize, Shift+Arrow step 1h)
- Status badge: green "Safe Window" or red "Conflict: [prayer] ([city])"
- Conflict uses full prayer windows (pw) from API, not just the 30-min visual blocks
- Deduplicates conflicts, shows max 3 with overflow count

### 4. Course Panel (Sannatayn & Tafseer)
- Password-gated access (hash-based, stored in sessionStorage)
- Class schedule with 13 slots across the week (verified against TQG PDF)
- Enrolled classes shown as bottom-band overlays on timeline (filtered by London day-of-week)
- Class timetable with checkbox toggles per class
- Next class countdown
- Quick links: WhatsApp groups, timetable, meeting links, recording links

### 5. iCal Export
- Exports enrolled class events as weekly recurring (.ics)
- Exports selected safe meeting window
- RFC 5545 compliant: RRULE, DTSTAMP, escaped descriptions/summaries, line folding at 72 chars

### 6. Notifications
- Browser Notification API, 5 minutes before each prayer
- Bell icon toggle in card nav menu
- iOS warning toast (tab must stay open)
- Timer tracking (`_notifTimers[]`) with cleanup on disable

### 7. Dark/Light Theme
- CSS custom properties for all colors (teal/cyan palette)
- Toggle persists to localStorage
- Updates `<meta name="color-scheme">` for browser UI
- Glass morphism effects (blur, saturate, gradient overlay, inset highlight)

### 8. EN/AR Language Support
- Full Arabic i18n (header, settings, modals, buttons, course panel)
- RTL layout support (`dir="rtl"` on `<html>`)
- Arabic prayer names (فجر، ظهر، عصر، مغرب، عشاء)
- Arabic NOW label via CSS pseudo-element
- Hijri date in header

### 9. Location Detection
- Non-blocking coach-mark overlay prompts new users (no dark overlay, soft suggestion)
- "Enable" triggers browser permission, "Skip for now" dismisses
- Choice remembered via `wp_loc_prompted` in localStorage
- Fallback: browser timezone with London coordinates
- Header location button as persistent fallback
- Coordinates rounded to 1 decimal place (~11km), stored locally only

### 10. Privacy
- No data collection, no analytics, no cookies
- Dismissible privacy banner on first visit (auto-hide does NOT fake consent)
- Full privacy modal with details
- localStorage only for preferences (cities, theme, language, enrolled)

### 11. Accessibility
- `role="main"` and `aria-label` on timeline region
- `aria-label` on all interactive elements (prayer blocks, resize handles, buttons)
- Keyboard navigation (arrow keys, Tab, Escape, [/] resize)
- Focus trap on all modals and card nav menu
- Focus restore on modal close
- `aria-live="polite"` on status badge
- Touch targets ≥44px on coarse pointer devices
- `prefers-reduced-motion` respected (animations disabled)

## Technical Details

### API Integration
- **Aladhan API** (`api.aladhan.com/v1/timings/`) — prayer times by coordinates
  - 10-second timeout via `AbortSignal.timeout()` (Safari feature-detected)
  - Cached per city+date+method key
  - Fallback estimated times on error
- **Nominatim** (`nominatim.openstreetmap.org/search`) — city geocoding
  - 400ms debounce + 1s rate limit between requests
  - `AbortController` cancels stale requests
  - Results sanitized (HTML tags, bidi chars stripped)

### Data Storage (localStorage)
| Key | Purpose |
|-----|---------|
| `wp_cities_v1` | Array of city IDs |
| `wp_custom_cities` | Geocoded cities (max 20) |
| `wp_t` | Theme (dark/light) |
| `wp_24` | Time format (12h/24h) |
| `wp_l` | Language (en/ar) |
| `wp_a` | Alarm sound (ting/chime/bell) |
| `wp_u` | User location (rounded coords + tz) |
| `wp_e2` | Enrolled classes |
| `wp_notif` | Notifications enabled |
| `wp_privacy_ok` | Privacy banner dismissed |
| `wp_loc_prompted` | Location prompt shown |

### Security
- CSP via meta tag + Cloudflare _headers (Aladhan + Nominatim only)
- X-Frame-Options: DENY
- Geocoded names sanitized (HTML, quotes, bidi chars stripped)
- Password hash pre-computed (never plaintext in source)
- Rate limiting on Nominatim (1 req/sec)
- AudioContext pre-armed on first user interaction (pointerdown/keydown)

### Performance
- Non-render-blocking fonts (media="print" onload swap)
- Dot grid canvas with dirty flag optimization
- Resize debounced (150ms for dot grid, 100ms for selection)
- Glass blur reduced on mobile (12px vs 24px)
- Touch effects disabled on coarse pointer devices

## Known Constraints
- Single-file architecture (no build step, no npm runtime deps)
- Cloudflare Pages deployment (static hosting only)
- CSP requires `'unsafe-inline'` for inline scripts/styles (nonces not practical on CF Pages)
- 3-5 cities doesn't warrant virtualization

## Testing Focus Areas

### Critical Path
1. Load page → prayer times appear for default cities
2. Add a city via search → appears on timeline
3. Drag selection bar → status badge updates (safe/conflict)
4. Open course panel → enter password → unlock → see timetable
5. Toggle enrolled classes → overlays appear on timeline
6. Export iCal → file opens correctly in calendar apps
7. Toggle dark/light theme → all elements update
8. Switch to Arabic → RTL layout, all text translated

### Edge Cases
- City at extreme latitude (Fajr/Isha may be null from API)
- Half-hour timezone (India, UTC+5:30)
- DST transition night (midnight refresh offset)
- Prayer at exactly midnight (00:00)
- All prayers passed → countdown wraps to Fajr tomorrow
- Custom cities cap (20 max, oldest removed)
- localStorage quota exceeded
- Geolocation denied → fallback to browser timezone
- Safari (AbortSignal.timeout feature detection)

### Mobile
- Touch targets ≥44px
- Horizontal scroll timeline
- Card nav slide-out menu
- Glass blur reduced (12px)
- Selection bar drag via touch events
- FAB add-city button (fixed bottom-right)
- Location coach-mark as bottom-sheet

### Accessibility
- role="main" on timeline region
- aria-label on all interactive elements
- Keyboard navigation (arrow keys, Tab, Escape)
- Focus trap on modals and card nav
- Focus restore on modal close
- aria-live on status badge
- Screen reader text via aria-label on prayer blocks
