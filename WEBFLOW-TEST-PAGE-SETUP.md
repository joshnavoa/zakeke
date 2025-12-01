# Webflow Test Page Setup

## Why the Page Looks Empty

The Zakeke integration scripts don't automatically create content - they need:
1. ✅ Scripts loaded (you've done this)
2. ❌ Product data attributes on the page
3. ❌ Product content/HTML to display

## Quick Fix: Add Product Content

Your page needs HTML content with product data attributes. Here's what to add:

### Option 1: Simple Test Page

Add this HTML to your Webflow page (using a Rich Text element or Embed code):

```html
<div data-zakeke-product-id="9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d" style="max-width: 800px; margin: 40px auto; padding: 20px;">
  <h1>Roseveil - Test Product</h1>
  <p style="font-size: 24px; color: #007bff; font-weight: bold;">$21.99</p>
  <p>This is a test product page for Zakeke integration.</p>
  
  <button data-zakeke-customize style="background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 20px;">
    Customize Product
  </button>
</div>
```

### Option 2: Using Webflow Elements

1. **Add a Div Block** to your page
2. **Add a Custom Attribute:**
   - Select the div
   - In Settings → Custom Attributes
   - Add: `data-zakeke-product-id` = `9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d`

3. **Add content inside the div:**
   - Heading: "Roseveil - Test Product"
   - Text: "$21.99"
   - Button with custom attribute: `data-zakeke-customize`

## Get a Real Product ID

To use a real product from your Supabase:

1. Go to your Supabase dashboard
2. Open `products_v2` table
3. Copy the `id` field (UUID) of any product
4. Replace `9e0e5f48-edcb-4e8c-95a9-5e2e4cc8e89d` with your product ID

## What Should Happen

Once you add the product data attributes:

1. ✅ Page will show product content
2. ✅ "Customize Product" button will appear
3. ✅ Clicking button opens Zakeke customizer
4. ✅ Customizer loads product from Zakeke API

## Troubleshooting

### Still Empty?
- Check browser console (F12) for errors
- Verify scripts are loading (Network tab)
- Make sure GitHub repo is public
- Check that product ID exists in Zakeke

### Button Not Working?
- Verify `data-zakeke-product-id` attribute is set
- Check browser console for JavaScript errors
- Ensure all 4 scripts loaded successfully

### Scripts Not Loading?
- Check if GitHub repo is public
- Try opening the jsDelivr URLs directly in browser
- Verify branch name is `main` (not `master`)

## Test the Scripts Are Loading

Open browser console (F12) and check:
1. No red errors
2. Type: `typeof ZAKEKE_CONFIG` - should return `"object"`
3. Type: `typeof initZakekeOnProductPage` - should return `"function"`

If these work, scripts are loaded correctly!

