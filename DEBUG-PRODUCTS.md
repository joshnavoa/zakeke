# Debugging: Products Not Showing in Zakeke

## Quick Checklist

### 1. Verify Supabase Credentials in Railway
- Go to Railway → Variables tab
- Check that both are set:
  - `SUPABASE_URL=https://your-project.supabase.co`
  - `SUPABASE_ANON_KEY=eyJ...` (full JWT token)

### 2. Check Railway Logs
1. Go to Railway → Your project → Deployments
2. Click latest deployment → View logs
3. Look for:
   - "Supabase error" messages
   - "Error fetching products from Supabase"
   - Any red error messages

### 3. Test API Directly
```bash
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://zakeke-production.up.railway.app/products
```

Should return JSON with products array. If empty, check logs.

### 4. Verify Table Structure

The code expects these columns in `products_v2`:
- `id` - Product ID (required)
- `name` OR `title` - Product name
- `description` OR `desc` - Product description
- `price` OR `price_amount` - Product price (number)
- `currency` - Currency code (defaults to USD)
- `image` OR `image_url` OR `main_image` - Product image URL
- `sku` OR `product_sku` - SKU
- `stock` OR `inventory` OR `quantity` - Stock quantity
- `created_at` - For sorting

### 5. Check Column Names Match

Edit `supabase-integration.js` → `transformSupabaseProduct` function (around line 220) to match your exact column names.

## Common Issues

### Issue: "relation does not exist"
- **Problem**: Table name is wrong
- **Fix**: Verify table is named `products_v2` in Supabase
- **Check**: Supabase Dashboard → Table Editor

### Issue: "column does not exist"
- **Problem**: Column names don't match
- **Fix**: Update `transformSupabaseProduct` function to use your column names
- **Example**: If your price column is `price_cents`, change:
  ```javascript
  price: parseFloat(supabaseProduct.price_cents / 100)
  ```

### Issue: Empty products array
- **Problem**: Query returns no rows
- **Check**: 
  - Do you have products in `products_v2` table?
  - Are there any RLS (Row Level Security) policies blocking access?
  - Check Supabase Dashboard → Table Editor → products_v2

### Issue: RLS (Row Level Security) blocking
- **Problem**: Supabase RLS policies prevent reading
- **Fix**: 
  1. Go to Supabase Dashboard → Authentication → Policies
  2. Check `products_v2` table policies
  3. Ensure `anon` role can SELECT from table
  4. Or use `service_role` key instead of `anon` key

## Test Supabase Connection Locally

1. Make sure `.env` has:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-key-here
   ```

2. Run test:
   ```bash
   node test-supabase-connection.js
   ```

3. This will show:
   - If connection works
   - How many products found
   - Sample product structure
   - Which fields are missing

## Next Steps

1. Check Railway logs for specific errors
2. Verify table name is `products_v2`
3. Verify column names match your schema
4. Check RLS policies if using anon key
5. Test locally with `test-supabase-connection.js`

## Share Debug Info

If still not working, share:
- Railway logs (error messages)
- Your `products_v2` table structure (column names)
- Result of `node test-supabase-connection.js`

