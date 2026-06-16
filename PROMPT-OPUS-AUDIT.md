# Prayer Times App — Full Audit

**Repo:** https://github.com/defaltadmin/world-prayer-times  
**Stack:** Single HTML file, vanilla JS, Aladhan API, Cloudflare Pages

Read the full `index.html` and audit for bugs, performance, visual polish, and missing features.

---

## What to Check

### Prayer Accuracy
- Countdown timer correct for all timezones?
- Prayer block widths match actual API windows?
- Conflict detection uses real durations, not hardcoded?
- NOW line aligns with prayer blocks?
- Blocks use local prayer times (pd.loc) directly?

### Mobile/Tablet
- Touch targets ≥44px?
- Horizontal scroll smooth?
- Works on iPhone SE, iPad, Android?

### Visual Design
- Prayer colors accessible (WCAG AA)?
- Light/dark mode contrast okay?
- Vertical prayer text readable?
- Glass backdrop-filter on Safari?

### Performance
- Lighthouse 90+ target
- Memory with many cities?
- First paint speed (no geolocation blocking)?

### Code Quality
- Dead code (e.g. isUser checks in renderRow, globe references)
- XSS vectors in geocoded city names
- localStorage data exposure
- i18n complete for Arabic?
- RTL layout correct?

### Course Panel
- Password gate UX good?
- Class timetable clear on mobile?
- Enrolled classes show as overlays at correct local times?
- iCal export includes enrolled classes?

---

## Output

For each issue:
```
[CRITICAL/HIGH/MED/LOW] — Title
Where: line number
What: description
Fix: code or approach
```

Start Critical → High → Medium → Low. Group by category.

Also suggest: better Islamic background pattern, font alternatives, prayer block redesign ideas, and any missing features worth adding.

Constraint: Must stay single HTML file, no frameworks.
