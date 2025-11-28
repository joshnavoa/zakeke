# Testing Your Railway Deployment

Quick guide to test your deployed Zakeke Product Catalog API on Railway.

## Step 1: Get Your Railway URL

1. Go to [railway.app](https://railway.app)
2. Click on your project
3. Click on your service
4. Go to **Settings** tab
5. Under **Domains**, you'll see your URL (e.g., `https://your-app.up.railway.app`)
6. **Copy the URL** (we'll need it for testing)

## Step 2: Test the API

### Option A: Quick Test (Terminal)

Replace `YOUR_URL` with your Railway URL:

```bash
# Health check (no auth needed)
curl https://YOUR_URL/health

# Get products (with auth)
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://YOUR_URL/products
```

### Option B: Use Test Script

```bash
./test-railway.sh https://your-app.up.railway.app
```

### Option C: Test in Browser

1. Open: `https://your-app.up.railway.app/health`
2. Should see: `{"status":"ok","service":"Zakeke Product Catalog API"}`

### Option D: Test with Postman/Insomnia

1. **Health Check** (no auth):
   - Method: `GET`
   - URL: `https://your-app.up.railway.app/health`

2. **Get Products** (with auth):
   - Method: `GET`
   - URL: `https://your-app.up.railway.app/products`
   - Authentication: Basic Auth
     - Username: `320250`
     - Password: `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.`

## Expected Results

### ✅ Health Check Should Return:
```json
{
  "status": "ok",
  "service": "Zakeke Product Catalog API"
}
```

### ✅ Get Products Should Return:
```json
{
  "products": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

(Empty products list is OK - products are managed in Zakeke dashboard)

### ✅ Without Auth Should Return:
- HTTP 401 (Unauthorized) or 403 (Forbidden)

## Troubleshooting

### "Connection refused" or "Could not resolve host"
- Check your Railway URL is correct
- Make sure service is deployed and running
- Check Railway dashboard → Deployments → should show "Active"

### "401 Unauthorized" on authenticated requests
- Verify credentials in Railway environment variables
- Check that `ZAKEKE_TENANT_ID` and `ZAKEKE_API_KEY` are set correctly
- Redeploy after changing environment variables

### "500 Internal Server Error"
- Check Railway logs: Dashboard → Deployments → View logs
- Verify all environment variables are set
- Check for errors in the logs

### Empty products list
- This is **normal** - products are managed in Zakeke dashboard
- The API provides endpoints for Zakeke to call
- Products will be available after configuring in Zakeke

## Test All Endpoints

```bash
BASE_URL="https://your-app.up.railway.app"
AUTH="-u 320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI."

# Health
curl $BASE_URL/health

# Get products
curl $AUTH $BASE_URL/products

# Search products
curl $AUTH "$BASE_URL/products/search?q=test"

# Get product options (replace PRODUCT_ID)
curl $AUTH $BASE_URL/products/PRODUCT_ID/options

# Mark as customizable
curl $AUTH -X POST $BASE_URL/products/PRODUCT_ID/customizable

# Unmark as customizable
curl $AUTH -X DELETE $BASE_URL/products/PRODUCT_ID/customizable
```

## Next Steps After Testing

Once all tests pass:

1. ✅ **Configure in Zakeke**:
   - Log into Zakeke back office
   - Go to **Sales Channels** → **Product Catalog API**
   - Enter your Railway URL: `https://your-app.up.railway.app/`
   - **Important**: Include trailing slash `/`
   - Save configuration

2. ✅ **Test Connection in Zakeke**:
   - Zakeke should test the connection
   - If successful, you can publish products

3. ✅ **Publish Products**:
   - Go to Products in Zakeke
   - Select products to make customizable
   - Click Publish

4. ✅ **Test on Webflow**:
   - Add the integration code to your Webflow site
   - Test product customization

## Quick Test Command

Replace `YOUR_URL` with your actual Railway URL:

```bash
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://YOUR_URL/products?page=1&limit=5
```

If you see JSON with `products` and `pagination`, you're good to go! 🎉

