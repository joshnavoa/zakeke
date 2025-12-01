# Fix: jsDelivr Cache Issue

## The Problem

jsDelivr CDN caches files, so even though we pushed the fix, it's still serving the old version with `process.env`.

## The Solution

Add a cache-busting parameter (`?v=2`) to force jsDelivr to fetch the new version.

## Updated Code for Webflow

### In `<head>` section:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-styles.css?v=2">

<!-- Zakeke Configuration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-config.js?v=2"></script>
```

### Before `</body>` section:
```html
<!-- Zakeke Order API -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-order-api.js?v=2"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-webflow-integration.js?v=2"></script>
```

## Steps to Fix

1. Go to **Webflow Project Settings** → **Custom Code**
2. Update all 4 URLs to add `?v=2` at the end
3. Click **Save**
4. Refresh your page
5. Check console - errors should be gone!

## After It Works

Once confirmed working, you can:
- Keep `?v=2` (safe, forces fresh load)
- Or remove it (jsDelivr will cache the new version)

## Alternative: Use Commit Hash

For permanent cache-busting, use the commit hash instead of `@main`:

```html
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@6fe96b2/zakeke-config.js"></script>
```

This pins to a specific commit and won't auto-update.

