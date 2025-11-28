// Zakeke Webflow Integration
// Main integration file for Webflow projects

// Ensure ZAKEKE_CONFIG is available (loaded from zakeke-config.js)
if (typeof ZAKEKE_CONFIG === 'undefined') {
  console.error('ZAKEKE_CONFIG not found. Make sure zakeke-config.js is loaded first.');
}

// Zakeke uses iframe-based customizer, not a JavaScript SDK
// No need to load external script - we'll use iframe directly
function loadZakekeScript() {
  // Zakeke customizer is iframe-based, so we don't need to load a script
  // Just resolve immediately
  return Promise.resolve();
}

// Initialize Zakeke on product page
async function initZakekeOnProductPage() {
  try {
    // Get product data from Webflow
    const productId = getProductIdFromPage();
    const variantId = getVariantIdFromPage();

    if (!productId) {
      console.warn('Zakeke: Product ID not found on page. Make sure you have data-zakeke-product-id attribute.');
      return;
    }

    console.log('Zakeke: Product ID found:', productId);
    console.log('Zakeke: Variant ID:', variantId || 'none');
    
    // Zakeke uses iframe-based customizer, no script to load
    await loadZakekeScript();

    // Add customizer button/trigger (iframe will be created when button is clicked)
    setupCustomizerButton(null, productId, variantId);

    console.log('Zakeke: Initialization complete - ready to open customizer');
    return { productId, variantId };
  } catch (error) {
    console.error('Error initializing Zakeke:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

// Get product ID from Webflow page
function getProductIdFromPage() {
  // Method 1: From data attribute
  const productElement = document.querySelector('[data-zakeke-product-id]');
  if (productElement) {
    return productElement.getAttribute('data-zakeke-product-id');
  }

  // Method 2: From URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('productId')) {
    return urlParams.get('productId');
  }

  // Method 3: From Webflow CMS data (adjust based on your setup)
  if (window.Webflow && window.Webflow.CMS) {
    const cmsData = window.Webflow.CMS.getData();
    if (cmsData && cmsData.productId) {
      return cmsData.productId;
    }
  }

  return null;
}

// Get variant ID from Webflow page
function getVariantIdFromPage() {
  const variantElement = document.querySelector('[data-zakeke-variant-id]');
  if (variantElement) {
    return variantElement.getAttribute('data-zakeke-variant-id');
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('variantId')) {
    return urlParams.get('variantId');
  }

  return null;
}

// Setup customizer button/trigger
function setupCustomizerButton(customizer, productId, variantId) {
  // Find or create customizer button
  let customizerButton = document.querySelector('[data-zakeke-customize]');
  
  if (!customizerButton) {
    // Create button if it doesn't exist
    customizerButton = document.createElement('button');
    customizerButton.textContent = 'Customize Product';
    customizerButton.className = 'zakeke-customize-button';
    customizerButton.setAttribute('data-zakeke-customize', 'true');
    
    // Insert button (adjust selector based on your product page layout)
    const addToCartButton = document.querySelector('[data-wf-add-to-cart]');
    if (addToCartButton && addToCartButton.parentElement) {
      addToCartButton.parentElement.insertBefore(customizerButton, addToCartButton);
    } else {
      // If no add to cart button, append to product container
      const productContainer = document.querySelector('[data-zakeke-product-id]');
      if (productContainer) {
        productContainer.appendChild(customizerButton);
      } else {
        // Last resort: append to body (shouldn't happen, but fallback)
        console.warn('Zakeke: Could not find product container, appending button to body');
        document.body.appendChild(customizerButton);
      }
    }
  }

  // Check if button already has our handler (avoid duplicates)
  if (!customizerButton.hasAttribute('data-zakeke-handler-attached')) {
    // Add click handler - use iframe-based customizer
    customizerButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Zakeke: Button clicked, opening customizer...');
      openCustomizerIframe(productId, variantId);
    });
    
    // Mark as having handler attached
    customizerButton.setAttribute('data-zakeke-handler-attached', 'true');
    console.log('Zakeke: Button setup complete', customizerButton);
  } else {
    console.log('Zakeke: Button already has handler attached');
  }
}

