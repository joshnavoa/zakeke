# Fixed: Options Endpoint Returns Default Structure

## The Problem

When products have no variants, the options endpoint was returning an empty array `[]`. However, Zakeke's `MerchantProductOptionsQuery` GraphQL query expects at least one option structure, and when it tries to access `.metadata` on an empty response, it causes the error.

## The Fix

Updated the options endpoint to return a **default option structure** when there are no variants, instead of an empty array:

```javascript
// Before: []
// After: [{
//   code: 'default',
//   name: 'Default',
//   values: [{code: productId, name: productName, metadata: {}}],
//   metadata: {}
// }]
```

## Why This Works

Zakeke's GraphQL query (`MerchantProductOptionsQuery`) expects:
- At least one option group
- Each option to have `metadata: {}`
- Each value to have `metadata: {}`

By returning a default structure instead of an empty array, Zakeke can successfully query the options without hitting undefined errors.

## After Railway Redeploys

Try publishing the product again. The metadata error should be resolved because:
1. ✅ Products have `metadata: {}`
2. ✅ Options always return at least one option group
3. ✅ Each option has `metadata: {}`
4. ✅ Each value has `metadata: {}`

