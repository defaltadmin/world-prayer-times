# Cloudflare Pages Deployment

## Option 1: CLI Deploy (Recommended)

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```
This opens browser. Authenticate with your Cloudflare account.

### 3. Deploy
```bash
cd world-prayer-times
npm run deploy
```

First run creates the project. Subsequent runs deploy updates.

### 4. Custom Domain
After deploy, Cloudflare gives you a `*.pages.dev` URL.
To use your own domain:
1. Go to Cloudflare Dashboard → Pages → world-prayer-times
2. Settings → Custom domains → Add custom domain
3. Enter your domain (e.g., `prayer.mscarabia.com`)
4. DNS records are auto-created if domain is on Cloudflare

---

## Option 2: GitHub Auto-Deploy

### 1. Connect Repo
1. Cloudflare Dashboard → Pages → Create a project
2. Connect to GitHub → Select `defaltadmin/world-prayer-times`
3. Build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
4. Save and deploy

### 2. Auto-Deploy
Every push to `master` auto-deploys.

---

## Option 3: Cloudflare AI Dashboard Instructions

Paste this into Cloudflare AI assistant or follow manually:

### Steps:
1. Go to **Cloudflare Dashboard** → **Pages**
2. Click **Create a project**
3. Choose **Upload assets** (not GitHub)
4. Project name: `world-prayer-times`
5. Upload the entire `world-prayer-times/` folder
6. Click **Deploy**

### For Custom Domain:
1. After deploy, go to **Settings** → **Custom domains**
2. Click **Setup a custom domain**
3. Enter domain (e.g., `prayer.mscarabia.com`)
4. If domain is already on Cloudflare, DNS auto-configures
5. If not, add CNAME record: `prayer` → `world-prayer-times.pages.dev`

### For Authentication (Optional):
If you want to protect the site:

1. Go to **Settings** → **Access**
2. Click **Add an application**
3. Choose **Self-hosted**
4. Application name: `Prayer Times`
5. Session duration: 24 hours
6. Add policy:
   - Policy name: `Allow my email`
   - Action: **Allow**
   - Include → Emails: `princeshezy@gmail.com`
7. Save
8. Access is now enabled - you'll see a login page before accessing the site

---

## Option 4: Wrangler Config (wrangler.toml)

The `wrangler.toml` is already configured. Just run:

```bash
wrangler pages deploy . --project-name world-prayer-times
```

### Environment Variables (if needed later):
```bash
wrangler pages secret put API_KEY
wrangler pages secret put ALADHAN_API_KEY
```

---

## Quick Deploy Summary

```bash
# One-time setup
npm install -g wrangler
wrangler login

# Deploy
cd world-prayer-times
npm run deploy

# Output gives you:
# - https://world-prayer-times.pages.dev
# - Or custom domain if configured
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `wrangler: command not found` | `npm install -g wrangler` |
| `Not logged in` | `wrangler login` |
| `Project not found` | First deploy creates it automatically |
| Custom domain not working | Check DNS is on Cloudflare, wait 5 min |
| 404 on refresh | Add `_redirects` file with `/* /index.html 200` |
