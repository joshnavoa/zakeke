# Zakeke Customizer Page Code

## Add This to Your `/customizer` Page in Webflow

Since your `/customizer` page is empty, you need to add the Zakeke customizer initialization code. 

### Option 1: Add to Webflow Custom Code (Recommended)

1. Go to your `/customizer` page in Webflow
2. Go to **Page Settings** > **Custom Code**
3. Add this code in the **Footer Code** section:

```html
<script>
// Zakeke Customizer Initialization
// This code initializes the Zakeke customizer when the page loads

(function() {
  // Get product parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productid');
  const variantId = urlParams.get('variantid');
  const quantity = urlParams.get('quantity') || '1';
  
  if (!productId) {
    console.error('Zakeke: Product ID not found in URL parameters');
    document.body.innerHTML = '<div style="padding: 40px; text-align: center;"><p>Product ID is required</p></div>';
    return;
  }
  
  console.log('Zakeke Customizer Page: Initializing for product:', productId);
  
  // The Zakeke customizer will be embedded here
  // For now, this page will receive the product parameters
  // The actual customizer will be loaded via iframe from the parent page
  
  // If you need to embed Zakeke customizer directly on this page,
  // you'll need to get the embed code from your Zakeke dashboard
  // and add it here
  
  // For now, this page just needs to exist and accept the parameters
  // The parent page will handle the customizer iframe
})();
</script>
```

### Option 2: Use Zakeke's Embed Code

If Zakeke provides embed code in your dashboard:

1. Copy the embed code from Zakeke dashboard
2. Add it to your `/customizer` page in Webflow
3. The code will automatically use the URL parameters

### Current Setup

The integration code will:
- Load your `/customizer` page in an iframe
- Pass product parameters via URL: `?productid=XXX&quantity=1`
- The page receives these parameters
- Zakeke customizer should initialize (if embed code is added)

## Next Steps

1. Add the code above to your `/customizer` page
2. Or get the Zakeke embed code from your dashboard and add it
3. Test the customizer button again

