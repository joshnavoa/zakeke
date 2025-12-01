# How to Upload Files to Webflow Assets

## Step-by-Step Guide

### Step 1: Open Webflow Designer

1. Log in to your Webflow account
2. Open your project
3. Click **"Designer"** to open the Webflow Designer

### Step 2: Open Assets Panel

1. Look at the **left sidebar** in the Designer
2. Find the **"Assets"** icon (looks like a folder/file icon)
3. Click on it to open the Assets panel

**Alternative:** You can also access Assets via:
- Press `Shift + A` (shortcut)
- Or go to **Project Settings** → **Assets** (but Designer is easier)

### Step 3: Upload Files

1. In the Assets panel, click the **"Upload"** button (usually at the top)
2. A file picker will open
3. Select these 4 files from your computer:
   - `zakeke-config.js`
   - `zakeke-webflow-integration.js`
   - `zakeke-order-api.js`
   - `zakeke-styles.css`

**Tip:** You can select all 4 files at once (hold `Cmd` on Mac or `Ctrl` on Windows)

### Step 4: Get File URLs

1. After upload, you'll see your files in the Assets panel
2. **Right-click** on each file
3. Select **"Copy URL"** or **"Copy Link"**
4. Paste it somewhere safe (like a text file) so you can use it later

**Repeat for all 4 files:**
- Copy URL for `zakeke-styles.css`
- Copy URL for `zakeke-config.js`
- Copy URL for `zakeke-order-api.js`
- Copy URL for `zakeke-webflow-integration.js`

### Step 5: Add URLs to Custom Code

1. In Webflow, go to **Project Settings** (gear icon in left sidebar)
2. Click **"Custom Code"** tab
3. You'll see two sections:
   - **Code in `<head>` tag**
   - **Code before `</body>` tag**

4. **In the `<head>` section**, add:
```html
<link rel="stylesheet" href="PASTE_URL_FOR_zakeke-styles.css_HERE">
<script src="PASTE_URL_FOR_zakeke-config.js_HERE"></script>
```

5. **In the `</body>` section**, add:
```html
<script src="PASTE_URL_FOR_zakeke-order-api.js_HERE"></script>
<script src="PASTE_URL_FOR_zakeke-webflow-integration.js_HERE"></script>
```

6. Click **"Save"**

## Example

If your URLs look like this:
- `https://assets.website-files.com/1234567890abcdef/zakeke-styles.css`
- `https://assets.website-files.com/1234567890abcdef/zakeke-config.js`
- etc.

Then your Custom Code would be:

**In `<head>`:**
```html
<link rel="stylesheet" href="https://assets.website-files.com/1234567890abcdef/zakeke-styles.css">
<script src="https://assets.website-files.com/1234567890abcdef/zakeke-config.js"></script>
```

**Before `</body>`:**
```html
<script src="https://assets.website-files.com/1234567890abcdef/zakeke-order-api.js"></script>
<script src="https://assets.website-files.com/1234567890abcdef/zakeke-webflow-integration.js"></script>
```

## Troubleshooting

### Can't find Assets panel?
- Make sure you're in the **Designer** view (not Editor)
- Look for the folder icon in the left sidebar
- Try pressing `Shift + A`

### Files not uploading?
- Check file sizes (Webflow has limits)
- Make sure files are `.js` or `.css` format
- Try uploading one at a time

### Can't copy URL?
- Right-click the file in Assets panel
- Look for "Copy URL" or "Copy Link" option
- Some browsers: Right-click → "Copy link address"

### Files uploaded but not working?
- Make sure URLs are complete (start with `https://`)
- Check that you pasted URLs in the correct sections
- Verify file names match exactly

## Quick Checklist

- [ ] Opened Webflow Designer
- [ ] Opened Assets panel
- [ ] Uploaded all 4 files
- [ ] Copied URLs for all 4 files
- [ ] Added CSS and config to `<head>` section
- [ ] Added order API and integration to `</body>` section
- [ ] Saved Custom Code

## Next Steps

After uploading files:
1. ✅ Files are uploaded
2. ✅ URLs are in Custom Code
3. ➡️ Next: Add data attributes to product pages (see `WEBFLOW-QUICK-START.md`)

