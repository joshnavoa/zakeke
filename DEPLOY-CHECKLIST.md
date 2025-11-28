# Railway Deployment Checklist

Quick checklist for deploying to Railway.

## Pre-Deployment

- [ ] Code is committed to Git
- [ ] `.env` is in `.gitignore` (should not be committed)
- [ ] `package.json` has `start` script
- [ ] All dependencies are in `package.json`

## Deployment Steps

### 1. Push to GitHub (if not already)

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Deploy on Railway

**Option A: Via Web Interface**
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Wait for deployment to start

**Option B: Via CLI**
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Initialize: `railway init`
- [ ] Deploy: `railway up`

### 3. Set Environment Variables

In Railway dashboard → Variables tab, add:

- [ ] `ZAKEKE_TENANT_ID=320250`
- [ ] `ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.`
- [ ] `ZAKEKE_API_URL=https://api.zakeke.com`
- [ ] `PORT=3000` (Railway sets this automatically, but good to have)

### 4. Get Your Public URL

- [ ] Go to Railway project → Settings
- [ ] Click "Generate Domain" (or use default)
- [ ] Copy the URL (e.g., `https://your-app.up.railway.app`)
- [ ] **Important**: Note the trailing slash is needed: `https://your-app.up.railway.app/`

### 5. Test Deployment

```bash
# Health check
curl https://your-app.up.railway.app/health

# Test with auth
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://your-app.up.railway.app/products
```

### 6. Configure in Zakeke

- [ ] Log into Zakeke back office
- [ ] Go to **Sales Channels** → **Product Catalog API**
- [ ] Enter your Railway URL: `https://your-app.up.railway.app/`
- [ ] **Important**: Include trailing slash `/`
- [ ] Save configuration
- [ ] Test connection (if available)

### 7. Verify Everything Works

- [ ] API responds to health check
- [ ] API responds to authenticated requests
- [ ] Zakeke can connect to your API
- [ ] Products can be published in Zakeke

## Troubleshooting

If deployment fails:
- [ ] Check Railway logs (Deployments → View logs)
- [ ] Verify environment variables are set
- [ ] Check that `start` script exists in `package.json`
- [ ] Verify all dependencies are listed in `package.json`

If API doesn't work:
- [ ] Check Railway service is "Active"
- [ ] Verify environment variables are correct
- [ ] Test endpoints with curl/Postman
- [ ] Check Railway logs for errors

## Files Needed for Deployment

Make sure these files are in your repo:
- ✅ `zakeke-product-catalog-api.js` (main server file)
- ✅ `package.json` (with dependencies and start script)
- ✅ `.gitignore` (to exclude .env and node_modules)
- ✅ `railway.json` (optional, for Railway config)

## Quick Deploy Command

If using Railway CLI:

```bash
# Set variables
railway variables set ZAKEKE_TENANT_ID=320250
railway variables set ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
railway variables set ZAKEKE_API_URL=https://api.zakeke.com

# Deploy
railway up

# Get URL
railway domain
```

## Done! 🎉

Once deployed and configured:
- Your API is live on Railway
- Zakeke can connect to it
- You can publish products in Zakeke
- Integration is ready for your Webflow site

