# Final Webflow Custom Code (Use Commit Hash)

## Use This Code (Pinned to Specific Commit)

This uses the commit hash to ensure you get the fixed version, bypassing all cache issues.

### In `<head>` tag section:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@6fe96b2/zakeke-styles.css">

<!-- Zakeke Configuration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@6fe96b2/zakeke-config.js"></script>
```

### Before `</body>` tag section:
```html
<!-- Zakeke Order API -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@6fe96b2/zakeke-order-api.js"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@6fe96b2/zakeke-webflow-integration.js"></script>
```

## Why Use Commit Hash?

- ✅ Bypasses all cache (browser and CDN)
- ✅ Pins to specific working version
- ✅ Guaranteed to get the fixed code
- ✅ Won't auto-update (stable)

## Alternative: Use @main with Cache Busting

If you prefer to always get the latest version:

### In `<head>` tag section:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-styles.css?v=3">

<!-- Zakeke Configuration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-config.js?v=3"></script>
```

### Before `</body>` tag section:
```html
<!-- Zakeke Order API -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-order-api.js?v=3"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-webflow-integration.js?v=3"></script>
```

**Note:** Increment `?v=3` to `?v=4`, `?v=5`, etc. if cache issues persist.

