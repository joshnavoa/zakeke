# Latest Webflow Code (Updated for /customizer page)

## ✅ Latest Commit: `@a49e0af`

This version uses your new `/customizer` page at `https://pss-5215cc.webflow.io/customizer`

## Copy & Paste This Code

### In `<head>` tag section:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@a49e0af/zakeke-styles.css">

<!-- Zakeke Configuration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@a49e0af/zakeke-config.js"></script>
```

### Before `</body>` tag section:
```html
<!-- Zakeke Order API -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@a49e0af/zakeke-order-api.js"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@a49e0af/zakeke-webflow-integration.js"></script>
```

## What's Configured

- ✅ Customizer URL: `https://pss-5215cc.webflow.io/customizer`
- ✅ Staging domain: `pss-5215cc.webflow.io`
- ✅ Product ID detection working
- ✅ Button click handler attached

## After Updating

1. **Update the code in Webflow** with the commit hash `@a49e0af`
2. **Refresh your test page**
3. **Click "Customize Product" button**
4. **Check browser console** - you should see:
   - "Zakeke: Using configured store customizer URL: https://pss-5215cc.webflow.io/customizer"
   - "Zakeke: Final customizer iframe URL: ..."
   - Modal should open with iframe

## Testing Checklist

- [ ] Scripts loading from `@a49e0af`
- [ ] Product ID found in console
- [ ] Button click opens modal
- [ ] Iframe loads `/customizer` page
- [ ] Zakeke customizer appears (or shows appropriate message)

## For Production

When ready for production, update `zakeke-config.js`:
```javascript
storeCustomizerUrl: 'https://www.urnory.com/customizer'
```

