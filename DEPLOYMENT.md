# 🚀 Deployment Guide

Complete step-by-step guide to deploy your TikTok OAuth Worker to Cloudflare.

## Prerequisites

- [x] Cloudflare account (free tier works)
- [x] TikTok Developer account
- [x] Domain added to Cloudflare
- [x] TikTok app created with OAuth enabled

## Step 1: TikTok Developer Setup

### 1.1 Create TikTok App

1. Go to [TikTok Developer Portal](https://developers.tiktok.com)
2. Sign in and navigate to "Manage Apps"
3. Click "Create App"
4. Fill in app details:
   - **App Name**: Your app name
   - **Category**: Choose appropriate category
   - **Description**: Brief description

### 1.2 Configure OAuth

1. In your app settings, find "OAuth" section
2. Set **Redirect URI** to:

   ```
   https://bot.boringrats.dev/callback
   ```

   ⚠️ **Important**: Must match exactly (HTTPS, no trailing slash)

3. Enable required scopes:

   - `video.upload`
   - `user.info.basic` (optional)

4. Save your credentials:
   - **Client Key**: `awXXXXXXXXXXXXXXX`
   - **Client Secret**: `XXXXXXXXXXXXXXXX` (keep secret!)

### 1.3 Add Test Users (Sandbox Mode)

1. Go to "Test Users" section
2. Add your TikTok account username
3. Wait for confirmation

## Step 2: Cloudflare Setup

### Option A: Dashboard Deployment (Easiest)

#### 2.1 Create Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **"Create Application"**
4. Select **"Create Worker"**
5. Name it: `tiktok-oauth`
6. Click **"Deploy"**

#### 2.2 Upload Code

1. Click **"Edit Code"**
2. Delete the default code
3. Copy entire content from `worker.js`
4. Paste into editor
5. Click **"Save and Deploy"**

#### 2.3 Set Environment Variables

1. Go to **Settings** tab
2. Click **"Variables"**
3. Under "Environment Variables", click **"Add variable"**

4. Add first variable:

   - **Variable name**: `TIKTOK_CLIENT_KEY`
   - **Value**: Your TikTok Client Key
   - Click **"Add variable"**

5. Add second variable:

   - **Variable name**: `TIKTOK_CLIENT_SECRET`
   - **Value**: Your TikTok Client Secret
   - ✅ Check **"Encrypt"** (important!)
   - Click **"Add variable"**

6. Click **"Save and Deploy"**

#### 2.4 Add Custom Domain

1. Go to **Triggers** tab
2. Under "Custom Domains", click **"Add Custom Domain"**
3. Enter: `bot.boringrats.dev`
4. Click **"Add Custom Domain"**
5. Wait for DNS propagation (usually instant)

### Option B: Wrangler CLI Deployment

#### 2.1 Install Node.js & Wrangler

```bash
# Install Node.js (if not installed)
# Visit https://nodejs.org

# Install Wrangler CLI
npm install -g wrangler

# Verify installation
wrangler --version
```

#### 2.2 Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authorize Wrangler.

#### 2.3 Deploy Worker

```bash
# Navigate to project directory
cd /home/swadhin/tiktok/cloudflare-worker

# Deploy to Cloudflare
wrangler deploy
```

#### 2.4 Set Secrets

```bash
# Set Client Key
wrangler secret put TIKTOK_CLIENT_KEY
# Paste your client key when prompted

# Set Client Secret
wrangler secret put TIKTOK_CLIENT_SECRET
# Paste your client secret when prompted
```

#### 2.5 Configure Custom Domain

Add to `wrangler.toml`:

```toml
routes = [
  { pattern = "bot.boringrats.dev/*", zone_name = "boringrats.dev" }
]
```

Then deploy again:

```bash
wrangler deploy
```

## Step 3: Optional - KV Storage Setup

Enable persistent token storage:

### 3.1 Create KV Namespace

```bash
wrangler kv:namespace create "TIKTOK_TOKENS"
```

This will output something like:

```
 { binding = "TIKTOK_TOKENS", id = "abc123..." }
```

### 3.2 Update wrangler.toml

Add to your `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "TIKTOK_TOKENS"
id = "abc123..."  # Use the ID from previous step
```

### 3.3 Deploy

```bash
wrangler deploy
```

## Step 4: Testing

### 4.1 Visit Your Worker

Open browser and go to: `https://bot.boringrats.dev/`

You should see a beautiful landing page.

### 4.2 Test OAuth Flow

1. Click **"Authorize with TikTok"**
2. Log in with your TikTok account (must be in sandbox users)
3. Grant permissions
4. You'll be redirected back with your tokens

### 4.3 Verify Tokens

Your access token should:

- Be a long alphanumeric string
- Work for API requests
- Expire after the specified time

## Step 5: Use Tokens

### Example: Upload Video

```javascript
const accessToken = "your_access_token_here";

const response = await fetch(
  "https://open.tiktokapis.com/v2/post/publish/video/init/",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_info: {
        title: "My Video",
        privacy_level: "SELF_ONLY",
        disable_comment: false,
        disable_duet: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: 123456,
        chunk_size: 10000000,
        total_chunk_count: 1,
      },
    }),
  }
);

const data = await response.json();
console.log(data);
```

## Troubleshooting

### Issue: "redirect_uri mismatch"

**Solution:**

1. Check TikTok Developer Portal
2. Ensure redirect URI is exactly: `https://bot.boringrats.dev/callback`
3. No trailing slash, must be HTTPS

### Issue: "Missing environment variables"

**Solution:**

1. Go to Worker → Settings → Variables
2. Verify both `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET` exist
3. Client Secret should be encrypted

### Issue: Domain not working

**Solution:**

1. Check DNS in Cloudflare
2. Ensure domain is proxied (orange cloud)
3. Wait for DNS propagation (up to 24 hours)
4. Try accessing via `https://tiktok-oauth.your-subdomain.workers.dev` first

### Issue: Worker not updating

**Solution:**

```bash
# Purge cache
wrangler deploy --purge

# Or redeploy
wrangler deploy --force
```

## Security Checklist

- [x] Client Secret is encrypted in Cloudflare
- [x] Using HTTPS only
- [x] Tokens not committed to git
- [x] .gitignore includes token files
- [x] Environment variables set as secrets
- [x] Test users configured in TikTok sandbox

## Next Steps

1. ✅ Test with your TikTok account
2. ✅ Integrate tokens into your application
3. ✅ Set up token refresh workflow
4. ✅ Monitor usage in Cloudflare Analytics
5. ✅ Apply for TikTok app production approval (when ready)

## Support

- [TikTok Developer Docs](https://developers.tiktok.com/doc/overview/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GitHub Issues](https://github.com/your-username/tiktok-oauth-worker/issues)

---

**Congratulations! Your TikTok OAuth Worker is now live! 🎉**
