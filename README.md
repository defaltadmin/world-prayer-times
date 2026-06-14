# World Prayer Times

[![Live Demo](https://img.shields.io/badge/Live- prayer.mscarabia.com-2dd4bf?style=for-the-badge)](https://prayer.mscarabia.com)

A visual prayer time coordination tool that helps schedule meetings across multiple cities without conflicting with Salah times.

## Features

- **24-hour timeline** with city rows stacked vertically
- **Real-time prayer data** from Aladhan API (cached, refreshes every 30 min)
- **Dynamic prayer blocks** – widths reflect actual prayer duration
- **Color-coded blocks** – Fajr (cyan), Dhuhr (gold), Asr (orange), Maghrib (red), Isha (purple)
- **Sunrise marker** – yellow vertical line at each city's sunrise
- **Selection bar** (cyan) to drag and resize meeting windows
- **Conflict detection** with status badge (safe/conflict)
- **Share links** – generate URL with your city selection and time window
- **User location detection** via geolocation
- **Countdown to next prayer**
- **Course info panel** with timetable enrollment
- **Dark/Light theme** toggle
- **12h/24h time** format
- **EN/AR language** support with RTL
- **PWA support** – installable on mobile
- **Mobile responsive**

## Quick Start

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .
```

## Local Development

```bash
npx wrangler pages dev .
```

## Default Cities

London, Riyadh, Mumbai, Brussels, New York (+ Dubai, Istanbul, Cairo, Lagos, Jakarta, Singapore, Karachi)

## Tech Stack

- Single HTML file (inline CSS/JS)
- Tailwind CSS (CDN)
- Aladhan API for prayer times
- Cloudflare Pages for hosting
- Canvas for Islamic geometric background

## License

MIT
