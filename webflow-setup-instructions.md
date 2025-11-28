# Zakeke Webflow Integration Setup Guide

This guide will help you integrate Zakeke product customization into your Webflow project.

## Prerequisites

1. Zakeke account with API credentials
2. Webflow project with product pages
3. Access to Webflow's custom code section

## Step 1: Get Your Zakeke Credentials

1. **Log in to Zakeke Back-Office**
   - Go to your Zakeke account dashboard

2. **Navigate to API Keys**
   - Click on **"Your account"** (located at the top right corner)
   - Select **"API Keys"** from the dropdown menu

3. **Copy Your Credentials**
   - **Client ID** → This is your `tenantId`
   - **Secret Key** → This is your `apiKey`
   - Note your API URL (usually `https://api.zakeke.com`)

> 📖 See `HOW-TO-GET-CREDENTIALS.md` for detailed instructions with screenshots

## Step 2: Configure Zakeke Settings

1. Open `zakeke-config.js`
2. Replace the placeholder values:
   ```javascript
   const ZAKEKE_CONFIG = {
     tenantId: 'YOUR_TENANT_ID',  // Replace with your tenant ID
     apiKey: 'YOUR_API_KEY',      // Replace with your API key
     apiUrl: 'https://api.zakeke.com',
     customizerUrl: 'https://customizer.zakeke.com'
   };
   ```

## Step 3: Add Files to Webflow

### Option A: Using Webflow's Custom Code (Recommended)

1. In Webflow, go to **Project Settings** > **Custom Code**
2. Add the following files in order:

#### In the `<head>` tag:
```html
<!-- Zakeke Styles -->
<link rel="stylesheet" href="https://your-domain.com/zakeke-styles.css">

<!-- Zakeke Configuration -->
<script src="https://your-domain.com/zakeke-config.js"></script>
```

#### Before `</body>` tag:
```html
<!-- Zakeke Order API -->
<script src="https://your-domain.com/zakeke-order-api.js"></script>

<!-- Zakeke Webflow Integration -->
<script src="https://your-domain.com/zakeke-webflow-integration.js"></script>
```

### Option B: Host Files on Your Server

1. Upload all JavaScript and CSS files to your hosting server
2. Update the file paths in the custom code section

## Step 4: Set Up Product Pages

### Add Product Data Attributes

On your product pages, add data attributes to identify products:

```html
<!-- Product Container -->
<div data-zakeke-product-id="YOUR_PRODUCT_ID" data-zakeke-variant-id="YOUR_VARIANT_ID">
  <!-- Your product content -->
  
  <!-- Customize Button (optional - will be created automatically if not present) -->
  <button data-zakeke-customize>Customize Product</button>
</div>
```

### Alternative: Use URL Parameters

You can also pass product information via URL:
```
https://yoursite.com/product?productId=123&variantId=456
```

## Step 5: Set Up Checkout Integration

### Update Checkout Form

Add data attributes to your checkout form:

```html
<form data-wf-checkout>
  <input type="email" name="email" required>
  <input type="text" name="firstName" required>
  <input type="text" name="lastName" required>
  <input type="tel" name="phone">
  
  <!-- Shipping Address -->
  <input type="text" name="shippingFirstName" required>
  <input type="text" name="shippingLastName" required>
  <input type="text" name="shippingAddress" required>
  <input type="text" name="shippingCity" required>
  <input type="text" name="shippingState" required>
  <input type="text" name="shippingZip" required>
  <input type="text" name="shippingCountry" required>
  
  <button type="submit">Complete Order</button>
</form>
```

## Step 6: Test the Integration

1. **Test Product Customization:**
   - Navigate to a product page
   - Click the "Customize Product" button
   - Verify the Zakeke customizer opens
   - Make customizations
   - Add to cart

2. **Test Cart:**
   - Verify customized products appear in cart
   - Check that customization data is preserved

3. **Test Checkout:**
   - Proceed to checkout
   - Fill out the form
   - Submit order
   - Verify order is created in Zakeke

## Step 7: Customize Styling (Optional)

Edit `zakeke-styles.css` to match your Webflow site's design:
- Update colors to match your brand
- Adjust modal size and positioning
- Customize button styles

## API Callbacks Reference

### getProductInfo(productId, variantId)
Fetches product information from Zakeke API. Called automatically by the customizer.

### addToCart(customizationData)
Called when user adds a customized product to cart. Handles:
- Storing customization data
- Adding to Webflow cart (if applicable)
- Adding to Zakeke cart via API

### editAddToCart(cartItemId, customizationData)
Called when user edits a product already in cart. Updates:
- Cart item customization data
- Preview image
- Price (if changed)

## Troubleshooting

### Customizer Not Opening
- Check browser console for errors
- Verify Zakeke script is loading
- Confirm product ID is correct
- Check API credentials

### Products Not Adding to Cart
- Verify `addToCart` callback is working
- Check API response in network tab
- Ensure cart storage is initialized

### Checkout Failing
- Verify all required form fields are present
- Check API credentials
- Review order API response for errors
- Ensure cart items are properly formatted

## Support

For Zakeke API documentation, visit: https://docs.zakeke.com

For issues with this integration, check:
1. Browser console for JavaScript errors
2. Network tab for API request/response details
3. Zakeke dashboard for API logs

