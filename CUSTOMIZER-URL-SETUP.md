# Zakeke Customizer URL Setup for urnory.com

## Current Issue

The Zakeke customizer is redirecting to a WordPress site instead of opening the customizer. This is because the customizer URL needs to be properly configured.

## Your Domain

- **Store URL**: `https://www.urnory.com/`
- **Configured Customizer URL**: `https://www.urnory.com/customizer.html` (currently returns 404)

## What You Need to Do

### Option 1: Configure Customizer URL in Zakeke Dashboard (Recommended)

1. **Log in to Zakeke Back-Office**
   - Go to your Zakeke account dashboard
   - Navigate to **Settings** or **Integration Settings**

2. **Set Your Store URL**
   - Find the "Store URL" or "Customizer URL" setting
   - Set it to: `https://www.urnory.com`
   - Save the configuration

3. **Check Customizer URL Format**
   - Zakeke might provide you with a specific customizer URL format
   - It might be something like:
     - `https://www.urnory.com/customizer.html`
     - `https://customizer.zakeke.com/?store=urnory.com`
     - Or a different format specific to your account

### Option 2: Create Customizer Page in Webflow

If Zakeke requires a customizer page on your domain:

1. **Create a new page in Webflow**
   - Page name: `customizer` or `customizer.html`
   - URL: `/customizer` or `/customizer.html`

2. **Add Zakeke Embed Code**
   - Add an Embed element to the page
   - Insert the Zakeke customizer embed code (if provided)
   - Or leave it empty - the iframe will be loaded via JavaScript

3. **Update the Config**
   - The code will automatically use `https://www.urnory.com/customizer.html`
   - Or update `storeCustomizerUrl` in `zakeke-config.js` if different

### Option 3: Use Zakeke's Default Customizer (If Available)

If Zakeke provides a default customizer URL that works with your tenant ID:

1. **Check Zakeke Documentation**
   - Look for the customizer URL format in your Zakeke dashboard
   - It might be: `https://customizer.zakeke.com/?tenant=320250&productid=XXX`

2. **Update the Code**
   - If you find the correct URL format, we can update the code to use it

## Testing

After configuring:

1. **Update Webflow** with the latest commit (`@de710d0` or newer)
2. **Test the button** - click "Customize Product"
3. **Check browser console** - look for:
   - "Zakeke: Got customizer URL from API" (if API provides it)
   - "Zakeke: Using configured store customizer URL" (if using your domain)
   - "Zakeke: Final customizer iframe URL" (the URL being used)

## Next Steps

1. Check your Zakeke dashboard for the customizer URL configuration
2. Contact Zakeke support if you're unsure about the URL format
3. Test with the updated code and check the console logs

## Current Code Status

- ✅ Domain configured: `https://www.urnory.com`
- ✅ Code tries multiple methods to get customizer URL
- ✅ Falls back to your domain + `/customizer.html`
- ⚠️ Need to verify correct URL format with Zakeke

