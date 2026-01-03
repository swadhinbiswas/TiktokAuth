# Contributing to TikTok OAuth Worker

First off, thank you for considering contributing to this project! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Rationale** - why would this be useful?
- **Examples** of how it would work
- **Mockups** (if applicable)

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**:

   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**:

   ```bash
   wrangler dev
   ```

5. **Commit your changes**:

   ```bash
   git commit -m "Add amazing feature"
   ```

   Use clear commit messages:

   - ✨ `:sparkles:` for new features
   - 🐛 `:bug:` for bug fixes
   - 📝 `:memo:` for documentation
   - 🎨 `:art:` for UI improvements
   - ♻️ `:recycle:` for refactoring
   - ⚡ `:zap:` for performance improvements

6. **Push to your fork**:

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **JSDoc comments** for functions
- Keep lines under **100 characters** when possible
- Use **meaningful variable names**

### Example Code Style

```javascript
/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from TikTok
 * @param {Object} env - Environment variables
 * @returns {Promise<Object>} Token data
 */
async function exchangeCodeForToken(code, env) {
  const params = new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    client_secret: env.TIKTOK_CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: CONFIG.redirectUri,
  });

  const response = await fetch(CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: params.toString(),
  });

  return await response.json();
}
```

## Development Setup

1. **Clone your fork**:

   ```bash
   git clone https://github.com/your-username/tiktok-oauth-worker.git
   cd tiktok-oauth-worker
   ```

2. **Install Wrangler**:

   ```bash
   npm install -g wrangler
   ```

3. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

4. **Set up environment**:

   ```bash
   wrangler secret put TIKTOK_CLIENT_KEY
   wrangler secret put TIKTOK_CLIENT_SECRET
   ```

5. **Run locally**:
   ```bash
   wrangler dev
   ```

## Testing

Before submitting a PR, test:

- ✅ OAuth flow works end-to-end
- ✅ Error handling works correctly
- ✅ UI is responsive on mobile
- ✅ All endpoints return expected responses
- ✅ No console errors

## Documentation

If you're adding new features, update:

- `README.md` - Usage examples
- `DEPLOYMENT.md` - Deployment steps (if needed)
- Code comments - Explain complex logic
- `CHANGELOG.md` - What changed

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
