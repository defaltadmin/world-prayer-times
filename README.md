# World Prayer Times

A visual prayer time coordination tool that helps schedule meetings across multiple cities without conflicting with Salah times.

## Features

- **24-hour timeline** with city rows stacked vertically
- **Real-time prayer data** from Aladhan API (cached, refreshes every 30 min)
- **Color-coded prayer blocks** (Fajr-blue, Dhuhr-yellow, Asr-orange, Maghrib-red, Isha-purple)
- **Selection bar** (cyan) to drag and resize meeting windows
- **Conflict detection** with status badge
- **User location detection** via geolocation
- **Countdown to next prayer**
- **Course info panel** with enrollment
- **Dark/Light theme** toggle
- **12h/24h time** format
- **EN/AR language** support with RTL
- **Mobile responsive**

## Deploy to Cloudflare Pages

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
# Start dev server
npx wrangler pages dev .
```

## Default Cities

- London, UK
- Riyadh, SA
- Mumbai, IN
- Brussels, BE
- New York, US

## API

Uses [Aladhan API](https://aladhan.com/prayer-times-api) for prayer times data.
