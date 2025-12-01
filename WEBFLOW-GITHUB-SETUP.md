# Webflow Setup with GitHub + jsDelivr

## Prerequisites

✅ Your GitHub repo must be **public** for jsDelivr to work.

## Step 1: Verify Repo is Public

1. Go to your GitHub repo: `https://github.com/joshnavoa/zakeke`
2. Check if you see a green "Public" badge (not "Private")
3. If it's private, go to **Settings** → **Change visibility** → Make it public

## Step 2: Copy the Code Below

Use the exact code below in your Webflow Custom Code section.

## Step 3: Add to Webflow Custom Code

1. Go to **Webflow Project Settings** → **Custom Code**

2. **In the `<head>` tag section**, paste:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-styles.css">

<!-- Zakeke Configuration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-config.js"></script>
```

3. **Before `</body>` tag**, paste:
```html
<!-- Zakeke Order API -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-order-api.js"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-webflow-integration.js"></script>
```

4. Click **Save**

## Complete Code (Copy & Paste)

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

**Note:** The `?v=2` parameter forces cache refresh. Remove it after confirming it works.

## Individual File URLs

If you need the URLs separately:

- **CSS:** `https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-styles.css`
- **Config:** `https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-config.js`
- **Order API:** `https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-order-api.js`
- **Integration:** `https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@main/zakeke-webflow-integration.js`

## How jsDelivr Works

- Format: `https://cdn.jsdelivr.net/gh/USERNAME/REPO@BRANCH/FILE`
- Your repo: `joshnavoa/zakeke`
- Branch: `main`
- Files: The 4 frontend files

## Updating Files

When you update files in GitHub:
1. Push changes to `main` branch
2. jsDelivr will automatically serve the new version
3. Clear browser cache if needed (or add `?v=2` to URLs)

## Troubleshooting

### Files not loading?
- ✅ Check repo is public
- ✅ Verify branch name is `main` (not `master`)
- ✅ Check file names match exactly
- ✅ Try opening URL directly in browser

### Want to use a different branch?
Replace `@main` with your branch name:
```html
https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@your-branch-name/zakeke-config.js
```

### Want to pin to a specific commit?
Replace `@main` with commit hash:
```html
https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@abc123def456/zakeke-config.js
```

## Benefits of GitHub + jsDelivr

✅ Free CDN (fast loading worldwide)
✅ Easy to update (just push to GitHub)
✅ Version control (can pin to specific commits)
✅ No file size limits
✅ Automatic caching