// Open Zakeke customizer using Configurator UI API
async function openCustomizerIframe(productId, variantId) {
  console.log('Zakeke: Opening customizer iframe for product:', productId);
  
  // Create modal/iframe container
  const modal = createCustomizerModal();
  document.body.appendChild(modal);
  
  const container = modal.querySelector('.zakeke-customizer-container');
  
  // Get product info (optional - use fallback if API fails)
  // Note: The productId might be from Supabase, not Zakeke, so API call may fail
  let productInfo = null;
  try {
    productInfo = await getProductInfo(productId, variantId);
    console.log('Zakeke: Product info loaded from API:', productInfo);
  } catch (error) {
    console.warn('Zakeke: Could not load product info from API (this is OK if using Product Catalog API):', error.message);
    // Use fallback product info - the customizer will get product data from Product Catalog API
    productInfo = {
      id: productId,
      name: 'Product',
      price: 0,
      currency: 'USD',
      image: null,
      variants: []
    };
    console.log('Zakeke: Using fallback product info');
  }
  
  // Get customizer URL from Zakeke API
  let customizerUrl = null;
  try {
    // Try to get customizer URL from Configurator API
    const configuratorApiUrl = `${ZAKEKE_CONFIG.apiUrl}/api/v2/configurator/url`;
    const configuratorResponse = await fetch(configuratorApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: productId,
        variantId: variantId,
        quantity: 1
      })
    });
    
    if (configuratorResponse.ok) {
      const configuratorData = await configuratorResponse.json();
      if (configuratorData.url) {
        customizerUrl = configuratorData.url;
        console.log('Zakeke: Got customizer URL from Configurator API:', customizerUrl);
      }
    }
  } catch (error) {
    console.warn('Zakeke: Could not get customizer URL from API:', error);
  }
  
  // Fallback: Build Zakeke customizer URL
  if (!customizerUrl) {
    // Use Zakeke's customizer domain - format may vary by account
    // Try different URL formats
    const possibleUrls = [
      `https://customizer.zakeke.com/?tenant=${ZAKEKE_CONFIG.tenantId}&productid=${productId}`,
      `https://${ZAKEKE_CONFIG.tenantId}.customizer.zakeke.com/?productid=${productId}`,
      `https://customizer.zakeke.com/configurator?tenant=${ZAKEKE_CONFIG.tenantId}&productid=${productId}`
    ];
    
    customizerUrl = possibleUrls[0]; // Start with first option
    console.log('Zakeke: Using fallback customizer URL:', customizerUrl);
  }
  
  // Create iframe for Zakeke customizer
  const iframe = document.createElement('iframe');
  iframe.id = 'zakeke-customizer-iframe';
  iframe.src = customizerUrl;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.setAttribute('allow', 'camera; microphone; fullscreen');
  iframe.setAttribute('allowfullscreen', 'true');
  
  container.appendChild(iframe);
  
  // Wait for iframe to load, then send initialization message
  iframe.onload = () => {
    console.log('Zakeke: Customizer iframe loaded, sending initialization message');
    
    // Send postMessage to initialize customizer (Configurator UI API)
    const initMessage = {
      type: 'init',
      productId: productId,
      variantId: variantId,
      quantity: 1,
      currency: productInfo?.currency || 'USD',
      language: 'en',
      tenantId: ZAKEKE_CONFIG.tenantId
    };
    
    iframe.contentWindow.postMessage(initMessage, '*');
    console.log('Zakeke: Initialization message sent:', initMessage);
  };
  
  // Listen for messages from the customizer iframe
  const messageHandler = async function handleZakekeMessage(event) {
    // Verify message is from Zakeke domain (in production, check event.origin)
    if (event.data && typeof event.data === 'object') {
      console.log('Zakeke: Message received from customizer:', event.data);
      
      // Handle different message types
      if (event.data.type === 'customization-complete') {
        console.log('Zakeke: Customization completed', event.data);
        // Handle customization completion
      } else if (event.data.type === 'add-to-cart' || event.data.action === 'add-to-cart') {
        console.log('Zakeke: Add to cart requested', event.data);
        
        // Prepare customization data
        const customizationData = {
          productId: event.data.productId || productId,
          variantId: event.data.variantId || variantId,
          quantity: event.data.quantity || 1,
          price: event.data.price || productInfo?.price || 0,
          previewImage: event.data.previewImage || event.data.image,
          customizationData: event.data.customizationData || event.data.data,
          customizationId: event.data.customizationId || event.data.id || Date.now().toString()
        };
        
        try {
          // Add to cart
          const result = await addToCart(customizationData);
          
          if (result.success) {
            console.log('Zakeke: Item added to cart successfully', result);
            
            // Show success message
            showCartNotification('Product added to cart!', 'success');
            
            // Send success message back to iframe
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                type: 'cart-added',
                success: true,
                cartItemId: result.cartItemId
              }, '*');
            }
          } else {
            throw new Error(result.error || 'Failed to add to cart');
          }
        } catch (error) {
          console.error('Zakeke: Error adding to cart:', error);
          showCartNotification('Failed to add to cart: ' + error.message, 'error');
          
          // Send error message back to iframe
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'cart-error',
              error: error.message
            }, '*');
          }
        }
      } else if (event.data.type === 'error' || event.data.type === 'customizer-error') {
        console.error('Zakeke: Customizer error:', event.data.error || event.data);
      } else if (event.data.type === 'close' || event.data.action === 'close') {
        // Close customizer modal
        console.log('Zakeke: Close customizer requested');
        modal.remove();
        window.removeEventListener('message', messageHandler);
      }
    }
  };
  
  window.addEventListener('message', messageHandler);
  
  // Store handler reference for cleanup
  modal._zakekeMessageHandler = messageHandler;
  
  // Handle iframe load errors
  iframe.onerror = () => {
    console.error('Zakeke: Failed to load customizer iframe');
    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <p><strong>Failed to load Zakeke customizer</strong></p>
        <p>URL: ${customizerUrl}</p>
        <p>Please check:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Your Zakeke configuration in the dashboard</li>
          <li>That the customizer URL is correctly configured</li>
          <li>That the product is published in Zakeke</li>
        </ul>
      </div>
    `;
  };
  
  console.log('Zakeke: Customizer iframe created, loading:', customizerUrl);
}

// Legacy function for compatibility
function openCustomizer(customizer, productId, variantId) {
  openCustomizerIframe(productId, variantId);
}

// Create customizer modal
function createCustomizerModal() {
  const modal = document.createElement('div');
  modal.className = 'zakeke-customizer-modal';
  modal.innerHTML = `
    <div class="zakeke-modal-overlay"></div>
    <div class="zakeke-modal-content">
      <button class="zakeke-modal-close" aria-label="Close">&times;</button>
      <div class="zakeke-customizer-container"></div>
    </div>
  `;

  // Close button handler
  const closeButton = modal.querySelector('.zakeke-modal-close');
  const overlay = modal.querySelector('.zakeke-modal-overlay');
  
  const closeModal = () => {
    // Remove message handler if it exists
    if (modal._zakekeMessageHandler) {
      window.removeEventListener('message', modal._zakekeMessageHandler);
    }
    modal.remove();
  };

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // ESC key handler
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });

  return modal;
}

// Show cart notification
function showCartNotification(message, type = 'success') {
  // Remove existing notification if any
  const existing = document.querySelector('.zakeke-cart-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `zakeke-cart-notification zakeke-cart-notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  if (!document.querySelector('#zakeke-notification-styles')) {
    style.id = 'zakeke-notification-styles';
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Show cart notification
function showCartNotification(message, type = 'success') {
  // Remove existing notification if any
  const existing = document.querySelector('.zakeke-cart-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `zakeke-cart-notification zakeke-cart-notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  if (!document.querySelector('#zakeke-notification-styles')) {
    style.id = 'zakeke-notification-styles';
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize checkout integration
function initCheckoutIntegration() {
  // Hook into Webflow checkout form submission
  const checkoutForm = document.querySelector('form[data-wf-checkout]');
  
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(checkoutForm);
      const checkoutData = {
        customerEmail: formData.get('email'),
        customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        customerPhone: formData.get('phone'),
        shippingAddress: {
          firstName: formData.get('shippingFirstName'),
          lastName: formData.get('shippingLastName'),
          address: formData.get('shippingAddress'),
          city: formData.get('shippingCity'),
          state: formData.get('shippingState'),
          zipCode: formData.get('shippingZip'),
          country: formData.get('shippingCountry')
        },
        items: window.zakekeCart || [],
        currency: 'USD'
      };

      // Process checkout
      const result = await window.ZakekeOrderAPI.processCheckout(checkoutData);

      if (result.success) {
        // Redirect to success page
        window.location.href = `/checkout-success?orderId=${result.orderId}`;
      } else {
        // Show error
        alert(`Checkout failed: ${result.error}`);
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initZakekeOnProductPage();
    initCheckoutIntegration();
  });
} else {
  initZakekeOnProductPage();
  initCheckoutIntegration();
}

// Export for global use
if (typeof window !== 'undefined') {
  window.ZakekeWebflow = {
    init: initZakekeOnProductPage,
    openCustomizer: openCustomizer,
    openCustomizerIframe: openCustomizerIframe
  };
}

