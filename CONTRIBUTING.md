# Contributing to World Prayer Times

Thank you for your interest in contributing! This project serves the Muslim community by helping coordinate prayer times across cities.

## How to Contribute

### 🐛 Bug Reports

1. Check [existing issues](https://github.com/defaltadmin/world-prayer-times/issues) first
2. Open a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device information
   - Screenshots if applicable

### ✨ Feature Requests

1. Check if the feature already exists
2. Open an issue with:
   - Problem statement (what need does it solve?)
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### 🔧 Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/world-prayer-times.git

# Install dependencies
npm install

# Start dev server
npx wrangler pages dev .

# Deploy to your own Pages
wrangler pages deploy .
```

## Code Guidelines

### JavaScript
- Vanilla JS only (no frameworks)
- Single-file architecture (keep everything in index.html)
- Comment complex logic
- Use meaningful variable names

### CSS
- Use CSS variables for theming
- Support both dark and light modes
- Mobile-first responsive design
- Follow existing color scheme

### API Integration
- Cache responses appropriately
- Handle errors gracefully
- Use fallback data when API fails
- Respect rate limits

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add new city to POOL
fix: Resolve timezone calculation bug
docs: Update README with deployment guide
style: Improve button hover states
refactor: Extract prayer duration logic
test: Add unit tests for time utilities
chore: Update dependencies
```

## Pull Request Checklist

- [ ] Code follows project style
- [ ] Changes tested on desktop and mobile
- [ ] No console errors
- [ ] Accessibility checked (keyboard navigation, screen reader)
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated

## Community Guidelines

- Be respectful and inclusive
- Focus on the mission: serving the Muslim community
- Provide constructive feedback
- Help others learn and grow

## Questions?

Open an issue or reach out to **princeshezy@gmail.com**.

---

**JazakAllahu Khairan** for contributing! 🕌
