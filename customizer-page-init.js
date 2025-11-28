// Zakeke Customizer Page Initialization
// Add this to your /customizer page in Webflow (Page Settings > Custom Code > Footer Code)

(function() {
  'use strict';
  
  // Configuration - should match your zakeke-config.js
  const ZAKEKE_CONFIG = {
    tenantId: '320250',
    apiKey: '-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.',
    apiUrl: 'https://api.zakeke.com',
    customizerUrl: 'https://customizer.zakeke.com'
  };
  
  // Get product parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productid');
  const variantId = urlParams.get('variantid');
  const quantity = parseInt(urlParams.get('quantity') || '1', 10);
  
  console.log('Zakeke Customizer: Product ID received:', productId);
  console.log('Zakeke Customizer: Variant ID:', variantId || 'none');
  console.log('Zakeke Customizer: Quantity:', quantity);
  
  if (!productId) {
    console.error('Zakeke Customizer: Product ID not found in URL parameters');
    document.body.innerHTML = '<div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;"><h2>Product ID Required</h2><p>Please provide a product ID in the URL: ?productid=YOUR_PRODUCT_ID</p></div>';
    return;
  }
  
  // Initialize Zakeke customizer directly
  function initZakekeCustomizer() {
    console.log('Zakeke Customizer: Initializing customizer...');
    
    // Create container for customizer
    const container = document.createElement('div');
    container.id = 'zakeke-customizer-container';
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.minHeight = '600px';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '9999';
    container.style.backgroundColor = '#fff';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.appendChild(container);
    
    // Try to get customizer URL from Configurator API first
    const configuratorApiUrl = `${ZAKEKE_CONFIG.apiUrl}/api/v2/configurator/url`;
    
    fetch(configuratorApiUrl, {
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
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Zakeke Customizer: Configurator API response:', data);
      
      let customizerUrl = null;
      
      if (data.url && !data.url.includes('wordpress') && !data.url.includes('translate.zakeke.com')) {
        customizerUrl = data.url;
        console.log('Zakeke Customizer: Using URL from Configurator API:', customizerUrl);
      } else {
        // Fallback: Use Zakeke's portal customizer
        // Based on Zakeke documentation, the format should be:
        // https://portal.zakeke.com/customizer?tenant=XXX&productid=XXX
        customizerUrl = `https://portal.zakeke.com/customizer?tenant=${ZAKEKE_CONFIG.tenantId}&productid=${productId}&quantity=${quantity}`;
        if (variantId) {
          customizerUrl += `&variantid=${variantId}`;
        }
        console.log('Zakeke Customizer: Using fallback portal URL:', customizerUrl);
      }
      
      // Create iframe with customizer
      const iframe = document.createElement('iframe');
      iframe.id = 'zakeke-customizer-iframe';
      iframe.src = customizerUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.setAttribute('allow', 'camera; microphone; fullscreen');
      iframe.setAttribute('allowfullscreen', 'true');
      container.appendChild(iframe);
      
      console.log('Zakeke Customizer: Iframe created and loading:', customizerUrl);
      
      // Handle iframe load
      iframe.onload = () => {
        console.log('Zakeke Customizer: Iframe loaded successfully');
      };
      
      iframe.onerror = () => {
        console.error('Zakeke Customizer: Failed to load iframe');
        container.innerHTML = `
          <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
            <h2>Failed to Load Customizer</h2>
            <p>URL: ${customizerUrl}</p>
            <p>Please check:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Your Zakeke configuration</li>
              <li>That the product is published in Zakeke</li>
              <li>That the Product Catalog API is configured</li>
            </ul>
          </div>
        `;
      };
    })
    .catch(error => {
      console.error('Zakeke Customizer: Error getting customizer URL:', error);
      
      // Fallback: Use portal customizer directly
      const customizerUrl = `https://portal.zakeke.com/customizer?tenant=${ZAKEKE_CONFIG.tenantId}&productid=${productId}&quantity=${quantity}` + (variantId ? `&variantid=${variantId}` : '');
      
      const iframe = document.createElement('iframe');
      iframe.id = 'zakeke-customizer-iframe';
      iframe.src = customizerUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.setAttribute('allow', 'camera; microphone; fullscreen');
      iframe.setAttribute('allowfullscreen', 'true');
      container.appendChild(iframe);
      
      console.log('Zakeke Customizer: Using direct portal URL after error:', customizerUrl);
    });
    
    // Listen for messages from parent window (if loaded in iframe)
    window.addEventListener('message', function(event) {
      if (event.data && typeof event.data === 'object') {
        console.log('Zakeke Customizer: Message received from parent:', event.data);
        
        if (event.data.type === 'init') {
          console.log('Zakeke Customizer: Initialization message received:', event.data);
          // Customizer is already initialized, just log it
        }
      }
    });
    
    // Send message to parent when ready (if loaded in iframe)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'customizer-ready',
        productId: productId,
        variantId: variantId
      }, '*');
      console.log('Zakeke Customizer: Sent ready message to parent');
    }
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZakekeCustomizer);
  } else {
    initZakekeCustomizer();
  }
})();

