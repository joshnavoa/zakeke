# Supabase Integration Setup

This guide will help you configure the Product Catalog API to fetch products from your Supabase database.

## Step 1: Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (for client-side) OR **service_role key** (for server-side)

## Step 2: Set Environment Variables in Railway

1. Go to Railway → Your project → **Variables** tab
2. Add these environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**OR** if you want to use service role key (more permissions):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## Step 3: Adjust Table/Column Names

The integration assumes these table/column names. **Adjust them in `supabase-integration.js`** to match your schema:

### Products Table
- Table name: `products` (line 38)
- Columns expected:
  - `id` - Product ID
  - `name` or `title` - Product name
  - `description` or `desc` - Product description
  - `price` or `price_amount` - Product price
  - `currency` - Currency (defaults to USD)
  - `image` or `image_url` or `main_image` - Product image
  - `sku` or `product_sku` - SKU
  - `stock` or `inventory` or `quantity` - Stock quantity
  - `created_at` - For sorting

### Variants Table (if you have variants)
- Table name: `product_variants` or `variants` (line 134)
- Columns expected:
  - `id` - Variant ID
  - `product_id` - Foreign key to products
  - `name` or `title` - Variant name
  - `price` - Variant price
  - `sku` - Variant SKU
  - `stock` or `inventory` - Stock quantity

## Step 4: Customize Field Mappings

Edit `supabase-integration.js` and adjust the `transformSupabaseProduct` function (around line 180) to match your exact column names:

```javascript
function transformSupabaseProduct(supabaseProduct) {
  return {
    id: String(supabaseProduct.id),
    name: supabaseProduct.name || supabaseProduct.title, // Adjust here
    description: supabaseProduct.description || supabaseProduct.desc, // Adjust here
    price: parseFloat(supabaseProduct.price || supabaseProduct.price_amount), // Adjust here
    // ... etc
  };
}
```

## Step 5: Test the Integration

After setting environment variables and adjusting field mappings:

1. **Redeploy on Railway** (or wait for auto-deploy)
2. **Test the API**:
   ```bash
   curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
     https://zakeke-production.up.railway.app/products
   ```
3. **Verify products are returned** (should see your Supabase products)

## Common Schema Variations

### If your table is named differently:
```javascript
// In supabase-integration.js, change:
.from('products')  // Change to your table name
```

### If you don't have variants:
The code will return an empty array for variants, which is fine. Zakeke will work with products that have no variants.

### If your price is stored differently:
```javascript
// Adjust in transformSupabaseProduct:
price: parseFloat(supabaseProduct.price || supabaseProduct.price_amount || supabaseProduct.price_cents / 100),
```

### If you use different currency per product:
The code already handles this - just make sure your `currency` column exists in Supabase.

## Troubleshooting

### "No products returned"
- Check Supabase credentials are correct
- Verify table name matches your schema
- Check column names match your schema
- Review Railway logs for errors

### "Supabase error: relation does not exist"
- Table name is wrong - check your Supabase schema
- Update table name in `supabase-integration.js`

### "Column does not exist"
- Column name doesn't match - update field mappings
- Check your Supabase table structure

### Products show but fields are wrong
- Adjust `transformSupabaseProduct` function
- Map your Supabase columns to Zakeke format

## Example Supabase Schema

If you're creating a new products table, here's a suggested schema:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  sku TEXT,
  stock INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- If you have variants:
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  name TEXT,
  price DECIMAL(10,2),
  sku TEXT,
  stock INTEGER
);
```

## Next Steps

Once products are loading from Supabase:
1. ✅ Test API returns products
2. ✅ Configure URL in Zakeke back office
3. ✅ Publish products in Zakeke
4. ✅ Test on your Webflow site

