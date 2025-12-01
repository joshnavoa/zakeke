# Zakeke Using Wrong Credentials

## 🎯 Found the Issue!

Zakeke IS calling your API, but it's using the **OLD credentials** instead of the new ones!

### What the Logs Show

**Authorization header from Zakeke:**
```
Basic MzIwMjUwOi1YRVU4ODZ0cWNNYi1oSWpHOFAwV1RzZjRXc2dhb0VNbDFmQWNWTk91bUku
```

**Decoded:**
- Username: `320250` ❌ (OLD - should be `323181`)
- Password: `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.` ❌ (OLD)

**What API expects:**
- Username: `323181` ✅ (NEW)
- Password: `FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo.` ✅ (NEW)

### Also Noticed

Zakeke is calling `/` (root) with `?page=1` - it might expect products at root endpoint when pagination params are present.

## How to Fix

### Update Zakeke Dashboard

1. Go to **Zakeke Dashboard** → **Sales Channels** → **Product Catalog API** (or API Settings)
2. Update the credentials:
   - **Client ID**: `323181` (not `320250`)
   - **Secret Key**: `FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo.` (not the old one)
3. **Save** the settings
4. Zakeke should now call with correct credentials

### After Updating

Watch Railway logs - you should see:
- `📦 GET /products called` (not just `/`)
- Successful authentication
- Products being returned

## Why This Happened

Zakeke cached the old credentials. After updating in Zakeke dashboard, it should use the new ones.

## Test After Update

```bash
# Test with NEW credentials (should work)
curl -u "323181:FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo." \
  https://zakeke-production.up.railway.app/products?page=1&limit=1

# Test with OLD credentials (should fail)
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://zakeke-production.up.railway.app/products?page=1&limit=1
```

First should work, second should return 401 Unauthorized.

