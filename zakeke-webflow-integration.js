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

// Open Zakeke customizer using iframe (Zakeke's standard approach)
async function openCustomizerIframe(productId, variantId) {
  console.log('Zakeke: Opening customizer iframe for product:', productId);
  
  // Create modal/iframe container
  const modal = createCustomizerModal();
  document.body.appendChild(modal);

  // Try to get customizer URL from Zakeke Cart API first
  // If that fails, fall back to configured URL
  let customizerUrl = null;
  
  try {
    // Option 1: Try to get customizer URL from Cart API
    const cartApiUrl = `${ZAKEKE_CONFIG.apiUrl}/api/v2/cart/customizer-url`;
    const response = await fetch(cartApiUrl, {
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
    
    if (response.ok) {
      const data = await response.json();
      if (data.customizerUrl) {
        customizerUrl = data.customizerUrl;
        console.log('Zakeke: Got customizer URL from Cart API:', customizerUrl);
      }
    }
  } catch (error) {
    console.warn('Zakeke: Could not get customizer URL from Cart API:', error);
  }
  
  // Option 2: Use configured store customizer URL
  if (!customizerUrl && ZAKEKE_CONFIG.storeCustomizerUrl) {
    customizerUrl = ZAKEKE_CONFIG.storeCustomizerUrl;
    console.log('Zakeke: Using configured store customizer URL:', customizerUrl);
  }
  
  // Option 3: Build URL from store origin (fallback)
  if (!customizerUrl) {
    const storeOrigin = window.location.origin;
    customizerUrl = `${storeOrigin}/customizer.html`;
    console.log('Zakeke: Using fallback customizer URL:', customizerUrl);
  }
  
  // Build URL with parameters (lowercase as per Cart API docs)
  const iframeUrl = new URL(customizerUrl);
  iframeUrl.searchParams.set('productid', productId);
  iframeUrl.searchParams.set('quantity', '1');
  if (variantId) {
    iframeUrl.searchParams.set('variantid', variantId);
  }
  
  console.log('Zakeke: Final customizer iframe URL:', iframeUrl.toString());

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl.toString();
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.setAttribute('allow', 'camera; microphone; fullscreen');
  iframe.setAttribute('allowfullscreen', 'true');
  
  const container = modal.querySelector('.zakeke-customizer-container');
  container.appendChild(iframe);
  
  // Handle iframe load errors
  iframe.onerror = () => {
    console.error('Zakeke: Failed to load customizer iframe');
    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <p><strong>Failed to load Zakeke customizer</strong></p>
        <p>URL: ${iframeUrl.toString()}</p>
        <p>Please check:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Your Zakeke configuration in the dashboard</li>
          <li>That the customizer URL is correctly configured</li>
          <li>That the product is published in Zakeke</li>
        </ul>
      </div>
    `;
  };
  
  console.log('Zakeke: Customizer iframe created and loaded');
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

