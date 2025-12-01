# Fixed: Zakeke Metadata Error When Publishing

## The Error

When trying to publish a product in Zakeke, you got:
```
TypeError: Cannot read properties of undefined (reading 'metadata')
at MerchantProductOptionsQuery
```

## The Problem

Zakeke's frontend expects product options to have a `metadata` field, but our API wasn't providing it. When Zakeke tries to publish a product, it fetches the product options and expects each option to have `metadata` (even if empty).

## The Fix

### 1. Updated Product Options Endpoint

Changed `/products/:productId/options` to:
- Return a **simple array** (not wrapped in object) - matches PHP example
- Always include `metadata: {}` on each option (even if empty)
- Ensure `code` and `values` fields are present
- Return empty array `[]` instead of `null` or error objects

### 2. Updated Variant Format

Added to variant transformation:
- `code` field (required by Zakeke)
- `values` array (required by Zakeke options format)
- `metadata: {}` (prevents undefined errors)

## Expected Format (from PHP example)

```json
[
  {
    "code": "34523",
    "name": "Color",
    "values": [
      {
        "code": "537564567",
        "name": "White"
      },
      {
        "code": "646456464",
        "name": "Black"
      }
    ],
    "metadata": {}
  }
]
```

## What Changed

**Before:**
```json
{
  "productId": "...",
  "options": [
    {
      "id": "...",
      "name": "...",
      "price": 0
    }
  ]
}
```

**After:**
```json
[
  {
    "code": "...",
    "name": "...",
    "values": [{"code": "...", "name": "..."}],
    "metadata": {}
  }
]
```

## After Railway Redeploys

Try publishing the product again - the metadata error should be fixed!

