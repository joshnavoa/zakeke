# Zakeke Customizer Page Setup

## The Problem

Your `/customizer` page is empty because it doesn't have the Zakeke customizer embedded in it. The page needs to load the Zakeke customizer JavaScript.

## Solution: Embed Zakeke Customizer on the Page

You need to add the Zakeke customizer code to your `/customizer` page in Webflow. Here's what to do:

### Option 1: Add Zakeke Customizer Script to the Page

1. **Go to your `/customizer` page in Webflow**
2. **Add an Embed element** (or use the page's custom code section)
3. **Add this code** to initialize the Zakeke customizer:

```html
<script>
// Get product ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productid');
const variantId = urlParams.get('variantid');
const quantity = urlParams.get('quantity') || '1';

if (productId) {
  // Initialize Zakeke customizer
  // This will use the Zakeke Configurator UI API
  console.log('Zakeke: Initializing customizer for product:', productId);
  
  // The Zakeke customizer should load automatically
  // You may need to check your Zakeke dashboard for the correct embed code
}
</script>
```

### Option 2: Use Zakeke's Embed Code

Check your Zakeke dashboard for the embed code. It might look like:

```html
<div id="zakeke-customizer"></div>
<script>
  // Zakeke customizer initialization code
  // This will be provided by Zakeke
</script>
```

### Option 3: Use Configurator UI API

The code has been updated to try using Zakeke's Configurator UI API. However, you may need to:

1. **Check your Zakeke dashboard** for the correct customizer URL format
2. **Contact Zakeke support** to get the correct embed code for your account
3. **Verify your Product Catalog API** is properly configured in Zakeke

## Current Code Status

The integration code now:
- ✅ Tries to get customizer URL from Configurator API
- ✅ Falls back to building Zakeke customizer URL with tenant/product parameters
- ✅ Opens modal with iframe

## Next Steps

1. **Check Zakeke Dashboard**:
   - Look for "Customizer URL" or "Embed Code" settings
   - Find the correct URL format for your account

2. **Add Customizer Code to `/customizer` Page**:
   - Add the Zakeke customizer JavaScript to the page
   - Or use Zakeke's provided embed code

3. **Test Again**:
   - Update Webflow with latest commit (`@9b0385f`)
   - Click "Customize Product" button
   - Check if customizer loads

## Alternative: Use Zakeke's Direct Customizer URL

If Zakeke provides a direct customizer URL format, we can update the code to use it. The current code tries:
- `https://customizer.zakeke.com/?tenant=320250&productid=XXX`

But this redirects to WordPress, so it's not the correct format for your account.

