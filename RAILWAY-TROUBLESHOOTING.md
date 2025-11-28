# Railway 502 Error Troubleshooting

Your Railway deployment is returning 502 "Application failed to respond". Here's how to fix it.

## Common Causes

1. **Server not starting** - Application crashed on startup
2. **Missing environment variables** - Required vars not set
3. **Port configuration** - Wrong port binding
4. **Code errors** - Syntax or runtime errors

## Step 1: Check Railway Logs

1. Go to [railway.app](https://railway.app)
2. Click on your project → **zakeke-production**
3. Click on **Deployments** tab
4. Click on the latest deployment
5. **View logs** - Look for error messages

Common errors to look for:
- `Cannot find module` - Missing dependencies
- `Port already in use` - Port conflict
- `Environment variable not set` - Missing env vars
- Syntax errors in code

## Step 2: Verify Environment Variables

In Railway dashboard → **Variables** tab, make sure you have:

```
ZAKEKE_TENANT_ID=320250
ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
ZAKEKE_API_URL=https://api.zakeke.com
PORT=3000
```

**Important**: 
- Variable names must match exactly (case-sensitive)
- No spaces around the `=` sign
- Values should not have quotes unless needed

## Step 3: Check package.json

Make sure `package.json` has a `start` script:

```json
{
  "scripts": {
    "start": "node zakeke-product-catalog-api.js"
  }
}
```

## Step 4: Verify Dependencies

Railway should auto-install dependencies, but check:
- All dependencies are in `package.json`
- No missing modules in logs

## Step 5: Check Port Binding

The server should bind to `0.0.0.0` and use `process.env.PORT`:

```javascript
app.listen(PORT, '0.0.0.0', () => {
  // ...
});
```

## Step 6: Redeploy

After fixing issues:

1. **Option A: Trigger redeploy**
   - Railway → Deployments → Click "Redeploy"

2. **Option B: Push new commit**
   ```bash
   git commit --allow-empty -m "Trigger Railway redeploy"
   git push
   ```

## Quick Fixes

### Fix 1: Add Missing Dependencies

If logs show "Cannot find module", add to `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "express-basic-auth": "^1.2.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### Fix 2: Check Server Code

Make sure the server file exists and is correct:
- File: `zakeke-product-catalog-api.js`
- Has `app.listen()` at the end
- Uses `process.env.PORT`

### Fix 3: Add Error Handling

Add this at the start of your server file:

```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
```

## Check Logs Command

If you have Railway CLI:

```bash
railway logs
```

## Common Solutions

### Solution 1: Missing Environment Variables
- Add all required env vars in Railway dashboard
- Redeploy after adding

### Solution 2: Wrong Start Command
- Verify `package.json` has `"start"` script
- Railway uses `npm start` by default

### Solution 3: Port Issues
- Railway sets `PORT` automatically
- Don't hardcode port number
- Use `process.env.PORT || 3000`

### Solution 4: Code Errors
- Check logs for specific error messages
- Test locally first: `npm start`
- Fix errors and redeploy

## Test Locally First

Before deploying, test locally:

```bash
# Set environment variables
export ZAKEKE_TENANT_ID=320250
export ZAKEKE_API_KEY=-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.
export ZAKEKE_API_URL=https://api.zakeke.com
export PORT=3000

# Start server
npm start

# Test
curl http://localhost:3000/health
```

If it works locally but not on Railway, check:
- Environment variables are set in Railway
- Railway is using correct Node.js version
- All files are committed to git

## Still Not Working?

1. **Check Railway status**: [status.railway.app](https://status.railway.app)
2. **Review Railway docs**: [docs.railway.app](https://docs.railway.app)
3. **Check Railway Discord**: For community support
4. **Share logs**: Copy error messages from Railway logs

## Next Steps

Once the 502 is fixed:
1. Test health endpoint
2. Test authenticated endpoints
3. Configure in Zakeke
4. Publish products

