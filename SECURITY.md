# Security Policy

## Reporting Vulnerabilities

Email **princeshezy@gmail.com**. Do not open public GitHub issues for security reports.

## Data Privacy

- No user data collected — all data stays in your browser
- No analytics, no tracking, no cookies
- localStorage stores only preferences (cities, theme, language)
- Geolocation coordinates are rounded to ~1km and never leave your device

## Security Measures

- Strict CSP via Cloudflare headers
- X-Frame-Options: DENY
- XSS protection via DOM textContent (no innerHTML with user data)
- Geocoded city names sanitized (HTML tags, quotes, bidi characters stripped)
- Rate limiting on Nominatim geocoding (1 req/sec)

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.10.x | Yes |
| < 1.8  | No |
