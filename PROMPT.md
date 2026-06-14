# Improvement Prompt for World Prayer Times

## Current State
The app is a single-page prayer time coordination tool with:
- 24-hour timeline with city rows
- Real-time prayer data from Aladhan API
- Selection bar with conflict detection
- Dark/light theme, EN/AR language support
- Course enrollment panel
- Mobile responsive design

## Known Issues to Fix
1. **Prayer block width**: Currently hardcoded to 30min (0.5h). Should vary by prayer duration (Fajr/Isha shorter, Dhuhr/Asr longer).
2. **Timezone edge cases**: DST transitions can cause prayer times to be off by 1 hour.
3. **Offline support**: No service worker for offline caching.
4. **Accessibility**: Missing ARIA labels on interactive elements.
5. **Performance**: Multiple API calls on init. Should batch requests.

## Enhancement Ideas
1. **Add prayer duration info**: Show actual prayer duration (e.g., Fajr 20min, Dhuhr 15min) in tooltip.
2. **Add sunrise block**: Currently only shows 5 prayers, add Sunrise as a visual marker.
3. **Calendar integration**: Export prayer times to Google Calendar/Apple Calendar.
4. **Custom cities**: Allow user to add any city (not just from pool).
5. **Notifications**: Browser notifications for upcoming prayers.
6. **Share button**: Generate shareable link with selected cities and time window.
7. **Analytics**: Track most used cities and time windows.
8. **PWA support**: Add manifest.json for installability.

## UI Polish Ideas
1. **Micro-animations**: Subtle fade-in for prayer blocks on load.
2. **Hover tooltips**: Show detailed prayer info on hover.
3. **Keyboard navigation**: Arrow keys to move selection bar.
4. **Dark mode auto-switch**: Follow system preference.
5. **Custom color themes**: Allow user to customize prayer colors.

## Technical Debt
1. **Split JS into modules**: Currently all in one IIFE.
2. **Add TypeScript**: For better type safety.
3. **Add tests**: Unit tests for time calculations.
4. **Add CI/CD**: GitHub Actions for auto-deploy.
