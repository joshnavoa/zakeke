# Update Railway Environment Variables

## ✅ Code Files Updated

I've updated:
- `zakeke-product-catalog-api.js` (default values)
- `zakeke-config.js` (frontend config)
- `env.template` (template file)

## ⚠️ IMPORTANT: Update Railway Environment Variables

Railway uses environment variables, not the code defaults. You need to update them:

### Option 1: Railway Web Interface
1. Go to Railway dashboard
2. Select your project
3. Go to **Variables** tab
4. Update these variables:
   - `ZAKEKE_TENANT_ID` = `323181`
   - `ZAKEKE_API_KEY` = `FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo.`
5. Save changes (Railway will automatically redeploy)

### Option 2: Railway CLI
```bash
railway variables set ZAKEKE_TENANT_ID=323181
railway variables set ZAKEKE_API_KEY=FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo.
```

## After Updating

1. Railway will automatically redeploy
2. Test the API with new credentials:
   ```bash
   curl -u "323181:FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo." \
     https://zakeke-production.up.railway.app/products?page=1&limit=1
   ```
3. Update Zakeke dashboard with new credentials:
   - Client ID: `323181`
   - Secret Key: `FR_4LpxtFD6JmGMnv8mDMAUIOfZWeLA0S9GW9slLlOo.`

## Verify

After Railway redeploys, check logs to confirm:
- `✅ Tenant ID: 323181` (should show new ID)
- `✅ API Key: SET` (should confirm key is set)

