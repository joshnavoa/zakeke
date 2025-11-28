# Where to Set Up Zakeke Credentials

## For Webflow (Client-Side JavaScript)

**You set credentials directly in `zakeke-config.js`** - Webflow doesn't support `.env` files for client-side code.

### Option 1: Direct Configuration (Current Setup)

Edit `zakeke-config.js` and replace the placeholder values:

```javascript
const ZAKEKE_CONFIG = {
  tenantId: 'your-actual-client-id-here',
  apiKey: 'your-actual-secret-key-here',
  apiUrl: 'https://api.zakeke.com',
  customizerUrl: 'https://customizer.zakeke.com'
};
```

**⚠️ Security Note:** Since this runs in the browser, your API key will be visible in the source code. This is acceptable for client-side integrations, but if you need to keep it completely secret, use Option 2.

### Option 2: Server-Side Proxy (More Secure)

If you want to keep your API key secret, you can:
1. Create a server-side API endpoint (Node.js, PHP, etc.)
2. Store credentials in `.env` on the server
3. Have your JavaScript call your server endpoint
4. Server makes the actual Zakeke API calls

See `zakeke-server-proxy-example.js` for an example.

## For Self-Hosted Projects (Node.js/Server-Side)

If you're hosting the files yourself and using a build process, you can use environment variables.

### Step 1: Create `.env` file

Create a `.env` file in your project root:

```env
ZAKEKE_TENANT_ID=your-client-id-here
ZAKEKE_API_KEY=your-secret-key-here
ZAKEKE_API_URL=https://api.zakeke.com
ZAKEKE_CUSTOMIZER_URL=https://customizer.zakeke.com
```

### Step 2: Add `.env` to `.gitignore`

```gitignore
.env
node_modules/
```

### Step 3: Use Environment Variables

If using a bundler like Webpack or Vite, you can access them via `process.env`:

```javascript
const ZAKEKE_CONFIG = {
  tenantId: process.env.ZAKEKE_TENANT_ID,
  apiKey: process.env.ZAKEKE_API_KEY,
  apiUrl: process.env.ZAKEKE_API_URL || 'https://api.zakeke.com',
  customizerUrl: process.env.ZAKEKE_CUSTOMIZER_URL || 'https://customizer.zakeke.com'
};
```

## Recommendation for Webflow

**Use Option 1 (Direct Configuration)** - It's the simplest and works well for Webflow. The API key being visible in client-side code is normal for this type of integration.

## Quick Setup Steps

1. Open `zakeke-config.js`
2. Find lines 10-15
3. Replace `'YOUR_CLIENT_ID'` with your actual Client ID
4. Replace `'YOUR_SECRET_KEY'` with your actual Secret Key
5. Save the file
6. Upload to your hosting/CDN
7. Add to Webflow Custom Code section

That's it! No `.env` file needed for Webflow.

