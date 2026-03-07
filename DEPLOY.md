# Pawtraits — Deployment Guide
## Deploy to Vercel + formforge.com

---

### Step 1 — Push to GitHub

```bash
cd pawtraits
git init
git add .
git commit -m "Initial commit — Pawtraits"
```

Create a new repo at https://github.com/new (name it `pawtraits`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pawtraits.git
git push -u origin main
```

---

### Step 2 — Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `pawtraits` repo
4. Vercel auto-detects Vite — no build settings needed
5. Click **Deploy**

Your site will be live at `pawtraits.vercel.app` within ~60 seconds.

---

### Step 3 — Add your Anthropic API Key

1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` ← your key from https://console.anthropic.com
3. Click **Save**, then go to **Deployments** and click **Redeploy**

---

### Step 4 — Connect formforge.com

1. In Vercel → your project → **Settings → Domains**
2. Click **Add Domain** and enter: `formforge.com`
3. Vercel will show you DNS records to add. You have two options:

**Option A — Point the whole domain to Vercel:**
- Go to your domain registrar (where formforge.com is registered)
- Set nameservers to Vercel's: `ns1.vercel-dns.com` and `ns2.vercel-dns.com`

**Option B — Add an A record (keep your registrar's DNS):**
- Add an **A record**: `@` → `76.76.21.21`
- Add a **CNAME record**: `www` → `cname.vercel-dns.com`

4. Back in Vercel, click **Verify** — it usually propagates within 5–30 minutes
5. Vercel automatically provisions a free SSL certificate (HTTPS) ✅

---

### Project Structure

```
pawtraits/
├── api/
│   └── describe-pet.js     ← Serverless function (keeps API key secret)
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx            ← React entry point
│   └── App.jsx             ← Main app (upload, style, order flow)
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

### Future Updates

Any push to `main` on GitHub auto-deploys to Vercel. That's it!

```bash
git add .
git commit -m "Update pricing"
git push
```

---

### Pricing Configuration

Edit the arrays at the top of `src/App.jsx`:

- `SIZES` — print sizes and prices
- `FRAMES` — frame options and prices  
- `MOUNTS` — mounting options and prices
- `STYLES` — art styles (add a price surcharge if desired)
