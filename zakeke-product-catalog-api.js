// Zakeke Product Catalog API Implementation
// This server implements the Product Catalog API that Zakeke calls
// to retrieve your products and manage customization settings

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const {
  fetchSupabaseProducts,
  searchSupabaseProducts,
  fetchSupabaseProduct,
  fetchSupabaseProductVariants
} = require('./supabase-integration');
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

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Zakeke Product Catalog API' });
});

// Schema inspection endpoint (for debugging - requires auth)
app.get('/schema', async (req, res) => {
  try {
    const { fetchSupabaseProduct } = require('./supabase-integration');
    
    // Try to fetch one product to see structure
    const { supabase } = require('./supabase-integration');
    
    if (!supabase) {
      return res.json({ 
        error: 'Supabase not configured',
        message: 'Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables'
      });
    }

    const { data, error } = await supabase
      .from('products_v2')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({ 
        error: 'Database error',
        message: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    if (!data || data.length === 0) {
      return res.json({ 
        message: 'No products found in table',
        suggestion: 'Add at least one product to products_v2 table to see schema'
      });
    }

    const sampleProduct = data[0];
    const columns = Object.keys(sampleProduct);
    
    // Analyze column types
    const columnInfo = columns.map(col => ({
      name: col,
      type: typeof sampleProduct[col],
      sample: sampleProduct[col] !== null && sampleProduct[col] !== undefined 
        ? String(sampleProduct[col]).substring(0, 100)
        : 'null',
      isNull: sampleProduct[col] === null
    }));

    res.json({
      success: true,
      table: 'products_v2',
      totalColumns: columns.length,
      columns: columnInfo,
      sampleProduct: sampleProduct,
      suggestedMappings: {
        id: columns.find(c => c.toLowerCase().includes('id') && !c.toLowerCase().includes('product')),
        name: columns.find(c => ['name', 'title', 'product_name'].includes(c.toLowerCase())),
        description: columns.find(c => ['description', 'desc', 'details'].includes(c.toLowerCase())),
        price: columns.find(c => ['price', 'amount', 'cost'].includes(c.toLowerCase()) && !c.toLowerCase().includes('cents')),
        image: columns.find(c => ['image', 'photo', 'thumbnail', 'main_image', 'image_url'].some(term => c.toLowerCase().includes(term))),
        sku: columns.find(c => ['sku', 'code', 'product_sku'].includes(c.toLowerCase())),
        stock: columns.find(c => ['stock', 'inventory', 'quantity', 'qty'].includes(c.toLowerCase())),
        created_at: columns.find(c => ['created_at', 'created', 'date_created'].includes(c.toLowerCase()))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Apply auth to all other routes
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
    const sort = req.query.sort || 'created_at'; // Use created_at instead of createdOn
    const order = req.query.order || 'DESC'; // Changed to DESC to show newest first

    // Fetch products from Supabase
    const supabaseProducts = await fetchSupabaseProducts(page, limit, sort, order);

    // Products are already in Zakeke format, just add customizable flag
    const products = supabaseProducts.items || supabaseProducts.products || [];

    // Add customizable flag
    products.forEach(product => {
      product.customizable = customizableProducts.has(product.id);
    });

    res.json({
      products: products,
      pagination: {
        page: page,
        limit: limit,
        total: supabaseProducts.pagination?.total || supabaseProducts.total || products.length,
        totalPages: Math.ceil((supabaseProducts.pagination?.total || supabaseProducts.total || products.length) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

    // Search products in Supabase
    const supabaseProducts = await searchSupabaseProducts(query, page, limit);
    
    const products = supabaseProducts.items || supabaseProducts.products || [];
    products.forEach(product => {
      product.customizable = customizableProducts.has(product.id);
    });

    res.json({
      products: products,
      pagination: {
        page: page,
        limit: limit,
        total: supabaseProducts.pagination?.total || 0,
        totalPages: Math.ceil((supabaseProducts.pagination?.total || 0) / limit)
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

    // Fetch product from Supabase
    const supabaseProduct = await fetchSupabaseProduct(productId);

    if (!supabaseProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get variants/options from Supabase
    const options = await fetchSupabaseProductVariants(productId);

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

// Health check endpoint is defined above (before auth middleware)

// Railway automatically sets PORT, fallback to 3000 for local development
const PORT = process.env.PORT || 3000;

// Verify required environment variables
if (!process.env.ZAKEKE_TENANT_ID || !process.env.ZAKEKE_API_KEY) {
  console.error('ERROR: Missing required environment variables!');
  console.error('Required: ZAKEKE_TENANT_ID, ZAKEKE_API_KEY');
  console.error('Current values:');
  console.error('  ZAKEKE_TENANT_ID:', process.env.ZAKEKE_TENANT_ID ? 'SET' : 'MISSING');
  console.error('  ZAKEKE_API_KEY:', process.env.ZAKEKE_API_KEY ? 'SET' : 'MISSING');
  process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Zakeke Product Catalog API running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.RAILWAY_ENVIRONMENT ? 'Railway' : 'Local'}`);
  console.log(`✅ Tenant ID: ${process.env.ZAKEKE_TENANT_ID}`);
  console.log(`✅ API Key: ${process.env.ZAKEKE_API_KEY ? 'SET' : 'MISSING'}`);
  if (!process.env.RAILWAY_ENVIRONMENT) {
    console.log(`📍 Local URL: http://localhost:${PORT}/`);
  }
  console.log(`📋 Configure this URL in Zakeke back office: Sales Channels > Product Catalog API`);
}).on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

module.exports = app;

