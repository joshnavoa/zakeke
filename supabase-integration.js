// Supabase Integration for Zakeke Product Catalog API
// Fetches products from Supabase and transforms them to Zakeke format

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️  Supabase credentials not configured. Products will be empty.');
}

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * Fetch products from Supabase
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} sort - Sort field
 * @param {string} order - Sort order (ASC/DESC)
 * @returns {Promise<Object>} Products with pagination
 */
async function fetchSupabaseProducts(page = 1, limit = 20, sort = 'created_at', order = 'DESC') {
  if (!supabase) {
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

  try {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products_v2') // Using products_v2 table
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'ASC' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    // Transform Supabase products to Zakeke format
    const products = (data || []).map(transformSupabaseProduct);

    return {
      items: products,
      products: products,
      pagination: {
        total: count || 0,
        page: page,
        limit: limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
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

/**
 * Search products in Supabase
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Filtered products
 */
async function searchSupabaseProducts(query, page = 1, limit = 20) {
  if (!supabase) {
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

  try {
    const offset = (page - 1) * limit;

    // Search in name, description, or SKU
    // Adjust column names based on your Supabase schema
    let searchQuery = supabase
      .from('products_v2')
      .select('*', { count: 'exact' })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await searchQuery;

    if (error) {
      console.error('Supabase search error:', error);
      throw error;
    }

    const products = (data || []).map(transformSupabaseProduct);

    return {
      items: products,
      products: products,
      pagination: {
        total: count || 0,
        page: page,
        limit: limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  } catch (error) {
    console.error('Error searching products in Supabase:', error);
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

/**
 * Fetch single product from Supabase
 * @param {string} productId - Product ID
 * @returns {Promise<Object|null>} Product or null
 */
async function fetchSupabaseProduct(productId) {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('products_v2')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return transformSupabaseProduct(data);
  } catch (error) {
    console.error('Error fetching product from Supabase:', error);
    return null;
  }
}

/**
 * Get product variants/options from Supabase
 * @param {string} productId - Product ID
 * @returns {Promise<Array>} Array of variants
 */
async function fetchSupabaseProductVariants(productId) {
  if (!supabase) {
    return [];
  }

  try {
    // Adjust table name based on your schema (could be 'variants', 'product_variants', etc.)
    const { data, error } = await supabase
      .from('product_variants') // or 'variants'
      .select('*')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching variants:', error);
      return [];
    }

    return (data || []).map(variant => ({
      id: variant.id,
      name: variant.name || variant.title || 'Default',
      price: parseFloat(variant.price || 0),
      sku: variant.sku || '',
      stock: variant.stock || variant.inventory || null,
      // Add other variant fields as needed
    }));
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return [];
  }
}

/**
 * Transform Supabase product to Zakeke format
 * Adjust field mappings based on your Supabase schema
 */
function transformSupabaseProduct(supabaseProduct) {
  return {
    id: String(supabaseProduct.id), // Zakeke expects string IDs
    name: supabaseProduct.name || supabaseProduct.title || 'Unnamed Product',
    description: supabaseProduct.description || supabaseProduct.desc || '',
    price: parseFloat(supabaseProduct.price || supabaseProduct.price_amount || 0),
    currency: supabaseProduct.currency || 'USD',
    image: supabaseProduct.image || supabaseProduct.image_url || supabaseProduct.main_image || '',
    sku: supabaseProduct.sku || supabaseProduct.product_sku || '',
    stock: supabaseProduct.stock || supabaseProduct.inventory || supabaseProduct.quantity || null,
    // Add other fields as needed
    // category: supabaseProduct.category,
    // tags: supabaseProduct.tags,
  };
}

module.exports = {
  fetchSupabaseProducts,
  searchSupabaseProducts,
  fetchSupabaseProduct,
  fetchSupabaseProductVariants,
  supabase // Export client for custom queries
};

