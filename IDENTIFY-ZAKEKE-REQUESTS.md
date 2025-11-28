# Identifying Zakeke Requests

## What the Logs Show

You're seeing requests with `User-Agent: undefined` - these might be from Zakeke!

Many APIs don't send User-Agent headers, so Zakeke might be calling but not identifying itself.

## How to Identify Zakeke Requests

Look for requests that have:
- `User-Agent: undefined` (no User-Agent header)
- `Authorization: Present` (HTTP Basic Auth)
- Different query parameters than your manual tests
- Requests to `/products` endpoint

## Check Full Log Entries

In Railway logs, for requests with `User-Agent: undefined`, check:
1. What endpoint was called? (`/products`, `/`, etc.)
2. What query parameters? (`page`, `limit`, etc.)
3. Was Authorization present?
4. What time did it happen? (correlate with when you saved in Zakeke)

## Next Steps

1. **Filter logs by endpoint:**
   - Search for "GET /products" in Railway logs
   - Look for entries with `User-Agent: undefined`
   - Check the full log entry (not just User-Agent line)

2. **Correlate with Zakeke actions:**
   - Note the time you saved settings in Zakeke
   - Look for requests around that time
   - Check if they have `User-Agent: undefined`

3. **Check the full request:**
   - Click on a log entry with `User-Agent: undefined`
   - See the full request details
   - Check what endpoint, query params, and headers

## Updated Logging

I've added more detailed logging that will show:
- All headers (to identify Zakeke by other means)
- Authorization status
- Full request details

After Railway redeploys, check the logs again when you save in Zakeke.

