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
  
  // Wait for Zakeke customizer script to load
  function initZakekeCustomizer() {
    // Check if Zakeke customizer script is loaded
    if (typeof window.Zakeke === 'undefined' && typeof window.ZakekeConfigurator === 'undefined') {
      console.log('Zakeke Customizer: Waiting for Zakeke script to load...');
      setTimeout(initZakekeCustomizer, 100);
      return;
    }
    
    console.log('Zakeke Customizer: Initializing customizer...');
    
    // Create container for customizer
    const container = document.createElement('div');
    container.id = 'zakeke-customizer-container';
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.minHeight = '600px';
    document.body.appendChild(container);
    
    // Try to initialize using Zakeke Configurator UI API
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
      
      if (data.url && !data.url.includes('wordpress')) {
        // Use the URL from the API
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.setAttribute('allow', 'camera; microphone; fullscreen');
        iframe.setAttribute('allowfullscreen', 'true');
        container.appendChild(iframe);
        console.log('Zakeke Customizer: Loaded customizer from API URL:', data.url);
      } else {
        // Fallback: Build customizer URL manually
        const customizerUrl = new URL(`${ZAKEKE_CONFIG.customizerUrl}/`);
        customizerUrl.searchParams.set('tenant', ZAKEKE_CONFIG.tenantId);
        customizerUrl.searchParams.set('productid', productId);
        customizerUrl.searchParams.set('quantity', quantity.toString());
        if (variantId) {
          customizerUrl.searchParams.set('variantid', variantId);
        }
        
        const iframe = document.createElement('iframe');
        iframe.src = customizerUrl.toString();
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.setAttribute('allow', 'camera; microphone; fullscreen');
        iframe.setAttribute('allowfullscreen', 'true');
        container.appendChild(iframe);
        console.log('Zakeke Customizer: Loaded customizer from fallback URL:', customizerUrl.toString());
      }
    })
    .catch(error => {
      console.error('Zakeke Customizer: Error getting customizer URL:', error);
      
      // Fallback: Build customizer URL manually
      const customizerUrl = new URL(`${ZAKEKE_CONFIG.customizerUrl}/`);
      customizerUrl.searchParams.set('tenant', ZAKEKE_CONFIG.tenantId);
      customizerUrl.searchParams.set('productid', productId);
      customizerUrl.searchParams.set('quantity', quantity.toString());
      if (variantId) {
        customizerUrl.searchParams.set('variantid', variantId);
      }
      
      const iframe = document.createElement('iframe');
      iframe.src = customizerUrl.toString();
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.setAttribute('allow', 'camera; microphone; fullscreen');
      iframe.setAttribute('allowfullscreen', 'true');
      container.appendChild(iframe);
      console.log('Zakeke Customizer: Using fallback URL:', customizerUrl.toString());
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

