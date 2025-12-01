# Revert to Old Zakeke Credentials

## Old Credentials
- **Tenant ID**: `320250`
- **API Key**: `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.`

## What I've Updated

✅ **Code files updated:**
- `env.template` - Updated to old credentials
- `zakeke-config.js` - Updated to old credentials

## What You Need to Do

### 1. Update Railway Environment Variables

**Option A: Railway Web Interface**
1. Go to Railway → Your Project → **Variables**
2. Update:
   - `ZAKEKE_TENANT_ID` = `320250`
   - `ZAKEKE_API_KEY` = `-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.`
3. **Save** (Railway will automatically redeploy)

**Option B: Railway CLI**
```bash
railway variables set ZAKEKE_TENANT_ID=320250
railway variables set ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
```

### 2. Update Local .env File (if using locally)

Edit your `.env` file:
```env
ZAKEKE_TENANT_ID=320250
ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
```

### 3. Verify in Railway Logs

After Railway redeploys, check logs for:
```
✅ Tenant ID: 320250
✅ API Key: SET
```

### 4. Test the API

```bash
curl -u "320250:-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI." \
  https://zakeke-production.up.railway.app/products?page=1&limit=1
```

Should return products successfully.

## Note

The code already pulls from environment variables (no hardcoded values), so once you update Railway variables, it will use the old credentials automatically.

