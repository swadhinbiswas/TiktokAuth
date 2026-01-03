# 🎵 TikTok OAuth Cloudflare Worker

A beautiful, modern, and secure OAuth 2.0 implementation for TikTok API integration, deployed on Cloudflare Workers.

![TikTok OAuth](https://img.shields.io/badge/TikTok-OAuth-black?style=for-the-badge&logo=tiktok)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?style=for-the-badge&logo=cloudflare)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)

## ✨ Features

- 🎨 **Beautiful UI** - Modern, responsive design with animations
- 🔒 **Secure** - OAuth 2.0 standard implementation
- ⚡ **Fast** - Runs on Cloudflare's edge network
- 📱 **Responsive** - Works perfectly on all devices
- 💾 **Token Storage** - Optional KV storage for tokens
- 🔄 **Token Refresh** - Built-in refresh token support
- 📋 **Copy & Download** - Easy token management
- 🎯 **API Endpoints** - RESTful API for integration

## 🚀 Quick Start

### Prerequisites

- Cloudflare account
- TikTok Developer account
- Domain configured in Cloudflare

### Deployment Options

#### Option 1: Cloudflare Dashboard (Recommended)

1. **Create Worker**

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
   - Click "Create Application" → "Create Worker"
   - Name it `tiktok-oauth`

2. **Deploy Code**

   - Copy content from `worker.js`
   - Paste into the Cloudflare Worker editor
   - Click "Save and Deploy"

3. **Configure Environment Variables**

   - Go to Settings → Variables
   - Add these variables:
     ```
     TIKTOK_CLIENT_KEY = your_client_key_here
     TIKTOK_CLIENT_SECRET = your_client_secret_here (Encrypt this!)
     ```

4. **Add Custom Domain**
   - Go to Triggers tab
   - Click "Add Custom Domain"
   - Enter: `bot.boringrats.dev`

#### Option 2: Wrangler CLI

1. **Install Wrangler**

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**

   ```bash
   wrangler login
   ```

3. **Configure wrangler.toml**

   ```toml
   name = "tiktok-oauth"
   main = "worker.js"
   compatibility_date = "2024-01-01"

   [vars]
   # Set via: wrangler secret put TIKTOK_CLIENT_KEY
   # Set via: wrangler secret put TIKTOK_CLIENT_SECRET
   ```

4. **Deploy**

   ```bash
   wrangler deploy
   ```

5. **Set Secrets**
   ```bash
   wrangler secret put TIKTOK_CLIENT_KEY
   wrangler secret put TIKTOK_CLIENT_SECRET
   ```

## 📚 API Endpoints

| Endpoint      | Method | Description                            |
| ------------- | ------ | -------------------------------------- |
| `/`           | GET    | Landing page with authorization button |
| `/callback`   | GET    | OAuth callback (automatic)             |
| `/tokens`     | GET    | Get stored tokens from KV              |
| `/refresh`    | POST   | Refresh access token                   |
| `/api/status` | GET    | API status and configuration           |
| `/styles.css` | GET    | CSS stylesheet                         |

## 🎯 Usage

### 1. Start OAuth Flow

Visit `https://bot.boringrats.dev/` and click "Authorize with TikTok"

### 2. Authorize

Log in with your TikTok account and grant permissions

### 3. Get Tokens

After authorization, you'll receive:

- ✅ Access Token
- ✅ Refresh Token
- ✅ Open ID
- ✅ Expiration Info

### 4. Use API

```javascript
// Example: Upload video using access token
const response = await fetch(
  "https://open.tiktokapis.com/v2/post/publish/video/init/",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // your video upload data
    }),
  }
);
```

## 🔄 Token Refresh

When your access token expires, use the refresh token:

```bash
curl -X POST https://bot.boringrats.dev/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"your_refresh_token_here"}'
```

## 🗄️ Optional: KV Storage

To enable persistent token storage:

1. **Create KV Namespace**

   ```bash
   wrangler kv:namespace create "TIKTOK_TOKENS"
   ```

2. **Update wrangler.toml**

   ```toml
   [[kv_namespaces]]
   binding = "TIKTOK_TOKENS"
   id = "your_namespace_id_here"
   ```

3. **Deploy**
   ```bash
   wrangler deploy
   ```

Now tokens will be automatically stored and retrievable at `/tokens`

## 🎨 Customization

### Change Domain

Update the `redirectUri` in `worker.js`:

```javascript
const CONFIG = {
  redirectUri: "https://your-domain.com/callback",
  // ...
};
```

### Add More Scopes

Update the `scopes` in `worker.js`:

```javascript
const CONFIG = {
  scopes: "video.upload,user.info.basic,video.list",
  // ...
};
```

### Customize UI

Edit the CSS in the `handleStyles()` function or create a separate stylesheet.

## 🔒 Security Best Practices

- ✅ Always encrypt `TIKTOK_CLIENT_SECRET` in Cloudflare
- ✅ Never commit tokens to version control
- ✅ Use HTTPS only (enforced by Cloudflare)
- ✅ Implement rate limiting for production
- ✅ Store tokens securely
- ✅ Use refresh tokens to minimize exposure

## 🐛 Troubleshooting

### "redirect_uri mismatch" Error

**Solution:** Ensure TikTok Developer Portal has exactly:

```
https://bot.boringrats.dev/callback
```

- No trailing slash
- Must be HTTPS
- Must match exactly

### "Missing Environment Variables"

**Solution:** Set environment variables in Cloudflare Worker settings:

- Settings → Variables → Add variable

### Callback Not Working

**Solution:**

1. Check DNS is configured correctly
2. Wait for DNS propagation (up to 24 hours)
3. Verify custom domain is active in Triggers tab

## 📖 TikTok API Documentation

- [TikTok Developer Portal](https://developers.tiktok.com)
- [OAuth 2.0 Guide](https://developers.tiktok.com/doc/oauth-user-access-token-management/)
- [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**SwadhinBiswas**

- GitHub: [@swadhinbiswas](https://github.com/swadhinbiswas)
- Website: [swadhinbiswas.com](https://swadhin.my.id)

## 🙏 Acknowledgments

- [TikTok for Developers](https://developers.tiktok.com)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [Font Awesome](https://fontawesome.com)

## 📸 Screenshots

### Landing Page

Beautiful, modern landing page with animated particles and gradient background.

### Success Page

Clean token display with copy and download functionality.

### Error Handling

User-friendly error pages with helpful troubleshooting tips.

---
**Happy Coding! 🚀**
