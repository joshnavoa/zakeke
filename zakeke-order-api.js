// Zakeke Order API Integration
// Handles checkout and order creation

// ZAKEKE_CONFIG should be loaded from zakeke-config.js before this file
if (typeof ZAKEKE_CONFIG === 'undefined') {
  console.error('ZAKEKE_CONFIG not found. Make sure zakeke-config.js is loaded first.');
}

/**
 * Create an order from cart items
 * @param {Object} orderData - Order information
 * @param {string} orderData.customerEmail - Customer email
 * @param {string} orderData.customerName - Customer name
 * @param {Object} orderData.shippingAddress - Shipping address
 * @param {Object} orderData.billingAddress - Billing address (optional)
 * @param {Array} orderData.items - Cart items
 * @returns {Promise<Object>} Order response
 */
async function createOrder(orderData) {
  try {
    const orderPayload = {
      customer: {
        email: orderData.customerEmail,
        name: orderData.customerName,
        phone: orderData.customerPhone || ''
      },
      shippingAddress: {
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        address: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        zipCode: orderData.shippingAddress.zipCode,
        country: orderData.shippingAddress.country
      },
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      items: orderData.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        customizationData: item.customizationData,
        previewImage: item.previewImage
      })),
      currency: orderData.currency || 'USD',
      notes: orderData.notes || ''
    };

    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create order: ${response.statusText}`);
    }

    const orderResponse = await response.json();
    return {
      success: true,
      order: orderResponse
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get order status
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order status
 */
async function getOrderStatus(orderId) {
  try {
    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const orderData = await response.json();
    return {
      success: true,
      order: orderData
    };
  } catch (error) {
    console.error('Error fetching order status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process checkout - combines cart items and creates order
 * @param {Object} checkoutData - Checkout information
 * @returns {Promise<Object>} Checkout result
 */
async function processCheckout(checkoutData) {
  try {
    // Get cart items (from zakekeCart or fetch from API)
    const cartItems = checkoutData.items || [];
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Create order
    const orderResult = await createOrder({
      customerEmail: checkoutData.customerEmail,
      customerName: checkoutData.customerName,
      customerPhone: checkoutData.customerPhone,
      shippingAddress: checkoutData.shippingAddress,
      billingAddress: checkoutData.billingAddress,
      items: cartItems,
      currency: checkoutData.currency,
      notes: checkoutData.notes
    });

    if (!orderResult.success) {
      throw new Error(orderResult.error);
    }

    // Clear cart after successful order
    if (typeof window.zakekeCart !== 'undefined') {
      window.zakekeCart = [];
    }

    return {
      success: true,
      orderId: orderResult.order.id,
      orderNumber: orderResult.order.orderNumber,
      message: 'Order created successfully'
    };
  } catch (error) {
    console.error('Error processing checkout:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get cart items from Zakeke API
 * @returns {Promise<Array>} Cart items
 */
async function getCartItems() {
  try {
    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/cart/items`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart items: ${response.statusText}`);
    }

    const cartData = await response.json();
    return cartData.items || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createOrder,
    getOrderStatus,
    processCheckout,
    getCartItems
  };
}

// Make available globally for Webflow
if (typeof window !== 'undefined') {
  window.ZakekeOrderAPI = {
    createOrder,
    getOrderStatus,
    processCheckout,
    getCartItems
  };
}

