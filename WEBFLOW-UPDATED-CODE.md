# Updated Webflow Code (Iframe-Based Customizer)

## ✅ Latest Fix: Iframe-Based Customizer

I've fixed the integration to use Zakeke's iframe-based customizer (they don't have a JavaScript SDK).

## Copy & Paste This Code

### In `<head>` tag section:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@c702c03/zakeke-styles.css">

<!-- Zakeke Configuration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@c702c03/zakeke-config.js"></script>
```

### Before `</body>` tag section:
```html
<!-- Zakeke Order API -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@c702c03/zakeke-order-api.js"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@c702c03/zakeke-webflow-integration.js"></script>
```

## What Changed

- ✅ Removed attempt to load non-existent `customizer.js` script
- ✅ Now uses iframe-based customizer (Zakeke's standard approach)
- ✅ Button will open customizer in a modal with iframe
- ✅ No more script loading errors

## After Updating

1. Update the code in Webflow Custom Code section
2. Refresh your page
3. Click "Customize Product" button
4. Customizer should open in a modal! 🎉

## Test It

After updating, you should see:
- ✅ No console errors
- ✅ "Zakeke: Initialization complete" message
- ✅ Clicking button opens modal with iframe
- ✅ Zakeke customizer loads inside iframe

