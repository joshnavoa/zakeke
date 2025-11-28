# How to Get Your Zakeke API Credentials

Follow these steps to obtain your Zakeke API credentials:

## Step-by-Step Instructions

1. **Log in to Zakeke Back-Office**
   - Go to your Zakeke account dashboard
   - Log in with your credentials

2. **Navigate to API Keys Section**
   - Click on **"Your account"** (located at the top right corner)
   - Select **"API Keys"** from the dropdown menu

3. **Retrieve Your Credentials**
   - On the API Keys page, you'll find:
     - **Client ID** (this is your Tenant ID)
     - **Secret Key** (this is your API Key)

## Mapping to Configuration

In `zakeke-config.js`, map the credentials as follows:

```javascript
const ZAKEKE_CONFIG = {
  tenantId: 'YOUR_CLIENT_ID',        // Use the "Client ID" from Zakeke
  apiKey: 'YOUR_SECRET_KEY',         // Use the "Secret Key" from Zakeke
  apiUrl: 'https://api.zakeke.com',
  customizerUrl: 'https://customizer.zakeke.com'
};
```

## Important Notes

- **Keep your credentials secure** - Never commit API keys to public repositories
- **Secret Key** is sensitive - Treat it like a password
- If you don't see the API Keys option, you may need to:
  - Upgrade your Zakeke plan (API access may require a specific plan)
  - Contact Zakeke support to enable API access

## Alternative: Custom Domain

If you're using a custom domain for Zakeke:
- Update `apiUrl` to your custom API domain
- Update `customizerUrl` to your custom customizer domain

## Need Help?

- Zakeke Documentation: https://zakeke.zendesk.com
- Zakeke Support: Contact through your Zakeke dashboard

