# World Prayer Times

[![Live](https://img.shields.io/badge/Live-prayer.mscarabia.com-2dd4bf?style=flat-square)](https://prayer.mscarabia.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A prayer times coordination tool for Muslims worldwide. Find safe meeting windows that don't conflict with Salah for anyone, anywhere.

## Features

- **24-Hour Timeline** — Visual horizontal timeline with stacked city rows
- **Dynamic Prayer Blocks** — Real-time blocks with actual durations from Aladhan API
- **Conflict Detection** — Status badge turns red if selection overlaps any prayer
- **City Search** — Add any city worldwide via Nominatim geocoding
- **iCal Export** — Download calendar events for enrolled classes and safe meeting windows
- **Course Panel** — Sannatayn & Tafseer class schedule behind password gate
- **Prayer Notifications** — Browser alerts before each Salah
- **Dark/Light Theme** — Toggle with persistence
- **EN/AR Support** — Full Arabic with RTL layout

## Live Demo

**https://prayer.mscarabia.com**

## Tech Stack

- Single vanilla HTML file (HTML + CSS + JS, no frameworks)
- [Aladhan API](https://aladhan.com/prayer-times-api) for prayer times
- [Nominatim](https://nominatim.openstreetmap.org) for city geocoding
- Hosted on Cloudflare Pages

## Development

```bash
# Local dev server
npx wrangler pages dev .

# Deploy
wrangler pages deploy .
```

## Project Structure

```
index.html       # The entire app (~2500 lines)
_headers         # Cloudflare security headers
_redirects       # Cloudflare redirects
wrangler.toml    # Cloudflare config
package.json     # Deploy scripts only (no runtime deps)
CHANGELOG.md     # Version history
LICENSE          # MIT License
```

## How It Works

1. See prayer times for multiple cities on a 24-hour timeline
2. Drag the cyan selection bar to find safe meeting windows
3. Add cities worldwide via search
4. Export to calendar or share a link with your selection
5. Enable notifications to get alerts before each prayer

## License

MIT
