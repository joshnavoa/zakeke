# Local Testing Guide

This guide will help you test the Zakeke integration locally before deploying to Webflow.

## Quick Start

### Option 1: Python HTTP Server (Easiest)

1. **Open Terminal** in the project directory (`/Users/joshnavoa/zak`)

2. **Start a local server:**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/test-local.html
   ```

### Option 2: Node.js HTTP Server

1. **Install http-server** (if you don't have it):
   ```bash
   npm install -g http-server
   ```

2. **Start server:**
   ```bash
   http-server -p 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/test-local.html
   ```

### Option 3: VS Code Live Server

If you use VS Code:
1. Install the "Live Server" extension
2. Right-click on `test-local.html`
3. Select "Open with Live Server"

## What You Need to Test

### 1. Product ID from Zakeke

You'll need at least one product ID from your Zakeke account to test:
- Log into Zakeke dashboard
- Go to Products
- Copy a product ID
- Enter it in the test page

### 2. Test the Integration

The test page (`test-local.html`) includes:

1. **Configuration Check** - Verifies your credentials are loaded
2. **Product Info API** - Tests fetching product data
3. **Customizer** - Opens the Zakeke iframe editor
4. **Cart Functions** - Tests adding/removing items
5. **Order API** - Tests creating orders (use with caution!)

## Testing Checklist

- [ ] Configuration loads correctly
- [ ] Can fetch product info with a real product ID
- [ ] Customizer opens (may need to check CORS settings)
- [ ] Can add items to cart
- [ ] Can create test orders

## Troubleshooting

### CORS Errors

If you see CORS errors in the console:
- The Zakeke API may need your domain whitelisted
- For local testing, you may need to contact Zakeke support
- Some APIs work fine, others may require production domain

### Customizer Not Loading

- Check browser console for errors
- Verify the customizer URL is correct
- Make sure you're using `http://localhost` not `file://`

### API Errors

- Verify your credentials are correct
- Check that product IDs exist in your Zakeke account
- Review API response in Network tab

## Next Steps

Once local testing works:
1. Upload files to your hosting/CDN
2. Add to Webflow Custom Code
3. Test on your actual Webflow site

## Files for Testing

- `test-local.html` - Main test page
- `zakeke-config.js` - Your configuration (with credentials)
- `zakeke-order-api.js` - Order API functions
- `zakeke-webflow-integration.js` - Integration logic
- `zakeke-styles.css` - Styling

All files should be in the same directory for local testing.

