# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within World Prayer Times, please send an email to **princeshezy@gmail.com**. All security vulnerabilities will be addressed promptly.

**Please do NOT report security vulnerabilities through public GitHub issues.**

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.10.x | ✅ Yes |
| 1.8.x | ✅ Yes |
| < 1.8 | ❌ No |

## Security Measures

### Data Privacy
- **No user data collected** — All data stays in your browser
- **No analytics tracking** — No Google Analytics, no telemetry
- **localStorage only** — Preferences stored locally, never sent to servers
- **No authentication** — No accounts, no passwords, no PII

### API Security
- **Read-only API calls** — Aladhan API is read-only, no mutations
- **No API keys required** — Public API, no secrets exposed
- **HTTPS only** — All communication encrypted in transit

### Browser Security
- **Content Security Policy** — Strict CSP headers via Cloudflare
- **No inline scripts** — External script sources only
- **X-Frame-Options: DENY** — Prevents clickjacking
- **X-Content-Type-Options: nosniff** — Prevents MIME sniffing

### Service Worker
- **Cache-first strategy** — Serves cached content when offline
- **No sensitive data cached** — Only static assets cached
- **Automatic updates** — New versions activate immediately

## Best Practices for Users

1. **Keep your browser updated** — Latest security patches
2. **Use HTTPS** — Always access via https://prayer.mscarabia.com
3. **Review permissions** — Only grant notification permission if needed
4. **Clear cache if concerned** — Service worker cache can be cleared in browser settings

## Changes to This Policy

We may update this security policy from time to time. Changes will be posted on this page with an updated revision date.
