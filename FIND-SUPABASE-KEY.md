# How to Find Your Supabase anon Key

## Where to Find It

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** (gear icon in left sidebar)
4. Click **API** in the settings menu
5. Look for **Project API keys** section

## What You're Looking For

You'll see several keys:

### ✅ **anon public** (This is what you need!)
- Usually starts with `eyJ` (it's a JWT token)
- Very long string (hundreds of characters)
- Labeled as "anon" or "public"
- Safe to use in client-side code

### ❌ **service_role** (Don't use this for client)
- Also starts with `eyJ`
- Very long string
- Has admin permissions - keep secret!

### ❓ **Publishable Key** (Different format)
- May start with `sb_publishable_` or similar
- This is NOT the anon key
- Used for different purposes

## Example Format

The anon key looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJwcm9qZWN0aWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzYwMCwiZXhwIjoxOTU0NTQzNjAwfQ.very-long-signature-here
```

## Quick Check

If your key:
- ✅ Starts with `eyJ` → This is likely the anon key
- ❌ Starts with `sb_` → This is a publishable key, not the anon key
- ❌ Is short (< 50 chars) → Probably not the right key

## For Railway

Use the **anon public** key (the JWT token starting with `eyJ`).

The key you showed (`sb_publishable_...`) is a different type of key and won't work with the Supabase JS client we're using.

