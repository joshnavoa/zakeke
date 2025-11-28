# How to Trigger Zakeke to Import Products

## Current Status

✅ **API is working:**
- Root endpoint (`/`) is responding
- Products endpoint (`/products`) is ready
- Zakeke is testing connection (calling `/`)

❌ **Zakeke is NOT fetching products:**
- Only calling root endpoint, not `/products`
- Need to manually trigger product import in Zakeke

## Steps to Trigger Product Import in Zakeke

### Step 1: Go to Products Section
1. Log into Zakeke back office
2. Navigate to **Products** section (usually in left sidebar)

### Step 2: Look for Import/Sync Options
Look for one of these:
- **"Import Products"** button
- **"Sync Products"** button  
- **"Connect Products"** button
- **"Fetch Products"** button
- **"Load Products from API"** button
- Empty product list with **"Import"** or **"Add Products"** option

### Step 3: Check Integration Settings
1. Go to **Sales Channels** → **Product Catalog API**
2. Verify URL is: `https://zakeke-production.up.railway.app`
3. Look for:
   - **"Test Connection"** button → Click it
   - **"Sync Now"** button → Click it
   - **"Import Products"** button → Click it
   - Status indicator showing connection status

### Step 4: Watch Railway Logs
While doing the above:
1. Keep Railway logs open
2. Watch for new requests
3. Look for: `📦 GET /products called` (not just `/`)

## What You Should See

After triggering import, Railway logs should show:
```
📦 GET /products called
   Query params: { page: '1', limit: '20' }
   User-Agent: undefined (or missing)
   Authorization: Present
   Found X products from Supabase
   Returning X products
```

## If You Don't See Import Button

If there's no import/sync button visible:

1. **Check for error messages** in Zakeke dashboard
2. **Try refreshing** the Products page
3. **Check if products section is empty** - might need to click "Add Products" first
4. **Contact Zakeke support** - they can guide you on how to trigger import in your Zakeke version

## Common Zakeke UI Locations

The import button might be:
- At the top of Products page
- In a dropdown menu (three dots or gear icon)
- In the Products section header
- As a card/button when product list is empty
- In Integration Settings page

## Next Steps

1. **Go to Zakeke Products section**
2. **Look for import/sync button**
3. **Click it to trigger product fetch**
4. **Watch Railway logs** for `/products` requests
5. **Share what you see** - either the button location or any error messages

The API is ready - we just need to tell Zakeke to fetch the products!

