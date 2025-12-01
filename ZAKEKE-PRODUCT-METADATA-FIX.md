# Fixed: Product Metadata Field

## The Error

Still getting:
```
TypeError: Cannot read properties of undefined (reading 'metadata')
at MerchantProductOptionsQuery
```

## The Problem

The error is happening when Zakeke queries product options. Even though we added metadata to options, **products themselves also need a `metadata` field**.

Looking at the PHP example:
```php
[
    "code" => "1343243",
    "name" => "Watch",
    "thumbnail" => "https://...",
    "metadata" => [
        "additional_info" => "info"
    ]
]
```

Products can have optional `metadata`, but Zakeke's frontend expects it to exist (even if empty) to prevent undefined errors.

## The Fix

Added `metadata: {}` to all products in `transformSupabaseProduct()`:

```javascript
return {
  code: String(id),
  name: name,
  thumbnail: image,
  // ... other fields ...
  metadata: supabaseProduct.metadata || {}  // ✅ Added
};
```

## What Changed

**Before:**
```json
{
  "code": "123",
  "name": "Product",
  "thumbnail": "https://...",
  "price": 99.99
}
```

**After:**
```json
{
  "code": "123",
  "name": "Product",
  "thumbnail": "https://...",
  "price": 99.99,
  "metadata": {}  // ✅ Added
}
```

## After Railway Redeploys

Try publishing the product again. The metadata error should be fixed because:
1. ✅ Products now have `metadata: {}`
2. ✅ Options have `metadata: {}`
3. ✅ All fields Zakeke expects are present

