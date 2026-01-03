# 🎯 TikTok OAuth Worker - Quick Reference

## 📁 Project Structure

```
cloudflare-worker/
├── worker.js              # Main Cloudflare Worker code
├── wrangler.toml          # Cloudflare configuration
├── package.json           # NPM configuration
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
├── README.md             # Main documentation
├── DEPLOYMENT.md         # Deployment guide
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # Contribution guidelines
└── QUICK_START.md        # This file
```

## ⚡ Quick Commands

### Deploy

```bash
wrangler deploy
```

### Test Locally

```bash
wrangler dev
```

### Set Secrets

```bash
wrangler secret put TIKTOK_CLIENT_KEY
wrangler secret put TIKTOK_CLIENT_SECRET
```

### View Logs

```bash
wrangler tail
```

## 🔑 Required Environment Variables

| Variable               | Description               | Example             |
| ---------------------- | ------------------------- | ------------------- |
| `TIKTOK_CLIENT_KEY`    | Your TikTok Client Key    | `awXXXXXXXXXXXXXXX` |
| `TIKTOK_CLIENT_SECRET` | Your TikTok Client Secret | `XXXXXXXXXXXXXXXX`  |

## 🌐 Endpoints

### User-Facing

- `GET /` - Landing page
- `GET /callback` - OAuth callback
- `GET /styles.css` - Stylesheet

### API

- `GET /tokens` - Get stored tokens
- `POST /refresh` - Refresh access token
- `GET /api/status` - Worker status

## 🚀 5-Minute Setup

1. **Clone or download** this folder
2. **Install Wrangler**: `npm install -g wrangler`
3. **Login**: `wrangler login`
4. **Deploy**: `wrangler deploy`
5. **Set secrets**:
   ```bash
   wrangler secret put TIKTOK_CLIENT_KEY
   wrangler secret put TIKTOK_CLIENT_SECRET
   ```
6. **Add domain** in Cloudflare dashboard
7. **Done!** Visit your domain

## 📝 Important URLs

- **TikTok Developer Portal**: https://developers.tiktok.com
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/

## ⚠️ Before You Start

- [ ] TikTok app created
- [ ] OAuth enabled in TikTok app
- [ ] Redirect URI set: `https://your-domain.com/callback`
- [ ] Test user added to sandbox
- [ ] Domain added to Cloudflare
- [ ] Client Key and Secret ready

## 🐛 Common Issues

### "redirect_uri mismatch"

→ Check redirect URI in TikTok portal matches exactly

### "Missing environment variables"

→ Run `wrangler secret put TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`

### Domain not working

→ Check custom domain in Triggers tab

### Worker not updating

→ Run `wrangler deploy --purge`

## 💡 Tips

- Use `wrangler dev` for local testing
- Check logs with `wrangler tail`
- Test OAuth flow in incognito mode
- Save tokens immediately after authorization
- Use refresh token before access token expires

## 📞 Support

- **Issues**: Open a GitHub issue
- **Docs**: Check README.md and DEPLOYMENT.md
- **TikTok**: https://developers.tiktok.com/doc/

---

**Ready to deploy? Run `wrangler deploy` 🚀**
