// Example Server-Side Proxy for Zakeke API
// Use this to keep your API key secret on the server
// 
// This is a Node.js/Express example
// Adapt to your server framework (PHP, Python, etc.)

// Install dependencies:
// npm install express dotenv cors

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Your Zakeke credentials from .env file
const ZAKEKE_CONFIG = {
  tenantId: process.env.ZAKEKE_TENANT_ID,
  apiKey: process.env.ZAKEKE_API_KEY,
  apiUrl: process.env.ZAKEKE_API_URL || 'https://api.zakeke.com'
};

// Endpoint to return credentials (tenantId only - keep API key secret)
app.get('/api/zakeke/credentials', (req, res) => {
  // Only return tenantId - API key stays on server
  res.json({
    tenantId: ZAKEKE_CONFIG.tenantId,
    apiUrl: ZAKEKE_CONFIG.apiUrl
  });
});

// Proxy endpoint for Zakeke API calls
app.post('/api/zakeke/proxy', async (req, res) => {
  const { endpoint, method = 'GET', body } = req.body;
  
  try {
    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}${endpoint}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: Create order (keeps API key on server)
app.post('/api/zakeke/orders', async (req, res) => {
  try {
    const response = await fetch(`${ZAKEKE_CONFIG.apiUrl}/api/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZAKEKE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zakeke proxy server running on port ${PORT}`);
});

// .env file example:
// ZAKEKE_TENANT_ID=your-client-id
// ZAKEKE_API_KEY=your-secret-key
// ZAKEKE_API_URL=https://api.zakeke.com

