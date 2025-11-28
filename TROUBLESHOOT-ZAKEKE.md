# Troubleshooting: Products Not Showing in Zakeke

## Quick Checks

### 1. Verify API is Accessible
Test the API directly:
```bash
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://zakeke-production.up.railway.app/products?page=1&limit=5
```

Should return JSON with products array.

### 2. Check Zakeke Settings
- URL should be: `https://zakeke-production.up.railway.app/` (with trailing slash)
- Make sure you clicked "Save" after updating
- Check if there's a "Test Connection" button and use it

### 3. Check Railway Logs
Go to Railway → Deployments → View logs
- Look for requests from Zakeke
- Check for any errors when Zakeke calls your API
- Look for authentication failures

### 4. Verify Authentication
Zakeke should authenticate with:
- Username: `320250` (your Client ID)
- Password: `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.` (your Secret Key)

### 5. Check Response Format
Zakeke might expect specific fields. Current response includes:
- `id` ✅
- `name` ✅
- `description` ✅
- `price` ✅
- `currency` ✅
- `image` ✅
- `sku` ✅
- `stock` ✅

### 6. Common Issues

**Issue: Image URL has newlines**
- Fixed: Code now trims image URLs

**Issue: Missing required fields**
- Zakeke might need `code` instead of `id`
- Or `thumbnail` instead of `image`

**Issue: Authentication failing**
- Check Railway logs for 401 errors
- Verify credentials in Zakeke settings match your API

**Issue: CORS errors**
- Shouldn't be an issue for server-to-server API calls
- But check Railway logs

### 7. Test Endpoints Zakeke Will Call

```bash
# Get products
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://zakeke-production.up.railway.app/products

# Search products
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  "https://zakeke-production.up.railway.app/products/search?q=test"

# Get product options
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://zakeke-production.up.railway.app/products/c347e4ab-aa88-4c79-8497-3b71ade0888c/options
```

### 8. Check Zakeke Error Messages
- In Zakeke dashboard, look for error messages
- Check if there's a "Sync" or "Refresh" button
- Look for any warnings or notifications

### 9. Contact Zakeke Support
If still not working:
- Share your API URL
- Share a sample API response
- Ask about required response format
- Check if there are any specific field requirements

## Next Steps

1. Check Railway logs for Zakeke requests
2. Verify authentication is working
3. Test all endpoints manually
4. Check Zakeke dashboard for error messages
5. Try refreshing/syncing products in Zakeke

