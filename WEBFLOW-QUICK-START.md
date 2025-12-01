# Webflow Quick Start Guide

## 🚀 Fastest Way to Get Started

### 1. Host Your Files (Choose One)

**⭐ Option A: Webflow Assets (Easiest - Recommended)**
1. Go to Webflow Designer
2. Open Assets panel (left sidebar)
3. Upload all 4 files:
   - `zakeke-config.js`
   - `zakeke-webflow-integration.js`
   - `zakeke-order-api.js`
   - `zakeke-styles.css`
4. Right-click each file → Copy URL
5. Use those URLs in Custom Code

**Option B: GitHub + jsDelivr (Free CDN)**
1. Push files to GitHub (if not already)
2. Use jsDelivr: `https://cdn.jsdelivr.net/gh/your-username/zakeke@main/zakeke-config.js`
3. Note: Repo must be public

**Option C: Any Static Hosting**
- Netlify Drop (free)
- Vercel (free)
- Your existing web hosting
- Any CDN service

See `WEBFLOW-HOSTING-OPTIONS.md` for all options.

### 2. Add to Webflow (5 minutes)

1. **Project Settings** > **Custom Code**

2. **In `<head>`:**
```html
<link rel="stylesheet" href="YOUR_URL/zakeke-styles.css">
<script src="YOUR_URL/zakeke-config.js"></script>
```

3. **Before `</body>`:**
```html
<script src="YOUR_URL/zakeke-order-api.js"></script>
<script src="YOUR_URL/zakeke-webflow-integration.js"></script>
```

### 3. Add to Product Page (2 minutes)

Add this to your product container:
```html
<div data-zakeke-product-id="YOUR_PRODUCT_UUID_FROM_SUPABASE">
  <!-- Your existing product content -->
  
  <button data-zakeke-customize>Customize</button>
</div>
```

**Get Product UUID:**
- Check your Supabase `products_v2` table
- Use the `id` field (UUID format like `9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d`)

### 4. Test

1. Open product page
2. Click "Customize" button
3. Zakeke customizer should open! 🎉

## 🎯 What You Need

1. **Product UUIDs** from Supabase (the `id` field from `products_v2` table)
2. **File hosting** (GitHub, Webflow Assets, or Railway)
3. **5 minutes** to add the code

## 📝 Example

If your product UUID is `9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d`:

```html
<div data-zakeke-product-id="9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d">
  <h1>Roseveil</h1>
  <p>$21.99</p>
  <button data-zakeke-customize>Customize Product</button>
</div>
```

That's it! The integration will automatically:
- ✅ Load Zakeke customizer
- ✅ Fetch product info
- ✅ Handle cart additions
- ✅ Process checkout

## ❓ Questions?

- See `WEBFLOW-NEXT-STEPS.md` for detailed instructions
- See `webflow-setup-instructions.md` for full setup guide

