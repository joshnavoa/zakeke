# Deploy to Railway Guide

This guide will help you deploy the Zakeke Product Catalog API to Railway.

## Prerequisites

1. **Railway Account** - Sign up at [railway.app](https://railway.app) (free tier available)
2. **GitHub Account** - Railway works best with GitHub (free)

## Option 1: Deploy via Railway Web Interface (Easiest)

### Step 1: Prepare Your Code

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Zakeke Product Catalog API"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Create `.gitignore`** (if you don't have one):
   ```bash
   echo "node_modules/
   .env
   .DS_Store
   *.log" > .gitignore
   ```

### Step 2: Deploy on Railway

1. **Go to Railway**: [railway.app](https://railway.app)
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect** it's a Node.js project

### Step 3: Configure Environment Variables

1. **Click on your project** in Railway
2. **Go to "Variables" tab**
3. **Add these environment variables**:

   ```
   ZAKEKE_TENANT_ID=320250
   ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
   ZAKEKE_API_URL=https://api.zakeke.com
   PORT=3000
   ```

4. **Railway will auto-deploy** when you save

### Step 4: Get Your Public URL

1. **Click on your service** in Railway
2. **Go to "Settings" tab**
3. **Click "Generate Domain"** (or use the default one)
4. **Copy your public URL** (e.g., `https://your-app.up.railway.app`)

### Step 5: Configure in Zakeke

1. **Log into Zakeke back office**
2. **Go to Sales Channels** → **Product Catalog API**
3. **Enter your Railway URL**: `https://your-app.up.railway.app/`
   - **Important**: Include trailing slash `/`
4. **Save and test connection**

## Option 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

```bash
# macOS
brew install railway

# Or using npm
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 3: Initialize Project

```bash
# In your project directory
railway init
```

Follow the prompts:
- Create new project? Yes
- Project name: `zakeke-product-catalog-api`

### Step 4: Set Environment Variables

```bash
railway variables set ZAKEKE_TENANT_ID=320250
railway variables set ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
railway variables set ZAKEKE_API_URL=https://api.zakeke.com
railway variables set PORT=3000
```

### Step 5: Deploy

```bash
railway up
```

This will deploy your code to Railway.

### Step 6: Get Your URL

```bash
railway domain
```

Or check in Railway dashboard for your public URL.

## Option 3: Deploy via GitHub Actions (Advanced)

If you want automatic deployments on every push:

1. **Create `.github/workflows/railway.yml`**:
   ```yaml
   name: Deploy to Railway
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - uses: bervProject/railway-deploy@v1.0.0
           with:
             railway_token: ${{ secrets.RAILWAY_TOKEN }}
   ```

2. **Add Railway token to GitHub Secrets**:
   - Get token from Railway → Account → Tokens
   - Add to GitHub repo → Settings → Secrets → `RAILWAY_TOKEN`

## Verify Deployment

After deployment, test your API:

```bash
# Health check
curl https://your-app.up.railway.app/health

# Get products (with auth)
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://your-app.up.railway.app/products
```

## Troubleshooting

### Deployment Fails

- Check Railway logs: Click on your service → "Deployments" → View logs
- Verify environment variables are set correctly
- Check that `package.json` has a `start` script (we use `api` script)

### API Not Responding

- Check Railway service is running (should show "Active")
- Verify PORT is set (Railway auto-sets PORT, but we use 3000 as fallback)
- Check Railway logs for errors

### CORS Issues

- Railway should handle CORS fine
- If issues, check the `cors` middleware in the code

### Environment Variables Not Working

- Make sure variables are set in Railway dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

## Update package.json for Railway

Railway looks for a `start` script. Let's add one:

```json
"scripts": {
  "start": "node zakeke-product-catalog-api.js",
  "api": "node zakeke-product-catalog-api.js"
}
```

## Cost

Railway free tier includes:
- $5 credit per month
- 500 hours of usage
- Perfect for this API (low traffic)

## Next Steps After Deployment

1. ✅ Test API endpoints
2. ✅ Configure URL in Zakeke back office
3. ✅ Test connection in Zakeke
4. ✅ Publish products in Zakeke
5. ✅ Test on your Webflow site

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check Railway logs for detailed error messages

