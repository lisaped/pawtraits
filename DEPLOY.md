# Pawtraits — Deployment Guide
## Deploy to Vercel + pawtrait.au

---

### Step 1 — Sign up for fal.ai (NEW — for AI image generation)

1. Go to **https://fal.ai** and create a free account
2. Go to **Dashboard → API Keys** → click **Add Key**
3. Copy your key — it looks like `fal-xxxxxxxxxxxx`
4. You'll add this to Vercel in Step 3 below

fal.ai pricing: ~$0.025–0.05 per image generated (very affordable).
New accounts get free credits to start.

---

### Step 2 — Push to GitHub

```bash
git add .
git commit -m "Add AI image generation"
git push
```

---

### Step 3 — Set Environment Variables in Vercel

In Vercel → your project → **Settings → Environment Variables**, add both:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` from https://console.anthropic.com |
| `FAL_API_KEY` | `fal-...` from https://fal.ai/dashboard/keys |

Click **Save** after each, then go to **Deployments → Redeploy**.

---

### Step 4 — Connect pawtrait.au

1. In Vercel → your project → **Settings → Domains**
2. Click **Add Domain** → enter `pawtrait.au`
3. Also add `www.pawtrait.au` and set it to redirect → `pawtrait.au`
4. At your domain registrar, add these DNS records:
   - **A record**: Host `@` → Value `76.76.21.21`
   - **CNAME**: Host `www` → Value `cname.vercel-dns.com`
5. Vercel auto-provisions free SSL ✅

> ⚠️ **.au DNS** can take 2–4 hours to propagate fully.

---

### How AI Generation Works

1. Customer uploads pet photo
2. Photo is uploaded to fal.ai secure storage
3. fal.ai Flux model transforms it using the style prompt (15–30 seconds)
4. Generated image is shown to customer
5. Customer picks size/frame/mount and orders
6. You print and ship the AI-generated artwork

### Adjusting Style Prompts

Edit the `STYLES` array in `src/App.jsx` to tweak prompts for each style:
```js
{ id: "royal", prompt: "your custom prompt here…" }
```

### Project Structure

```
pawtraits/
├── api/
│   ├── describe-pet.js       ← Claude AI pet description
│   └── generate-portrait.js  ← fal.ai image generation
├── src/
│   ├── main.jsx
│   └── App.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

### Deploying Updates

```bash
git add .
git commit -m "Your change"
git push
```
Vercel auto-deploys on every push to main.
