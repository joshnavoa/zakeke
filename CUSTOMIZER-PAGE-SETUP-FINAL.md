# Add Customizer Page Code to Webflow

## Quick Setup

Your `/customizer` page needs to initialize the Zakeke customizer. Add this code to your page:

### Step 1: Go to Your Customizer Page

1. Open your Webflow project
2. Navigate to the `/customizer` page
3. Go to **Page Settings** (gear icon) > **Custom Code**

### Step 2: Add This Code to Footer Code Section

Copy and paste this entire code block into the **Footer Code** section:

```html
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@c193cf8/customizer-page-init.js"></script>
```

The script above now:

- Loads the official Zakeke UI API script (`customizer.js`)
- Instantiates `ZakekeDesigner` as described in the Zakeke docs
- Builds the required `config` object (productId, quantity, callbacks, etc.)
- Wires Zakeke’s callbacks (`getProductInfo`, `addToCart`, `editAddToCart`, `onBackClicked`) to the existing functions in `zakeke-config.js`
- Creates the iframe through `customizer.createIframe(config, 'zakeke-container')`

If you prefer to inline everything manually, replicate the logic inside `customizer-page-init.js` so your page:

1. Creates a container div (id `zakeke-container`)
2. Loads `https://portal.zakeke.com/scripts/integration/apiV2/customizer.js`
3. Instantiates `new ZakekeDesigner()`
4. Passes the config object with the callbacks documented by Zakeke

Refer to [Zakeke’s Customizer UI API docs](https://docs.zakeke.com/docs/API/Integration/Visual-Product-Customizer/customizer-UI-API#2-create-the-customizer-page) for the full list of supported config options.

### Step 3: Save and Publish

1. Click **Save** in Webflow
2. **Publish** your site
3. Test by clicking "Customize Product" on your product page

## What This Does

- Gets product ID from URL parameters (`?productid=XXX`)
- Tries to get customizer URL from Zakeke's Configurator API
- Falls back to `portal.zakeke.com/customizer` if API fails
- Creates a full-screen iframe with the Zakeke customizer
- Handles errors gracefully

## Testing

After adding the code:
1. Go to your test product page: `https://pss-5215cc.webflow.io/zakeke-test`
2. Click "Customize Product" button
3. The customizer should open in a modal
4. You should see the Zakeke customizer interface

## Troubleshooting

If the customizer doesn't load:
- Check browser console (F12) for errors
- Verify product ID is in URL: `?productid=09cedfae-c232-4610-bbc7-601ca81059c1`
- Make sure the product is published in Zakeke
- Verify Product Catalog API is configured in Zakeke dashboard

