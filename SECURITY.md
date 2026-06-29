# Security Policy

## Data Privacy

- No user data collected — all data stays in your browser
- No analytics, no tracking, no cookies
- localStorage stores only preferences (cities, theme, language, enrolled classes)
- Geolocation coordinates are rounded to 1 decimal place (~11km) and never leave your device

## Security Measures

- Strict CSP via meta tag + Cloudflare _headers (Aladhan + Nominatim only)
- X-Frame-Options: DENY
- XSS protection via DOM textContent (no innerHTML with user data)
- Geocoded city names sanitized (HTML tags, quotes, bidi characters stripped)
- Rate limiting on Nominatim geocoding (1 req/sec + 400ms debounce)
- Password hash pre-computed (never plaintext in source)
- AbortController cancels stale network requests
- localStorage writes wrapped in try/catch for quota handling

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.17.x | Yes |
| < 1.15 | No |
