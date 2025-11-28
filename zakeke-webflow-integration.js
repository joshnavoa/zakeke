// Zakeke Webflow Integration
// Main integration file for Webflow projects

// Ensure ZAKEKE_CONFIG is available (loaded from zakeke-config.js)
if (typeof ZAKEKE_CONFIG === 'undefined') {
  console.error('ZAKEKE_CONFIG not found. Make sure zakeke-config.js is loaded first.');
}

// Load Zakeke Customizer script
function loadZakekeScript() {
  return new Promise((resolve, reject) => {
    if (window.ZakekeCustomizer) {
      console.log('Zakeke: Customizer already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    const scriptUrl = `${ZAKEKE_CONFIG.customizerUrl}/customizer.js`;
    console.log('Zakeke: Attempting to load script from:', scriptUrl);
    
    script.src = scriptUrl;
    script.onload = () => {
      console.log('Zakeke: Script loaded successfully');
      resolve();
    };
    script.onerror = (error) => {
      console.error('Zakeke: Failed to load customizer script from:', scriptUrl);
      console.error('Zakeke: Error details:', error);
      reject(new Error(`Failed to load Zakeke customizer script from ${scriptUrl}. Check if the URL is correct and accessible.`));
    };
    document.head.appendChild(script);
  });
}

// Initialize Zakeke on product page
async function initZakekeOnProductPage() {
  try {
    // Get product data from Webflow first (before loading script)
    const productId = getProductIdFromPage();
    const variantId = getVariantIdFromPage();

    if (!productId) {
      console.warn('Product ID not found on page. Make sure you have data-zakeke-product-id attribute.');
      return;
    }

    console.log('Zakeke: Product ID found:', productId);
    
    // Wait for Zakeke script to load
    console.log('Zakeke: Loading customizer script from:', ZAKEKE_CONFIG.customizerUrl);
    await loadZakekeScript();
    console.log('Zakeke: Customizer script loaded successfully');

    // Initialize customizer
    const customizer = initZakekeCustomizer(productId, variantId);

    // Add customizer button/trigger
    setupCustomizerButton(customizer, productId, variantId);

    console.log('Zakeke: Initialization complete');
    return customizer;
  } catch (error) {
    console.error('Error initializing Zakeke:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      target: error.target
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
    }
  }

  // Add click handler
  customizerButton.addEventListener('click', () => {
    openCustomizer(customizer, productId, variantId);
  });
}

// Open Zakeke customizer
function openCustomizer(customizer, productId, variantId) {
  // Create modal/iframe container
  const modal = createCustomizerModal();
  document.body.appendChild(modal);

  // Initialize customizer in modal
  customizer.open({
    container: modal.querySelector('.zakeke-customizer-container'),
    productId: productId,
    variantId: variantId
  });
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
    openCustomizer: openCustomizer
  };
}

