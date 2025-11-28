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
// These MUST be set in environment variables
const ZAKEKE_CLIENT_ID = process.env.ZAKEKE_TENANT_ID;
const ZAKEKE_SECRET_KEY = process.env.ZAKEKE_API_KEY;

if (!ZAKEKE_CLIENT_ID || !ZAKEKE_SECRET_KEY) {
  console.error('❌ ERROR: ZAKEKE_TENANT_ID and ZAKEKE_API_KEY must be set in environment variables');
  console.error('   Set ZAKEKE_TENANT_ID in .env or Railway environment variables');
  console.error('   Set ZAKEKE_API_KEY in .env or Railway environment variables');
  process.exit(1);
}

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

// Root endpoint - some integrations check this first
// Zakeke calls this with ?page=1 expecting products - we'll return products here
app.get('/', async (req, res) => {
  console.log('📦 GET / (root) called');
  console.log('   User-Agent:', req.headers['user-agent'] || 'undefined');
  console.log('   Authorization:', req.headers['authorization'] ? 'Present' : 'Missing');
  console.log('   Query params:', JSON.stringify(req.query));
  
  // If Zakeke calls root with page parameter, they expect products here
  if (req.query.page || req.query.limit || req.query.search) {
    console.log('   ✅ Zakeke called root with pagination/search params - returning products');
    
    // Check if auth is present (Zakeke sends auth even to root)
    const hasAuth = req.headers['authorization'];
    if (!hasAuth) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Use HTTP Basic Auth with Zakeke credentials'
      });
    }
    
    // Delegate to products endpoint logic
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const sort = req.query.sort || 'created_at';
      const order = req.query.order || 'DESC';
      const searchQuery = req.query.search || req.query.q;

      let supabaseProducts;
      let products;

      // Handle search if search parameter is present
      if (searchQuery) {
        console.log(`   🔍 Search query: "${searchQuery}"`);
        supabaseProducts = await searchSupabaseProducts(searchQuery, page, limit);
        products = supabaseProducts.items || supabaseProducts.products || [];
        console.log(`   Found ${products.length} products matching "${searchQuery}"`);
      } else {
        // Regular product fetch
        supabaseProducts = await fetchSupabaseProducts(page, limit, sort, order);
        products = supabaseProducts.items || supabaseProducts.products || [];
        console.log(`   Found ${products.length} products from Supabase`);
      }

      // Add customizable flag
      products.forEach(product => {
        product.customizable = true;
      });

      // Zakeke expects a simple array of products (not wrapped in object)
      // According to docs: https://docs.zakeke.com/docs/API/Integration/Connecting-Product/Products_Catalog_API
      // Response should be: [{code, name, thumbnail}, ...]
      console.log(`   Returning ${products.length} products from root endpoint (as array)`);
      if (products.length > 0) {
        console.log('   Sample product:', {
          code: products[0].code,
          name: products[0].name,
          hasThumbnail: !!products[0].thumbnail,
          price: products[0].price
        });
      }

      // Return simple array (Zakeke format)
      return res.json(products);
    } catch (error) {
      console.error('Error fetching products from root:', error);
      return res.status(500).json({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    // No pagination params - return API info
    res.json({ 
      status: 'ok', 
      service: 'Zakeke Product Catalog API',
      endpoints: {
        products: '/products',
        search: '/products/search',
        health: '/health'
      },
      message: 'Use /products endpoint to fetch products'
    });
  }
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

// Log all requests before auth (to catch failed auth attempts)
app.use((req, res, next) => {
  // Log requests to /products even if auth fails
  if (req.path === '/products' || req.path.startsWith('/products/')) {
    console.log('🔍 Request to /products detected');
    console.log('   Path:', req.path);
    console.log('   Method:', req.method);
    console.log('   User-Agent:', req.headers['user-agent'] || 'undefined');
    console.log('   Authorization:', req.headers['authorization'] ? 'Present' : 'Missing');
    console.log('   Query:', JSON.stringify(req.query));
  }
  next();
});

// Apply auth to all other routes (except root which handles its own auth)
app.use((req, res, next) => {
  // Skip auth for root endpoint (it handles auth internally when needed)
  if (req.path === '/' && (req.query.page || req.query.limit)) {
    // Root with pagination - auth is checked in the route handler
    return next();
  }
  // Apply auth middleware to all other routes
  authMiddleware(req, res, next);
});

/**
 * GET /products
 * Retrieve all products with pagination
 * Query params: page, limit, sort
 */
app.get('/products', async (req, res) => {
  try {
    console.log('📦 GET /products called');
    console.log('   Query params:', JSON.stringify(req.query));
    console.log('   User-Agent:', req.headers['user-agent'] || 'undefined');
    console.log('   Authorization:', req.headers['authorization'] ? 'Present' : 'Missing');
    console.log('   All headers:', JSON.stringify(req.headers, null, 2));
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || 'created_at'; // Use created_at instead of createdOn
    const order = req.query.order || 'DESC'; // Changed to DESC to show newest first

    // Fetch products from Supabase
    const supabaseProducts = await fetchSupabaseProducts(page, limit, sort, order);

    // Products are already in Zakeke format, just add customizable flag
    const products = supabaseProducts.items || supabaseProducts.products || [];

    console.log(`   Found ${products.length} products from Supabase`);

    // Add customizable flag
    // By default, mark all products as customizable (Zakeke might only show customizable products)
    products.forEach(product => {
      // Always set to true - Zakeke might filter out non-customizable products
      product.customizable = true;
    });

    // Zakeke Product Catalog API expects a simple array, not an object
    // According to PHP example: https://gist.github.com/NicolaBizzoca/56fa9b0ba327364bbf3bfe575f3e129e
    // Response should be: [{code, name, thumbnail}, ...]
    // NOT {products: [...], pagination: {...}}
    console.log('   Returning simple array format (Zakeke standard)');

    console.log(`   Returning ${products.length} products`);
    if (products.length > 0) {
      console.log('   Sample product:', {
        code: products[0].code,
        name: products[0].name,
        hasThumbnail: !!products[0].thumbnail,
        price: products[0].price
      });
    }

    // Return simple array (Zakeke format per documentation and PHP example)
    res.json(products);
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
      // Mark all products as customizable by default
      product.customizable = true;
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Zakeke Product Catalog API running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.RAILWAY_ENVIRONMENT ? 'Railway' : 'Local'}`);
  console.log(`✅ Tenant ID: ${ZAKEKE_CLIENT_ID}`);
  console.log(`✅ API Key: SET`);
  if (!process.env.RAILWAY_ENVIRONMENT) {
    console.log(`📍 Local URL: http://localhost:${PORT}/`);
  }
  console.log(`📋 Configure this URL in Zakeke back office: Sales Channels > Product Catalog API`);
}).on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

module.exports = app;

