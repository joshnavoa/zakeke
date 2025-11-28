// Script to fetch column names from Supabase products_v2 table
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getSchema() {
  try {
    console.log('🔍 Fetching schema from products_v2 table...\n');
    
    // Fetch one product to see the structure
    const { data, error } = await supabase
      .from('products_v2')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No products found in table. Trying to get column info from information schema...\n');
      
      // Try to get column info from information schema
      const { data: columns, error: colError } = await supabase.rpc('get_table_columns', {
        table_name: 'products_v2'
      }).catch(() => ({ data: null, error: { message: 'RPC function not available' } }));

      if (colError) {
        console.log('💡 To get column names, please:');
        console.log('   1. Go to Supabase Dashboard → Table Editor → products_v2');
        console.log('   2. Look at the column names');
        console.log('   3. Or add at least one product to the table');
        return;
      }
    }

    if (data && data.length > 0) {
      const sampleProduct = data[0];
      console.log('✅ Found product! Column structure:\n');
      console.log('Column Names:');
      console.log('=============');
      
      const columns = Object.keys(sampleProduct);
      columns.forEach((col, index) => {
        const value = sampleProduct[col];
        const type = typeof value;
        const sample = value !== null && value !== undefined 
          ? (String(value).substring(0, 50) + (String(value).length > 50 ? '...' : ''))
          : 'null';
        console.log(`${index + 1}. ${col.padEnd(25)} | Type: ${type.padEnd(10)} | Sample: ${sample}`);
      });

      console.log('\n📋 Full Sample Product:');
      console.log('====================');
      console.log(JSON.stringify(sampleProduct, null, 2));

      console.log('\n💡 Recommended Field Mappings:');
      console.log('=============================');
      
      // Suggest mappings
      const suggestions = {
        id: columns.find(c => c.toLowerCase().includes('id') && !c.toLowerCase().includes('product')),
        name: columns.find(c => ['name', 'title', 'product_name'].includes(c.toLowerCase())),
        description: columns.find(c => ['description', 'desc', 'details'].includes(c.toLowerCase())),
        price: columns.find(c => ['price', 'amount', 'cost'].includes(c.toLowerCase()) && !c.toLowerCase().includes('cents')),
        image: columns.find(c => ['image', 'photo', 'thumbnail', 'main_image', 'image_url'].some(term => c.toLowerCase().includes(term))),
        sku: columns.find(c => ['sku', 'code', 'product_sku'].includes(c.toLowerCase())),
        stock: columns.find(c => ['stock', 'inventory', 'quantity', 'qty'].includes(c.toLowerCase())),
        created_at: columns.find(c => ['created_at', 'created', 'date_created'].includes(c.toLowerCase()))
      };

      Object.entries(suggestions).forEach(([field, column]) => {
        if (column) {
          console.log(`   ${field.padEnd(15)} → ${column}`);
        } else {
          console.log(`   ${field.padEnd(15)} → ❌ NOT FOUND`);
        }
      });
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error(err.stack);
  }
}

getSchema();

