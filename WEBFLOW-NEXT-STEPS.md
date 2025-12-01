# Webflow Integration - Next Steps

## ✅ What's Done

1. **Product Catalog API** - Deployed and working on Railway
2. **Products syncing** - Products are being fetched from Supabase and sent to Zakeke
3. **Frontend files** - All integration files are ready

## 🎯 Next Steps for Webflow

### Step 1: Host the Frontend Files

You need to host these files somewhere accessible:
- `zakeke-config.js`
- `zakeke-webflow-integration.js`
- `zakeke-order-api.js`
- `zakeke-styles.css`

**Options:**
1. **Upload to your Webflow site** (if you have hosting)
2. **Use a CDN** (like jsDelivr, unpkg, or your own CDN)
3. **Host on Railway** (add a static file server)
4. **Use GitHub Pages** (if your repo is public)

### Step 2: Add Files to Webflow Custom Code

1. Go to **Webflow Project Settings** > **Custom Code**

2. **In the `<head>` tag section**, add:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://your-domain.com/path/to/zakeke-styles.css">

<!-- Zakeke Configuration -->
<script src="https://your-domain.com/path/to/zakeke-config.js"></script>
```

3. **Before `</body>` tag**, add:
```html
<!-- Zakeke Order API -->
<script src="https://your-domain.com/path/to/zakeke-order-api.js"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://your-domain.com/path/to/zakeke-webflow-integration.js"></script>
```

### Step 3: Update Product Pages

On each product page, add data attributes to identify the product:

**Option A: Using Data Attributes (Recommended)**
```html
<!-- Add to your product container -->
<div 
  data-zakeke-product-id="YOUR_PRODUCT_CODE" 
  data-zakeke-variant-id="OPTIONAL_VARIANT_ID"
>
  <!-- Your product content -->
  
  <!-- Customize Button (will be created automatically if not present) -->
  <button data-zakeke-customize class="customize-button">
    Customize Product
  </button>
</div>
```

**Option B: Using URL Parameters**
The integration will automatically detect:
- `?productId=YOUR_PRODUCT_CODE`
- `?variantId=OPTIONAL_VARIANT_ID`

**Important:** Use the product `code` from Supabase (the UUID), not the name!

### Step 4: Map Your Products

You need to map your Webflow products to Supabase product codes:

1. **Get product codes from Supabase:**
   - Check your `products_v2` table
   - Note the `id` field (UUID) - this is the `code` Zakeke uses

2. **Add to Webflow:**
   - Use the UUID as `data-zakeke-product-id`
   - Example: `data-zakeke-product-id="9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d"`

### Step 5: Test the Integration

1. **Test Product Customization:**
   - Go to a product page
   - Click "Customize Product" button
   - Zakeke customizer should open
   - Make customizations
   - Add to cart

2. **Test Cart:**
   - Check that customized products appear in cart
   - Verify customization data is preserved

3. **Test Checkout:**
   - Proceed to checkout
   - Fill out the form
   - Submit order
   - Verify order is created in Zakeke

### Step 6: Customize Styling (Optional)

Edit `zakeke-styles.css` to match your Webflow site:
- Update colors to match your brand
- Adjust modal size and positioning
- Customize button styles

## 📋 Quick Checklist

- [ ] Host frontend files (zakeke-config.js, zakeke-webflow-integration.js, etc.)
- [ ] Add files to Webflow Custom Code section
- [ ] Update product pages with data attributes
- [ ] Map Webflow products to Supabase product codes
- [ ] Test product customization
- [ ] Test cart functionality
- [ ] Test checkout integration
- [ ] Customize styling (optional)

## 🔧 Troubleshooting

### Customizer Not Opening
- Check browser console for errors
- Verify Zakeke script is loading
- Confirm product ID matches Supabase product code
- Check API credentials in `zakeke-config.js`

### Products Not Adding to Cart
- Verify `addToCart` callback is working
- Check API response in network tab
- Ensure cart storage is initialized

### Checkout Failing
- Verify all required form fields are present
- Check API credentials
- Review order API response for errors

## 📚 Files Reference

- `zakeke-config.js` - Configuration (credentials, API URLs)
- `zakeke-webflow-integration.js` - Main integration logic
- `zakeke-order-api.js` - Order/checkout handling
- `zakeke-styles.css` - Styling for customizer modal

## 🚀 Need Help?

1. Check browser console for JavaScript errors
2. Review network tab for API request/response details
3. Check Zakeke dashboard for API logs
4. See `webflow-setup-instructions.md` for detailed setup guide

