# Sonnet Audit Prompt — Prayer Times v1.26.0

## What you're reviewing

A prayer times coordination app (`index.html`, ~2900 lines). Single-file vanilla JS, no build step. Deployed to https://prayer.mscarabia.com. I'm attaching a screenshot of the current live state.

## Current issues I know about

1. **Dot grid background invisible** — Canvas element exists, CSS is correct, JS init runs, Playwright confirms rendering — but the dots are invisible in a real browser. Possible z-index or canvas rendering issue.
2. **Animated gradient (`body::before`) barely visible** — 3% opacity gradient, may be too subtle or hidden behind body background.
3. **Donate bar still too prominent** — I've toned it down but user says it's still distracting. Need opinion on sizing/styling.
4. **Logo border glow is static** — `sweepLogo()` RAF was removed (intentional perf fix). Logo has static glow via CSS vars. Check if this looks good or needs animation.

## What I need from you

### 1. Visual polish audit
Look at the screenshot and tell me:
- What looks good vs what looks "off" or "cheap"
- Specific CSS fixes for spacing, alignment, contrast, hierarchy
- Which elements feel like they belong vs which feel tacked on
- Font size/weight consistency across the page

### 2. Background investigation
The dot grid canvas and gradient are not visible. Check:
- Is `body::before` (z-index: -1) hidden behind `body` background?
- Is `#dot-grid` (z-index: 0) covered by `#app` (z-index: 1)?
- Does the canvas draw loop actually paint on first load?
- Is there a CSS conflict hiding these elements?

### 3. Specific element feedback
For each of these, tell me if the styling is right or needs adjustment:
- **Add City button** — dashed border, hover state, positioning
- **Footer** — meta row spacing, donate link sizing, overall feel
- **Legend** — chip style, dot glow, JetBrains Mono labels
- **Meeting Links** — accordion behavior, skeleton loading, chevron
- **Prayer blocks** — colors, sizing, text readability
- **Selection bar** — visibility, drag affordance
- **NOW line** — color, thickness, visibility
- **Header** — countdown pill, logo, hamburger spacing
- **Status bar** — badge styling, text alignment

### 4. Mobile-specific
- What breaks at 375px width?
- Touch target sizes
- Horizontal scroll behavior
- Any text overflow or clipping

### 5. Priority list
Rank the top 5 most impactful visual improvements I should make, with exact CSS changes.

## File to upload

`index.html` (the entire app, ~2900 lines)

## Constraints
- No new dependencies (no npm, no external CSS/JS)
- Must work in dark and light themes
- Must respect `prefers-reduced-motion`
- Must keep all existing functionality working
- CSS variables only from the existing palette
