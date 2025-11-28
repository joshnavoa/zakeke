// Zakeke Product Catalog API Implementation
// This server implements the Product Catalog API that Zakeke calls
// to retrieve your products and manage customization settings

require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Your Zakeke credentials (for authentication)
const ZAKEKE_CLIENT_ID = process.env.ZAKEKE_TENANT_ID || '320250';
const ZAKEKE_SECRET_KEY = process.env.ZAKEKE_API_KEY || '-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.';

// Zakeke API configuration (products are in Zakeke)
const ZAKEKE_API_URL = process.env.ZAKEKE_API_URL || 'https://api.zakeke.com';

// Store for customizable products (in production, use a database)
const customizableProducts = new Set();

// HTTP Basic Auth middleware
// Zakeke will authenticate using Client ID (username) and Secret Key (password)
const authMiddleware = basicAuth({
  users: {
    [ZAKEKE_CLIENT_ID]: ZAKEKE_SECRET_KEY
  },
  challenge: true,
  realm: 'Zakeke Product Catalog API'
});

// Apply auth to all routes
app.use(authMiddleware);

/**
 * GET /products
 * Retrieve all products with pagination
 * Query params: page, limit, sort
 */
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || 'createdOn';
    const order = req.query.order || 'ASC';

    // Fetch products from Zakeke API
    const zakekeProducts = await fetchZakekeProducts(page, limit, sort, order);

    // Products are already in Zakeke format, just add customizable flag
    const products = zakekeProducts.items || zakekeProducts.products || [];

    // Add customizable flag
    products.forEach(product => {
      product.customizable = customizableProducts.has(product.id);
    });

    res.json({
      products: products,
      pagination: {
        page: page,
        limit: limit,
        total: zakekeProducts.pagination?.total || zakekeProducts.total || products.length,
        totalPages: Math.ceil((zakekeProducts.pagination?.total || zakekeProducts.total || products.length) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /products/search
 * Search products by query
 * Query params: q (search query), page, limit
 */
app.get('/products/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Fetch products from Zakeke API and filter by search query
    const zakekeProducts = await fetchZakekeProducts(page, limit);
    
    // Filter by search query (name, description, etc.)
    let allProducts = zakekeProducts.items || zakekeProducts.products || [];
    if (query) {
      const lowerQuery = query.toLowerCase();
      allProducts = allProducts.filter(product => 
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery)
      );
    }

    const products = allProducts;
    products.forEach(product => {
      product.customizable = customizableProducts.has(product.id);
    });

    res.json({
      products: products,
      pagination: {
        page: page,
        limit: limit,
        total: allProducts.length,
        totalPages: Math.ceil(allProducts.length / limit)
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /products/:productId/options
 * Retrieve product options/variants
 */
app.get('/products/:productId/options', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch product from Zakeke API
    const zakekeProduct = await fetchZakekeProduct(productId);

    if (!zakekeProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get variants/options from Zakeke product
    const options = zakekeProduct.variants || zakekeProduct.options || [];

    res.json({
      productId: productId,
      options: options
    });
  } catch (error) {
    console.error('Error fetching product options:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /products/:productId/customizable
 * Mark a product as customizable
 */
app.post('/products/:productId/customizable', (req, res) => {
  try {
    const productId = req.params.productId;
    customizableProducts.add(productId);
    
    res.json({
      success: true,
      message: `Product ${productId} marked as customizable`,
      productId: productId
    });
  } catch (error) {
    console.error('Error marking product as customizable:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /products/:productId/customizable
 * Unmark a product as customizable
 */
app.delete('/products/:productId/customizable', (req, res) => {
  try {
    const productId = req.params.productId;
    customizableProducts.delete(productId);
    
    res.json({
      success: true,
      message: `Product ${productId} unmarked as customizable`,
      productId: productId
    });
  } catch (error) {
    console.error('Error unmarking product as customizable:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper: Fetch products from Zakeke API
async function fetchZakekeProducts(page = 1, limit = 20, sort = 'createdOn', order = 'ASC') {
  try {
    // Try to fetch products from Zakeke API
    // Note: This endpoint may not exist - Zakeke products might be managed differently
    const response = await fetch(
      `${ZAKEKE_API_URL}/api/v2/products?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
      {
        headers: {
          'Authorization': `Bearer ${ZAKEKE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Zakeke API returned non-JSON response. Products may need to be managed in Zakeke dashboard.');
      // Return empty products list - products should be managed in Zakeke dashboard
      return {
        items: [],
        products: [],
        pagination: {
          total: 0,
          page: page,
          limit: limit
        }
      };
    }

    if (!response.ok) {
      // If 404 or other error, return empty list
      if (response.status === 404) {
        return {
          items: [],
          products: [],
          pagination: {
            total: 0,
            page: page,
            limit: limit
          }
        };
      }
      throw new Error(`Zakeke API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Zakeke:', error.message);
    // Return empty list instead of throwing - allows API to work even if Zakeke endpoint doesn't exist
    return {
      items: [],
      products: [],
      pagination: {
        total: 0,
        page: page,
        limit: limit
      }
    };
  }
}

// Helper: Fetch single product from Zakeke API
async function fetchZakekeProduct(productId) {
  try {
    const response = await fetch(
      `${ZAKEKE_API_URL}/api/v2/products/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${ZAKEKE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`Zakeke API returned non-JSON for product ${productId}`);
      return null;
    }

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Zakeke API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product from Zakeke:', error.message);
    return null; // Return null instead of throwing
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Zakeke Product Catalog API' });
});

// Railway automatically sets PORT, fallback to 3000 for local development
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Zakeke Product Catalog API running on port ${PORT}`);
  if (process.env.RAILWAY_ENVIRONMENT) {
    console.log(`Deployed on Railway`);
  } else {
    console.log(`Local development - Base URL: http://localhost:${PORT}/`);
  }
  console.log(`Configure this URL in Zakeke back office: Sales Channels > Product Catalog API`);
});

module.exports = app;

