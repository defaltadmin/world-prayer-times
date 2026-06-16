# Improvement Prompt for World Prayer Times

## Current State
The app is a single-page prayer time coordination tool with:
- 24-hour timeline with city rows (user row removed)
- Real-time prayer data from Aladhan API, positioned using local times directly
- Selection bar with conflict detection (uses local prayer times)
- Dark/light theme, EN/AR language support
- Course enrollment panel with password gate
- iCal export for enrolled classes + meeting windows
- Mobile responsive design

## Known Issues to Fix
1. **DST edge cases**: Prayer times may shift during DST transitions if the API returns stale offsets.
2. **Class overlay midnight wrap**: If a class spans midnight in UTC (unlikely but possible), the overlay width calculation may be wrong.
3. **iCal recurrence**: Enrolled classes export as one-time events, not recurring weekly events.

## Enhancement Ideas
1. **Recurring iCal events**: Use RRULE for weekly class recurrence instead of single events.
2. **Prayer time notifications**: Browser notifications 5 minutes before each Salah (partially implemented).
3. **Custom color themes**: Allow user to customize prayer block colors.
4. **Dark mode auto-switch**: Follow system preference via `prefers-color-scheme`.
5. **Analytics**: Track most used cities and time windows (privacy-friendly, no PII).

## Technical Debt
1. **Split JS into modules**: Currently all in one IIFE (constraint: single HTML file).
2. **Add TypeScript**: For better type safety (would require build step).
3. **Add tests**: Unit tests for time calculations (compCls, getLocalHours, fmtH).
4. **Dead code in renderRow**: `isUser` checks in renderRow are now dead code since user row is no longer rendered.
