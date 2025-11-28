// Quick test script to check Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', SUPABASE_URL ? 'SET' : 'MISSING');
console.log('Key:', SUPABASE_KEY ? 'SET (length: ' + SUPABASE_KEY.length + ')' : 'MISSING');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  try {
    console.log('\n1. Testing connection to products_v2 table...');
    const { data, error, count } = await supabase
      .from('products_v2')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.error('❌ Error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      return;
    }

    console.log('✅ Connection successful!');
    console.log('   Total products:', count || 0);
    console.log('   Sample products:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('\n2. Sample product structure:');
      console.log(JSON.stringify(data[0], null, 2));
      
      console.log('\n3. Checking required fields:');
      const sample = data[0];
      console.log('   id:', sample.id ? '✅' : '❌ MISSING');
      console.log('   name/title:', (sample.name || sample.title) ? '✅' : '❌ MISSING');
      console.log('   price:', sample.price ? '✅ (' + sample.price + ')' : '❌ MISSING');
      console.log('   image:', sample.image || sample.image_url || sample.main_image ? '✅' : '❌ MISSING');
    } else {
      console.log('⚠️  No products found in products_v2 table');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

test();

