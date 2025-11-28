# Zakeke Product Catalog API Setup Guide

This guide will help you set up the Product Catalog API so you can publish products in Zakeke.

## What is the Product Catalog API?

The Product Catalog API is a set of endpoints that **you must implement** on your server. Zakeke calls these endpoints to:
- Retrieve your product list
- Get product variants/options
- Mark products as customizable
- Search for products

## Prerequisites

1. **Zakeke API Credentials** - Already configured (Client ID and Secret Key)
2. **Server/Backend** - You need a server to host the API (can't run on Webflow directly)

## Step 1: Set Up Environment Variables

Since products are already in Zakeke, you only need Zakeke credentials. Create a `.env` file:

```env
# Zakeke Credentials (for authentication and fetching products)
ZAKEKE_TENANT_ID=320250
ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.

# Zakeke API URL (usually https://api.zakeke.com)
ZAKEKE_API_URL=https://api.zakeke.com

# Server Port
PORT=3000
```

**Note:** Products are fetched from Zakeke's API, not from Webflow. The Product Catalog API acts as a bridge that Zakeke calls to manage which products are customizable.

## Step 3: Install Dependencies

```bash
npm install express express-basic-auth cors dotenv
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "express-basic-auth": "^1.7.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

## Step 4: Deploy the API Server

You have several options:

### Option A: Deploy to Heroku (Free Tier Available)

1. Create a Heroku account
2. Install Heroku CLI
3. Create a new app:
   ```bash
   heroku create your-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set ZAKEKE_TENANT_ID=320250
   heroku config:set ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
   heroku config:set WEBFLOW_API_TOKEN=your-token
   heroku config:set WEBFLOW_SITE_ID=your-site-id
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

### Option B: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "zakeke-product-catalog-api.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "zakeke-product-catalog-api.js"
       }
     ]
   }
   ```
3. Deploy: `vercel`

### Option C: Deploy to Railway/Render/Fly.io

Similar process - set environment variables and deploy.

### Option D: Use Your Own Server

If you have a VPS or server:
1. Install Node.js
2. Clone your code
3. Install dependencies
4. Set environment variables
5. Run with PM2 or similar:
   ```bash
   pm2 start zakeke-product-catalog-api.js
   ```

## Step 5: Configure in Zakeke Back Office

1. Log into your Zakeke back office
2. Go to **Sales Channels** (or **Settings** > **Sales Channels**)
3. Find **Product Catalog API** section
4. Enter your API base URL:
   - Example: `https://your-app.herokuapp.com/`
   - **Important:** Include trailing slash `/`
5. Save the configuration

## Step 6: Test the API

### Test Locally

1. Start the server:
   ```bash
   node zakeke-product-catalog-api.js
   ```

2. Test with curl (replace credentials):
   ```bash
   curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
     http://localhost:3000/products
   ```

3. Or use Postman/Insomnia with Basic Auth:
   - Username: `320250` (your Client ID)
   - Password: `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.` (your Secret Key)

### Test Endpoints

- `GET /products` - List all products
- `GET /products/search?q=product-name` - Search products
- `GET /products/{productId}/options` - Get product variants
- `POST /products/{productId}/customizable` - Mark as customizable
- `DELETE /products/{productId}/customizable` - Unmark as customizable

## Step 7: Publish Products in Zakeke

Once the API is configured:

1. Go to Zakeke back office > **Products**
2. Click **Connect Products** or **Import Products**
3. Zakeke will call your API to fetch products
4. Select products to make customizable
5. Click **Publish**

## Troubleshooting

### "Product Catalog API not responding"

- Check your server is running
- Verify the base URL in Zakeke settings (must end with `/`)
- Check server logs for errors
- Test the API endpoints directly

### "Authentication failed"

- Verify your Client ID and Secret Key are correct
- Check that HTTP Basic Auth is working
- Test with curl or Postman

### "No products found"

- Check Webflow API token is valid
- Verify Site ID is correct
- Check Webflow API response format matches expected format
- Review `transformWebflowProduct` function

### Products not showing variants

- Check Webflow product structure
- Adjust `transformWebflowVariants` function
- Verify Webflow API returns variant data

## API Endpoint Specifications

### GET /products
Returns paginated list of products.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `sort` (optional, default: 'createdOn')
- `order` (optional, default: 'ASC')

**Response:**
```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Product Name",
      "description": "Product description",
      "price": 49.99,
      "currency": "USD",
      "image": "https://...",
      "sku": "SKU123",
      "customizable": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### GET /products/search
Search products by query.

**Query Parameters:**
- `q` (required) - Search query
- `page` (optional)
- `limit` (optional)

### GET /products/:productId/options
Get product variants/options.

**Response:**
```json
{
  "productId": "product-id",
  "options": [
    {
      "id": "variant-id",
      "name": "Variant Name",
      "price": 59.99,
      "sku": "SKU123-V1",
      "stock": 10
    }
  ]
}
```

### POST /products/:productId/customizable
Mark product as customizable.

### DELETE /products/:productId/customizable
Unmark product as customizable.

## Next Steps

After setting up the Product Catalog API:
1. Test all endpoints
2. Configure in Zakeke back office
3. Import/publish products
4. Test product customization on your site

## Support

If you encounter issues:
1. Check server logs
2. Test API endpoints directly
3. Verify Webflow API credentials
4. Review Zakeke documentation: https://docs.zakeke.com

