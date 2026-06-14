# 🕌 World Prayer Times

[![Live Demo](https://img.shields.io/badge/Live- prayer.mscarabia.com-2dd4bf?style=for-the-badge)](https://prayer.mscarabia.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-f48120?style=for-the-badge&logo=cloudflare)](https://pages.cloudflare.com)

> **Coordinate prayer times across cities worldwide.** Find safe meeting windows that don't conflict with Salah for anyone, anywhere.

Built for the Ummah — coordinate classes, family iftars, study circles, and community events across time zones.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🕐 **24-Hour Timeline** | Visual horizontal timeline with stacked city rows |
| 📊 **Dynamic Prayer Blocks** | Real-time blocks with actual durations from Aladhan API |
| 🌅 **Sunrise Markers** | Yellow vertical lines at each city's sunrise |
| 🧭 **Qibla Direction** | Compass indicator on each city row |
| 📱 **Share Links** | Generate URLs with your exact city selection |
| 📅 **iCal Export** | Download calendar events for safe meeting windows |
| 🔔 **Prayer Notifications** | Browser alerts before each Salah |
| 🌙 **Dark/Light Theme** | Toggle with persistence |
| 🌍 **EN/AR Support** | Full Arabic with RTL layout |
| 📲 **PWA Support** | Installable on mobile devices |
| ⚡ **Offline Caching** | Service worker for fast repeat loads |
| 💾 **City Persistence** | Your selections saved across sessions |

---

## 🚀 Quick Start

### Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .
```

### Local Development

```bash
# Start dev server
npx wrangler pages dev .
```

---

## 🏗️ Architecture

```
world-prayer-times/
├── index.html          # Single-file app (HTML + CSS + JS)
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline
├── _headers           # Cloudflare security headers
├── _redirects         # SPA routing
├── wrangler.toml      # Cloudflare config
├── package.json       # Deploy scripts
├── CHANGELOG.md       # Version history
├── SECURITY.md        # Security policy
├── CONTRIBUTING.md    # Contribution guidelines
├── LICENSE            # MIT License
└── README.md          # This file
```

---

## 🌍 Default Cities

| City | Country | Method |
|------|---------|--------|
| London | UK | Muslim World League |
| Riyadh | Saudi Arabia | Umm al-Qura |
| Mumbai | India | Islamic Society of North America |
| Brussels | Belgium | Muslim World League |
| New York | USA | Islamic Society of North America |

**Additional cities available:** Dubai, Istanbul, Cairo, Lagos, Jakarta, Singapore, Karachi

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JS, Tailwind CSS (CDN)
- **API:** [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api)
- **Hosting:** Cloudflare Pages
- **PWA:** Service Worker + Web App Manifest

---

## 📱 Usage

1. **View Timeline** — See prayer times across all cities at a glance
2. **Drag Selection Bar** — Move the cyan bar to find safe meeting windows
3. **Check Conflicts** — Status badge shows if your selection overlaps any prayer
4. **Share** — Click the share icon to copy a link with your selection
5. **Export** — Download an .ics calendar file for your safe window
6. **Notifications** — Enable alerts to be notified before each prayer

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Credits

| Contribution | Source |
|--------------|--------|
| Dynamic prayer blocks, share links, PWA | [Grok](https://x.com/grok) |
| Color scheme, layout fixes, conflict detection | [Gemini](https://gemini.google.com) |
| Implementation, background, enrollment panel | [MiMo](https://github.com/defaltadmin) |

---

## 📊 Live Audit Results

| Metric | Score |
|--------|-------|
| First Contentful Paint | 1.0s |
| Largest Contentful Paint | 1.0s |
| Cumulative Layout Shift | 0.034 |
| Total Blocking Time | 0ms |
| Time to Interactive | 1.0s |

---

**Built with ❤️ for the Muslim community**
