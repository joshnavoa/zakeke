# Testing Guide

This guide will help you test the Zakeke integration locally.

## Quick Start Testing

### 1. Test the Product Catalog API Server

The API server should be running. Test it with:

```bash
# Health check (no auth needed)
curl http://localhost:3000/health

# Get products (requires auth)
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." http://localhost:3000/products
```

Or use the test script:
```bash
./test-api.sh
```

### 2. Test the Frontend Integration

Open a new terminal and start the test server:

```bash
npm test
```

Then open in browser:
```
http://localhost:8000/test-local.html
```

## Testing Checklist

### Product Catalog API Tests

- [ ] **Health Check** - `GET /health` returns `{"status":"ok"}`
- [ ] **Get Products** - `GET /products` returns product list
- [ ] **Search Products** - `GET /products/search?q=test` works
- [ ] **Get Product Options** - `GET /products/{id}/options` returns variants
- [ ] **Mark Customizable** - `POST /products/{id}/customizable` works
- [ ] **Unmark Customizable** - `DELETE /products/{id}/customizable` works

### Frontend Integration Tests

- [ ] Configuration loads correctly
- [ ] Can fetch product info from Zakeke API
- [ ] Customizer opens (may need CORS whitelist)
- [ ] Can add items to cart
- [ ] Can create test orders

## Manual API Testing

### Using curl

```bash
# Set variables
CLIENT_ID="320250"
SECRET_KEY="-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI."
BASE_URL="http://localhost:3000"

# Health check
curl $BASE_URL/health

# Get products
curl -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products?page=1&limit=10"

# Search products
curl -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products/search?q=product"

# Get product options (replace PRODUCT_ID)
curl -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products/PRODUCT_ID/options"

# Mark as customizable
curl -u "$CLIENT_ID:$SECRET_KEY" -X POST "$BASE_URL/products/PRODUCT_ID/customizable"

# Unmark as customizable
curl -u "$CLIENT_ID:$SECRET_KEY" -X DELETE "$BASE_URL/products/PRODUCT_ID/customizable"
```

### Using Postman/Insomnia

1. **Set Base URL**: `http://localhost:3000`
2. **Set Authentication**: 
   - Type: Basic Auth
   - Username: `320250`
   - Password: `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.`
3. **Test Endpoints**:
   - `GET /health` (no auth needed)
   - `GET /products?page=1&limit=10`
   - `GET /products/search?q=test`
   - `GET /products/{productId}/options`
   - `POST /products/{productId}/customizable`
   - `DELETE /products/{productId}/customizable`

## Common Issues

### "Cannot GET /health"
- Server not running - start with `npm run api`
- Wrong port - check PORT in .env file

### "Unauthorized" or "401"
- Check credentials in .env file
- Verify Basic Auth username/password match your Zakeke credentials

### "No products found" or empty array
- Check Zakeke API endpoint format
- Verify Zakeke API returns products
- Check server logs for API errors

### CORS errors in browser
- This is normal for localhost testing
- Zakeke may need to whitelist your domain
- Test API endpoints directly with curl/Postman first

### "ECONNREFUSED" or connection errors
- Make sure API server is running
- Check firewall settings
- Verify port 3000 is available

## Next Steps After Testing

Once local testing works:

1. **Deploy API to production** (Heroku, Vercel, etc.)
2. **Configure in Zakeke back office**:
   - Go to Sales Channels
   - Enter your deployed API URL
   - Test connection
3. **Publish products in Zakeke**
4. **Test on your Webflow site**

## Debugging Tips

### Check Server Logs

The API server logs all requests. Watch for:
- Authentication failures
- API errors from Zakeke
- Missing product data

### Test Zakeke API Directly

Test if Zakeke API works directly:

```bash
curl -H "Authorization: Bearer -XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://api.zakeke.com/api/v2/products
```

### Check Environment Variables

```bash
# Verify .env file
cat .env

# Check if variables are loaded
node -e "require('dotenv').config(); console.log(process.env.ZAKEKE_TENANT_ID)"
```

## Need Help?

- Check server logs for detailed error messages
- Test endpoints individually
- Verify Zakeke API credentials
- Review Zakeke API documentation

