#!/bin/bash

# Test script for Zakeke Product Catalog API
# Usage: ./test-api.sh

BASE_URL="http://localhost:3000"
CLIENT_ID="320250"
SECRET_KEY="-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI."

echo "🧪 Testing Zakeke Product Catalog API"
echo "======================================"
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq '.' || echo "❌ Health check failed"
echo ""
echo ""

# Test 2: Get Products (requires auth)
echo "2. Testing Get Products (with authentication)..."
curl -s -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products?page=1&limit=5" | jq '.' || echo "❌ Get products failed"
echo ""
echo ""

# Test 3: Search Products
echo "3. Testing Search Products..."
curl -s -u "$CLIENT_ID:$SECRET_KEY" "$BASE_URL/products/search?q=test&page=1&limit=5" | jq '.' || echo "❌ Search products failed"
echo ""
echo ""

# Test 4: Mark Product as Customizable (replace PRODUCT_ID with actual ID)
echo "4. Testing Mark Product as Customizable..."
echo "   (Replace PRODUCT_ID with an actual product ID from Zakeke)"
# curl -s -u "$CLIENT_ID:$SECRET_KEY" -X POST "$BASE_URL/products/PRODUCT_ID/customizable" | jq '.' || echo "❌ Mark customizable failed"
echo "   ⚠️  Skipped - needs actual product ID"
echo ""
echo ""

echo "✅ Testing complete!"
echo ""
echo "💡 Tips:"
echo "   - If you see authentication errors, check your credentials"
echo "   - If products are empty, check Zakeke API response format"
echo "   - Use 'jq' for better JSON formatting (install: brew install jq)"

