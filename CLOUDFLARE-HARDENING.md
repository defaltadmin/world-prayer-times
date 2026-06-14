# Cloudflare Dashboard Hardening — prayer.mscarabia.com
# These cannot be done via _headers or wrangler.toml — dashboard only.
# Steps verified for the Free/Pro plan as of 2025.

## 1. HSTS Preload Submission
After confirming the site serves the HSTS header correctly:
- Go to: https://hstspreload.org
- Enter: prayer.mscarabia.com
- Check all criteria pass (they should with current _headers)
- Click "Submit"
- This is a one-time action. Takes weeks to months to propagate to browsers.

## 2. SSL / TLS Settings
Path: Cloudflare Dashboard → prayer.mscarabia.com → SSL/TLS

  a. Overview tab
     - Encryption mode: Full (strict)          [was probably "Flexible" — change this]

  b. Edge Certificates tab
     - Always Use HTTPS:          ON
     - Automatic HTTPS Rewrites:  ON
     - Minimum TLS Version:       TLS 1.2
     - TLS 1.3:                   ON
     - Opportunistic Encryption:  ON

## 3. Security Settings
Path: Cloudflare Dashboard → prayer.mscarabia.com → Security → Settings

  - Security Level:         High
  - Browser Integrity Check: ON
  - Privacy Pass Support:   ON  (reduces CAPTCHAs for legitimate users)

## 4. Bot Protection
Path: Cloudflare Dashboard → prayer.mscarabia.com → Security → Bots

  - Bot Fight Mode: ON  (free plan)
  OR
  - Super Bot Fight Mode: ON  (Pro plan — also blocks "likely automated" traffic)

## 5. WAF Custom Rules
Path: Cloudflare Dashboard → prayer.mscarabia.com → Security → WAF → Custom rules → Create rule

  Rule 1 — Block scanner user agents:
    Name: "Block scanners"
    Expression:
      (http.user_agent contains "sqlmap") or
      (http.user_agent contains "nikto") or
      (http.user_agent contains "nmap") or
      (http.user_agent contains "masscan") or
      (http.user_agent contains "zgrab") or
      (http.user_agent eq "")
    Action: Block

  Rule 2 — Rate limit aggressive IPs:
    Name: "Rate limit"
    Expression:
      (http.host eq "prayer.mscarabia.com")
    Action: Rate limit
    Requests: 200 per 10 seconds per IP
    (Adjust to 500/60s if too aggressive for real users)

## 6. Scrape Shield
Path: Cloudflare Dashboard → prayer.mscarabia.com → Scrape Shield

  - Hotlink Protection:    ON
  - Email Obfuscation:     ON  (protects email in course panel HTML)
  - Server-side Excludes:  ON

## 7. Page Shield (Pro plan only)
Path: Cloudflare Dashboard → prayer.mscarabia.com → Security → Page Shield

  - Enable Page Shield:    ON
  - Alert on new scripts:  ON
  Monitors for unauthorized JS injection / supply chain attacks.
  Expected approved scripts:
    - fonts.googleapis.com
    - fonts.gstatic.com
    (All app JS is inline — no external scripts to monitor)

## 8. Caching
Path: Cloudflare Dashboard → prayer.mscarabia.com → Caching → Configuration

  - Caching Level:         Standard
  - Browser Cache TTL:     Respect Existing Headers  (our _headers already sets these)
  - Always Online:         ON  (serves stale page if origin is down)

## 9. Network Settings
Path: Cloudflare Dashboard → prayer.mscarabia.com → Network

  - HTTP/2:       ON
  - HTTP/3 (QUIC): ON
  - WebSockets:   OFF  (not used by this app)
  - gRPC:         OFF  (not used)
  - 0-RTT:        ON   (faster repeat connections)

## 10. Speed / Optimization
Path: Cloudflare Dashboard → prayer.mscarabia.com → Speed → Optimization

  Content Optimization tab:
  - Auto Minify:  HTML: ON, CSS: ON, JS: ON
  - Brotli:       ON

## 11. Verify Headers Live
After all changes, check with:
  curl -sI https://prayer.mscarabia.com | grep -i "strict-transport\|x-frame\|content-security\|permissions-policy\|x-content-type\|referrer\|cross-origin"

Or paste the URL into:
  https://securityheaders.com/?q=https://prayer.mscarabia.com&followRedirects=on
  Target grade: A (current setup)
  For A+: run `node csp-hash.js` locally and replace 'unsafe-inline' with hashes in _headers

## 12. HSTS Preload — Final Check Before Submitting
Run this and confirm all boxes are checked:
  https://hstspreload.org/?domain=prayer.mscarabia.com
Requirements:
  ✓ Serve a valid certificate
  ✓ Redirect HTTP to HTTPS on same host
  ✓ HSTS header on HTTPS with max-age >= 31536000
  ✓ includeSubDomains directive present
  ✓ preload directive present
  ✓ All subdomains must also serve HTTPS (mscarabia.com and www.mscarabia.com)
