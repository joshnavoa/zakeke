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
<script src="https://cdn.jsdelivr.net/gh/joshnavoa/zakeke@e774c15/customizer-page-init.js"></script>
```

**OR** if you prefer to inline the code (recommended for better control):

```html
<script>
// Zakeke Customizer Page Initialization
// Get product parameters from URL and load Zakeke customizer

(function() {
  'use strict';
  
  const ZAKEKE_CONFIG = {
    tenantId: '320250',
    apiKey: '-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.',
    apiUrl: 'https://api.zakeke.com',
    customizerUrl: 'https://customizer.zakeke.com'
  };
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productid');
  const variantId = urlParams.get('variantid');
  const quantity = parseInt(urlParams.get('quantity') || '1', 10);
  
  console.log('Zakeke Customizer: Product ID:', productId);
  
  if (!productId) {
    document.body.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>Product ID Required</h2></div>';
    return;
  }
  
  const container = document.createElement('div');
  container.id = 'zakeke-customizer-container';
  container.style.cssText = 'width:100%;height:100vh;min-height:600px;position:fixed;top:0;left:0;z-index:9999;background:#fff';
  document.body.style.cssText = 'margin:0;padding:0;overflow:hidden';
  document.body.appendChild(container);
  
  // Try Configurator API first
  fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/configurator/url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productId: productId,
      variantId: variantId || null,
      quantity: quantity,
      tenantId: ZAKEKE_CONFIG.tenantId
    })
  })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
    .then(data => {
      let url = null;
      if (data.url && !data.url.includes('wordpress')) {
        url = data.url;
      } else {
        // Format: https://portal.zakeke.com/customizer?tenant=320250&productid=XXX
        url = `https://portal.zakeke.com/customizer?tenant=${ZAKEKE_CONFIG.tenantId}`;
        if (productId) url += `&productid=${productId}`;
        if (quantity) url += `&quantity=${quantity}`;
        if (variantId) url += `&variantid=${variantId}`;
      }
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = 'width:100%;height:100%;border:none';
    iframe.setAttribute('allow', 'camera; microphone; fullscreen');
    iframe.setAttribute('allowfullscreen', 'true');
    container.appendChild(iframe);
    console.log('Zakeke Customizer: Loading:', url);
  })
  .catch(err => {
    console.error('Zakeke Customizer: Error:', err);
    // Format: https://portal.zakeke.com/customizer?tenant=320250&productid=XXX
    let url = `https://portal.zakeke.com/customizer?tenant=${ZAKEKE_CONFIG.tenantId}`;
    if (productId) url += `&productid=${productId}`;
    if (quantity) url += `&quantity=${quantity}`;
    if (variantId) url += `&variantid=${variantId}`;
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = 'width:100%;height:100%;border:none';
    iframe.setAttribute('allow', 'camera; microphone; fullscreen');
    iframe.setAttribute('allowfullscreen', 'true');
    container.appendChild(iframe);
  });
})();
</script>
```

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

