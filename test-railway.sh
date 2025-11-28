#!/bin/bash

# Test script for Railway deployment
# Usage: ./test-railway.sh YOUR_RAILWAY_URL

if [ -z "$1" ]; then
  echo "❌ Please provide your Railway URL"
  echo "Usage: ./test-railway.sh https://your-app.up.railway.app"
  exit 1
fi

BASE_URL="$1"
CLIENT_ID="320250"
SECRET_KEY="-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI."

echo "🧪 Testing Zakeke Product Catalog API on Railway"
echo "=================================================="
echo "URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/health")
HTTP_STATUS=$(echo "$HEALTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Health check passed"
  echo "Response: $BODY"
else
  echo "❌ Health check failed (HTTP $HTTP_STATUS)"
  echo "Response: $BODY"
fi
echo ""

# Test 2: Get Products (with auth)
echo "2. Testing Get Products (with authentication)..."
PRODUCTS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products?page=1&limit=5")
HTTP_STATUS=$(echo "$PRODUCTS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$PRODUCTS_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Get products passed"
  echo "Response: $BODY" | head -10
else
  echo "❌ Get products failed (HTTP $HTTP_STATUS)"
  echo "Response: $BODY"
fi
echo ""

# Test 3: Search Products
echo "3. Testing Search Products..."
SEARCH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products/search?q=test&page=1&limit=5")
HTTP_STATUS=$(echo "$SEARCH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$SEARCH_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Search products passed"
  echo "Response: $BODY" | head -10
else
  echo "❌ Search products failed (HTTP $HTTP_STATUS)"
  echo "Response: $BODY"
fi
echo ""

# Test 4: Test without auth (should fail)
echo "4. Testing without authentication (should fail)..."
NO_AUTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/products")
HTTP_STATUS=$(echo "$NO_AUTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ Authentication required (HTTP $HTTP_STATUS) - This is correct!"
else
  echo "⚠️  Unexpected status (HTTP $HTTP_STATUS) - Auth might not be working"
fi
echo ""

echo "=================================================="
echo "✅ Testing complete!"
echo ""
echo "💡 Next steps:"
echo "   1. If all tests passed, configure this URL in Zakeke"
echo "   2. Go to Zakeke back office → Sales Channels → Product Catalog API"
echo "   3. Enter: $BASE_URL/"
echo "   4. Save and test connection"

