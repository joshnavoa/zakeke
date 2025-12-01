// Zakeke Configuration
// 
// ⚠️ SET YOUR CREDENTIALS HERE ⚠️
// 
// NOTE: This is CLIENT-SIDE code (runs in browser), so it cannot use .env directly.
// For client-side, credentials must be set here. They will be visible in browser source.
// This is normal for client-side integrations - the API key is public.
//
// For SERVER-SIDE code (zakeke-product-catalog-api.js), credentials are pulled from .env
// and environment variables - no hardcoded values.
//
// To get your credentials:
// 1. Log in to Zakeke back-office
// 2. Click "Your account" (top right) > "API Keys"
// 3. Copy your "Client ID" (tenantId) and "Secret Key" (apiKey)
//
// See HOW-TO-GET-CREDENTIALS.md and CREDENTIALS-SETUP.md for detailed instructions
//
// Browser-side configuration (process.env is not available in browser)
// These values are public and will be visible in browser source code (this is normal for client-side API keys)
const ZAKEKE_CONFIG = {
  tenantId: '320250',
  apiKey: '-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.',
  apiUrl: 'https://api.zakeke.com',
  customizerUrl: 'https://customizer.zakeke.com', // Legacy, may not work
  // Store customizer URL - your Webflow domain
  // Based on Zakeke Cart API, format should be: https://your-store.com/customizer
  // Production customizer page hosted on Webflow
  storeCustomizerUrl: 'https://www.urnory.com/customizer',
  // Server-side proxy (Railway) to avoid browser CORS issues for product info
  productInfoProxyUrl: 'https://zakeke-production.up.railway.app/storefront/products'
};

// Store for cart items
let zakekeCart = [];

// Initialize Zakeke Customizer (iframe-based, no SDK needed)
// This function is kept for compatibility but Zakeke uses iframe approach
function initZakekeCustomizer(productId, variantId = null) {
  // Zakeke uses iframe-based customizer, not a JavaScript SDK
  // Return a simple object that can be used with openCustomizerIframe
  return {
    productId: productId,
    variantId: variantId,
    open: function(options) {
      // Legacy support - redirect to iframe approach
      openCustomizerIframe(productId, variantId);
    }
  };
}

// Callback: Get product information
async function getProductInfo(productId, variantId) {
  try {
    const useProxy = Boolean(ZAKEKE_CONFIG.productInfoProxyUrl);
    const baseUrl = useProxy
      ? ZAKEKE_CONFIG.productInfoProxyUrl
      : `${ZAKEKE_CONFIG.apiUrl}/api/v2/products`;

    const normalizedBase = baseUrl.replace(/\/$/, '');
    const params = variantId ? `?variantId=${encodeURIComponent(variantId)}` : '';
    const requestUrl = `${normalizedBase}/${encodeURIComponent(productId)}${params}`;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (!useProxy) {
      headers['Authorization'] = `Bearer ${ZAKEKE_CONFIG.apiKey}`;
    }

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch product (${response.status}): ${errorText || response.statusText}`);
    }

    const productData = await response.json();
    
    // Return product info in the format Zakeke expects
    return {
      id: productData.id || productData.code || productId,
      name: productData.name || 'Product',
      price: typeof productData.price === 'number' ? productData.price : Number(productData.price) || 0,
      currency: productData.currency || 'USD',
      image: productData.image || productData.thumbnail || '',
      variants: productData.variants || []
    };
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
}

// Callback: Add customized product to cart
async function addToCart(customizationData) {
  try {
    // customizationData contains:
    // - productId
    // - variantId (optional)
    // - previewImage
    // - customizationData (the actual customization data)
    // - quantity
    // - price
    
    const cartItem = {
      productId: customizationData.productId,
      variantId: customizationData.variantId,
      quantity: customizationData.quantity || 1,
      price: customizationData.price,
      previewImage: customizationData.previewImage,
      customizationData: customizationData.customizationData,
      zakekeCustomizationId: customizationData.customizationId
    };

    // Add to local cart storage
    zakekeCart.push(cartItem);

    // Add to Webflow cart (if using Webflow's native cart)
    if (typeof window.Webflow !== 'undefined' && window.Webflow.Cart) {
      await addToWebflowCart(cartItem);
    }

    // Or use Cart API to add to Zakeke cart
    const cartResponse = await addToZakekeCart(cartItem);
    
    return {
      success: true,
      cartItemId: cartItem.zakekeCustomizationId,
      message: 'Product added to cart successfully'
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Callback: Edit product in cart
async function editAddToCart(cartItemId, customizationData) {
  try {
    // Find the item in cart
    const cartItemIndex = zakekeCart.findIndex(item => 
      item.zakekeCustomizationId === cartItemId
    );

    if (cartItemIndex === -1) {
      throw new Error('Cart item not found');
    }

    // Update the cart item
    const updatedItem = {
      ...zakekeCart[cartItemIndex],
      previewImage: customizationData.previewImage,
      customizationData: customizationData.customizationData,
      price: customizationData.price
    };

    zakekeCart[cartItemIndex] = updatedItem;

    // Update in Webflow cart
    if (typeof window.Webflow !== 'undefined' && window.Webflow.Cart) {
      await updateWebflowCartItem(cartItemId, updatedItem);
    }

    // Update in Zakeke cart via API
    await updateZakekeCartItem(cartItemId, updatedItem);

    return {
      success: true,
      message: 'Cart item updated successfully'
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Add item to Zakeke Cart via API
async function addToZakekeCart(cartItem) {
  try {
    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/cart/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        price: cartItem.price,
        previewImage: cartItem.previewImage,
        customizationData: cartItem.customizationData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to Zakeke cart:', error);
    throw error;
  }
}

// Update item in Zakeke Cart via API
async function updateZakekeCartItem(cartItemId, cartItem) {
  try {
    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/cart/items/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quantity: cartItem.quantity,
        price: cartItem.price,
        previewImage: cartItem.previewImage,
        customizationData: cartItem.customizationData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update cart item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating Zakeke cart item:', error);
    throw error;
  }
}

// Add to Webflow native cart (if using Webflow's cart system)
async function addToWebflowCart(cartItem) {
  // This is a placeholder - adjust based on your Webflow cart implementation
  // You may need to use Webflow's Cart API or custom cart system
  console.log('Adding to Webflow cart:', cartItem);
  
  // Example: If using Webflow's native cart
  if (window.Webflow && window.Webflow.Cart) {
    // Add your Webflow cart integration here
  }
}

// Update item in Webflow cart
async function updateWebflowCartItem(cartItemId, cartItem) {
  console.log('Updating Webflow cart item:', cartItemId, cartItem);
  // Add your Webflow cart update logic here
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ZAKEKE_CONFIG,
    initZakekeCustomizer,
    getProductInfo,
    addToCart,
    editAddToCart,
    zakekeCart
  };
}

