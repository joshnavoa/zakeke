// Zakeke Configuration - Server-Side Version
// Use this if you want to keep API keys on the server
// This requires a server-side proxy to make API calls

// For client-side use - credentials will be fetched from server
const ZAKEKE_CONFIG = {
  // These will be set by fetching from your server endpoint
  tenantId: null,
  apiKey: null,
  apiUrl: 'https://api.zakeke.com',
  customizerUrl: 'https://customizer.zakeke.com',
  // Your server endpoint that returns credentials
  credentialsEndpoint: '/api/zakeke/credentials'
};

// Fetch credentials from your server (keeps API key secret)
async function loadZakekeCredentials() {
  try {
    const response = await fetch(ZAKEKE_CONFIG.credentialsEndpoint);
    if (!response.ok) {
      throw new Error('Failed to load credentials');
    }
    const credentials = await response.json();
    ZAKEKE_CONFIG.tenantId = credentials.tenantId;
    ZAKEKE_CONFIG.apiKey = credentials.apiKey;
    return true;
  } catch (error) {
    console.error('Error loading Zakeke credentials:', error);
    return false;
  }
}

// Initialize after credentials are loaded
async function initZakekeWithServerCredentials() {
  const loaded = await loadZakekeCredentials();
  if (!loaded) {
    console.error('Failed to initialize Zakeke - credentials not loaded');
    return null;
  }
  // Now you can use ZAKEKE_CONFIG with the loaded credentials
  return ZAKEKE_CONFIG;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ZAKEKE_CONFIG,
    loadZakekeCredentials,
    initZakekeWithServerCredentials
  };
}

