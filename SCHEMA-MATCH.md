# Match Your Supabase Schema

To ensure the code works with your exact schema, I need to know your column names in the `products_v2` table.

## Current Field Mappings

The code currently expects these fields (with fallbacks):

```javascript
{
  id: supabaseProduct.id,
  name: supabaseProduct.name || supabaseProduct.title,
  description: supabaseProduct.description || supabaseProduct.desc,
  price: supabaseProduct.price || supabaseProduct.price_amount,
  currency: supabaseProduct.currency,
  image: supabaseProduct.image || supabaseProduct.image_url || supabaseProduct.main_image,
  sku: supabaseProduct.sku || supabaseProduct.product_sku,
  stock: supabaseProduct.stock || supabaseProduct.inventory || supabaseProduct.quantity,
  created_at: supabaseProduct.created_at  // ✅ Fixed - now using created_at
}
```

## What I Need From You

Please share your actual column names from `products_v2` table. For example:

- Product ID column: `id` or `product_id` or `uuid`?
- Product name column: `name` or `title` or `product_name`?
- Price column: `price` or `price_cents` or `amount`?
- Image column: `image` or `image_url` or `photo` or `thumbnail`?
- Description column: `description` or `desc` or `details`?
- SKU column: `sku` or `product_sku` or `code`?
- Stock column: `stock` or `inventory` or `quantity` or `qty`?
- Created date: `created_at` or `created` or `date_created`?

## Quick Way to Check

1. Go to Supabase Dashboard → Table Editor → products_v2
2. Look at the column names
3. Share them with me, or I can create a test script to auto-detect them

## Or Share a Sample Row

If you can share one sample product row (with sensitive data removed), I can match the fields exactly.

