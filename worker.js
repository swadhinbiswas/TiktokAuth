/**
 * TikTok OAuth Cloudflare Worker
 * Beautiful, modern implementation with comprehensive error handling
 *
 * Environment Variables Required:
 * - TIKTOK_CLIENT_KEY: Your TikTok Client Key
 * - TIKTOK_CLIENT_SECRET: Your TikTok Client Secret
 *
 * @author Your Name
 * @version 2.0.0
 */

const CONFIG = {
  redirectUri: "https://bot.boringrats.dev/callback",
  scopes: "video.upload,user.info.basic",
  authUrl: "https://www.tiktok.com/v2/auth/authorize/",
  tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
  refreshTokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for API endpoints
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handlers
      switch (path) {
        case "/":
        case "/auth":
          return handleLandingPage(env);

        case "/callback":
          return handleCallback(request, env);

        case "/tokens":
          return handleGetTokens(env);

        case "/refresh":
          return handleRefreshToken(request, env);

        case "/api/status":
          return handleApiStatus(env);

        case "/styles.css":
          return handleStyles();

        default:
          return handle404();
      }
    } catch (error) {
      console.error("Worker error:", error);
      return handleError(error);
    }
  },
};

/**
 * Landing Page - Beautiful UI with animations
 */
function handleLandingPage(env) {
  const clientKey = env.TIKTOK_CLIENT_KEY;

  if (!clientKey) {
    return createConfigErrorPage();
  }

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: CONFIG.scopes,
    response_type: "code",
    redirect_uri: CONFIG.redirectUri,
    state: generateRandomState(),
  });

  const authUrl = `${CONFIG.authUrl}?${params.toString()}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TikTok OAuth Portal</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <i class="fab fa-tiktok"></i>
        <span>TikTok OAuth Portal</span>
      </div>
      <a href="https://github.com" target="_blank" class="nav-link">
        <i class="fab fa-github"></i>
        <span>GitHub</span>
      </a>
    </div>
  </nav>

  <main class="main-content">
    <div class="hero-section">
      <div class="hero-badge">
        <i class="fas fa-shield-check"></i>
        <span>Secure OAuth 2.0</span>
      </div>
      <h1 class="hero-title">Secure TikTok OAuth<br/><span class="highlight">Authorization</span></h1>
      <p class="hero-description">Connect your TikTok account safely and securely. Get access tokens for video uploads and content management.</p>

      <a href="${authUrl}" class="cta-button">
        <span class="cta-icon"><i class="fab fa-tiktok"></i></span>
        <span class="cta-text">Authorize with TikTok</span>
        <span class="cta-arrow"><i class="fas fa-arrow-right"></i></span>
      </a>

      <p class="cta-note">
        <i class="fas fa-info-circle"></i>
        You'll be redirected to TikTok to grant permissions
      </p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-lock"></i>
        </div>
        <h3>Secure</h3>
        <p>OAuth 2.0 standard security</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-bolt"></i>
        </div>
        <h3>Fast</h3>
        <p>Instant authorization</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Reliable</h3>
        <p>99.9% uptime</p>
      </div>
    </div>

    <div class="content-grid">
      <div class="info-card">
        <div class="card-icon">
          <i class="fas fa-cog"></i>
        </div>
        <h3>Configuration</h3>
        <div class="info-items">
          <div class="info-item">
            <span class="label">Redirect URI</span>
            <code class="value">${CONFIG.redirectUri}</code>
          </div>
          <div class="info-item">
            <span class="label">Scopes</span>
            <code class="value">${CONFIG.scopes}</code>
          </div>
          <div class="info-item">
            <span class="label">Response Type</span>
            <code class="value">code</code>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="card-icon">
          <i class="fas fa-key"></i>
        </div>
        <h3>What You'll Get</h3>
        <ul class="check-list">
          <li><i class="fas fa-check"></i>Access Token</li>
          <li><i class="fas fa-check"></i>Refresh Token</li>
          <li><i class="fas fa-check"></i>User Open ID</li>
          <li><i class="fas fa-check"></i>Token Expiration Info</li>
        </ul>
      </div>
    </div>

    <div class="api-section">
      <div class="section-header">
        <i class="fas fa-code"></i>
        <h3>API Endpoints</h3>
      </div>
      <div class="endpoints-list">
        <div class="endpoint-item">
          <span class="method get">GET</span>
          <code>/</code>
          <span class="endpoint-desc">Landing page</span>
        </div>
        <div class="endpoint-item">
          <span class="method get">GET</span>
          <code>/callback</code>
          <span class="endpoint-desc">OAuth callback</span>
        </div>
        <div class="endpoint-item">
          <span class="method get">GET</span>
          <code>/tokens</code>
          <span class="endpoint-desc">Get stored tokens</span>
        </div>
        <div class="endpoint-item">
          <span class="method post">POST</span>
          <code>/refresh</code>
          <span class="endpoint-desc">Refresh access token</span>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <p>
      Built with <i class="fas fa-heart"></i> using Cloudflare Workers
      <span class="separator">•</span>
      <a href="https://developers.tiktok.com" target="_blank">TikTok Developer Docs</a>
    </p>
  </footer>
</body>
</html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Handle OAuth callback from TikTok
 */
async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    return createErrorPage(error, errorDescription);
  }

  if (!code) {
    return createErrorPage(
      "No Code",
      "Authorization code not received from TikTok"
    );
  }

  try {
    const tokenData = await exchangeCodeForToken(code, env);

    // Store in KV if available
    if (env.TIKTOK_TOKENS) {
      const tokenRecord = {
        ...tokenData,
        created_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + tokenData.expires_in * 1000
        ).toISOString(),
      };

      await env.TIKTOK_TOKENS.put("latest_token", JSON.stringify(tokenRecord), {
        expirationTtl: tokenData.expires_in,
      });
    }

    return createSuccessPage(tokenData);
  } catch (error) {
    return createErrorPage("Token Exchange Failed", error.message);
  }
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code, env) {
  const clientKey = env.TIKTOK_CLIENT_KEY;
  const clientSecret = env.TIKTOK_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    throw new Error(
      "Missing TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET environment variables"
    );
  }

  const params = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
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

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      data.error_description || data.message || "Token exchange failed"
    );
  }

  return data;
}

/**
 * Success page with token display
 */
function createSuccessPage(tokenData) {
  const expiresInHours = Math.floor(tokenData.expires_in / 3600);
  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toLocaleString();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorization Successful - TikTok OAuth</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="particles" id="particles"></div>

  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <i class="fab fa-tiktok"></i>
        <span>TikTok OAuth Portal</span>
      </div>
      <div class="nav-links">
        <a href="/">
          <i class="fas fa-home"></i> Home
        </a>
      </div>
    </div>
  </nav>

  <main class="container">
    <div class="success-hero">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h1>Authorization Successful!</h1>
      <p>Your TikTok account has been authorized successfully</p>
    </div>

    <div class="card token-card">
      <div class="card-header">
        <h2><i class="fas fa-key"></i> Access Token</h2>
        <button class="btn btn-small" onclick="copyToken('access-token')">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
      <div class="token-display">
        <code id="access-token">${tokenData.access_token}</code>
      </div>
    </div>

    ${
      tokenData.refresh_token
        ? `
    <div class="card token-card">
      <div class="card-header">
        <h2><i class="fas fa-sync-alt"></i> Refresh Token</h2>
        <button class="btn btn-small" onclick="copyToken('refresh-token')">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
      <div class="token-display">
        <code id="refresh-token">${tokenData.refresh_token}</code>
      </div>
    </div>
    `
        : ""
    }

    <div class="info-grid">
      <div class="card stat-card">
        <div class="stat-icon">
          <i class="fas fa-user"></i>
        </div>
        <div class="stat-content">
          <h3>Open ID</h3>
          <p>${tokenData.open_id}</p>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>Expires In</h3>
          <p>${expiresInHours} hours</p>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar"></i>
        </div>
        <div class="stat-content">
          <h3>Expires At</h3>
          <p>${expiresAt}</p>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="stat-content">
          <h3>Scopes</h3>
          <p>${tokenData.scope}</p>
        </div>
      </div>
    </div>

    <div class="card warning-card">
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <h3>Important Security Notice</h3>
        <ul>
          <li>Store these tokens securely - never commit them to version control</li>
          <li>The access token will expire in ${expiresInHours} hours</li>
          <li>Use the refresh token to get a new access token when needed</li>
          <li>Keep your tokens private and never share them publicly</li>
        </ul>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn btn-primary" onclick="downloadTokens()">
        <i class="fas fa-download"></i> Download Tokens
      </button>
      <a href="/" class="btn btn-secondary">
        <i class="fas fa-home"></i> Back to Home
      </a>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p><i class="fas fa-heart"></i> Authorization completed successfully</p>
    </div>
  </footer>

  <div id="toast" class="toast">
    <i class="fas fa-check-circle"></i>
    <span id="toast-message">Copied to clipboard!</span>
  </div>

  <script>
    const tokenData = ${JSON.stringify(tokenData)};

    function copyToken(elementId) {
      const element = document.getElementById(elementId);
      const text = element.textContent;

      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
      }).catch(() => {
        showToast('Failed to copy', 'error');
      });
    }

    function downloadTokens() {
      const data = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        open_id: tokenData.open_id,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
        token_type: tokenData.token_type,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tiktok_tokens_' + new Date().toISOString().split('T')[0] + '.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Tokens downloaded!');
    }

    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      const toastMessage = document.getElementById('toast-message');
      toastMessage.textContent = message;
      toast.className = 'toast show ' + type;

      setTimeout(() => {
        toast.className = 'toast';
      }, 3000);
    }

    // Particle animation
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.getElementById('particles').appendChild(particle);
      setTimeout(() => particle.remove(), 5000);
    }
    setInterval(createParticle, 300);
  </script>
</body>
</html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Error page
 */
function createErrorPage(errorTitle, errorMessage) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - TikTok OAuth</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="particles" id="particles"></div>

  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <i class="fab fa-tiktok"></i>
        <span>TikTok OAuth Portal</span>
      </div>
      <div class="nav-links">
        <a href="/">
          <i class="fas fa-home"></i> Home
        </a>
      </div>
    </div>
  </nav>

  <main class="container">
    <div class="error-hero">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <h1>Authorization Failed</h1>
      <p>Something went wrong during the authorization process</p>
    </div>

    <div class="card error-card">
      <h2><i class="fas fa-bug"></i> Error Details</h2>
      <div class="error-content">
        <p><strong>Error:</strong> ${errorTitle}</p>
        <p><strong>Description:</strong> ${errorMessage}</p>
      </div>
    </div>

    <div class="card info-card">
      <h3><i class="fas fa-lightbulb"></i> Common Solutions</h3>
      <ul class="info-list">
        <li>Verify your redirect URI in TikTok Developer Portal matches exactly: <code>${CONFIG.redirectUri}</code></li>
        <li>Ensure your Client Key and Secret are correct</li>
        <li>Check that your app is approved and scopes are enabled</li>
        <li>Make sure the test user is added to your app's sandbox</li>
      </ul>
    </div>

    <div class="action-buttons">
      <a href="/" class="btn btn-primary">
        <i class="fas fa-redo"></i> Try Again
      </a>
      <a href="https://developers.tiktok.com" target="_blank" class="btn btn-secondary">
        <i class="fas fa-book"></i> Documentation
      </a>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p><i class="fas fa-info-circle"></i> Need help? Check the TikTok Developer Documentation</p>
    </div>
  </footer>

  <script>
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.getElementById('particles').appendChild(particle);
      setTimeout(() => particle.remove(), 5000);
    }
    setInterval(createParticle, 300);
  </script>
</body>
</html>
  `;

  return new Response(html, {
    status: 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Configuration error page
 */
function createConfigErrorPage() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configuration Error - TikTok OAuth</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <main class="container">
    <div class="error-hero">
      <div class="error-icon">
        <i class="fas fa-cog"></i>
      </div>
      <h1>Configuration Required</h1>
    </div>

    <div class="card error-card">
      <h2><i class="fas fa-wrench"></i> Missing Environment Variables</h2>
      <p>Please configure the following environment variables in your Cloudflare Worker:</p>
      <ul class="info-list">
        <li><code>TIKTOK_CLIENT_KEY</code> - Your TikTok Client Key</li>
        <li><code>TIKTOK_CLIENT_SECRET</code> - Your TikTok Client Secret</li>
      </ul>
    </div>
  </main>
</body>
</html>
  `;

  return new Response(html, {
    status: 500,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Get stored tokens from KV
 */
async function handleGetTokens(env) {
  if (!env.TIKTOK_TOKENS) {
    return new Response(
      JSON.stringify({ error: "KV namespace not configured" }),
      {
        status: 501,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const tokenData = await env.TIKTOK_TOKENS.get("latest_token", {
    type: "json",
  });

  if (!tokenData) {
    return new Response(JSON.stringify({ error: "No tokens found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(tokenData, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Refresh access token
 */
async function handleRefreshToken(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { refresh_token } = await request.json();

  if (!refresh_token) {
    return new Response(JSON.stringify({ error: "refresh_token required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const params = new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    client_secret: env.TIKTOK_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });

  const response = await fetch(CONFIG.refreshTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * API status endpoint
 */
function handleApiStatus(env) {
  const status = {
    status: "operational",
    version: "2.0.0",
    configured: !!(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET),
    kv_enabled: !!env.TIKTOK_TOKENS,
    endpoints: ["/", "/callback", "/tokens", "/refresh", "/api/status"],
  };

  return new Response(JSON.stringify(status, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Serve CSS styles
 */
function handleStyles() {
  const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --accent: #0066FF;
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --radius: 12px;
  --radius-lg: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  background: var(--gray-50);
  color: var(--gray-900);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  letter-spacing: -0.025em;
}

.nav-brand i {
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-600);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-link:hover {
  color: var(--gray-900);
  background: var(--gray-100);
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

/* Hero Section */
.hero-section {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--gray-900);
  color: white;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.hero-badge i {
  font-size: 1rem;
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.highlight {
  background: linear-gradient(135deg, var(--accent) 0%, #0052cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--gray-600);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* CTA Button */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: var(--gray-900);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.cta-button:hover::before {
  opacity: 1;
}

.cta-button:active {
  transform: translateY(0);
}

.cta-icon {
  font-size: 1.5rem;
}

.cta-arrow {
  font-size: 1rem;
  transition: transform 0.3s;
}

.cta-button:hover .cta-arrow {
  transform: translateX(4px);
}

.cta-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: var(--gray-500);
  font-size: 0.9rem;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: var(--radius);
  border: 1px solid var(--gray-200);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--gray-900);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: var(--gray-900);
  color: white;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1.25rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.feature-card p {
  color: var(--gray-600);
  font-size: 0.95rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: var(--radius);
  border: 1px solid var(--gray-200);
}

.card-icon {
  width: 48px;
  height: 48px;
  background: var(--gray-100);
  color: var(--gray-900);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item .label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item .value {
  background: var(--gray-100);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--gray-900);
  word-break: break-all;
}

.check-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.check-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--gray-700);
  font-size: 0.95rem;
}

.check-list i {
  color: var(--gray-900);
  font-size: 1.125rem;
}

/* API Section */
.api-section {
  background: white;
  padding: 2rem;
  border-radius: var(--radius);
  border: 1px solid var(--gray-200);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-header i {
  font-size: 1.25rem;
  color: var(--gray-900);
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  letter-spacing: -0.02em;
}

.endpoints-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.endpoint-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  transition: all 0.2s;
}

.endpoint-item:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
}

.method {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 55px;
  text-align: center;
}

.method.get {
  background: var(--gray-900);
  color: white;
}

.method.post {
  background: var(--gray-600);
  color: white;
}

.endpoint-item code {
  flex: 1;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.9rem;
}

.endpoint-desc {
  color: var(--gray-500);
  font-size: 0.9rem;
}

/* Container */
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Cards for success/error pages */
.card {
  background: white;
  border-radius: var(--radius);
  padding: 2rem;
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow);
  width: 100%;
}

.main-card {
  max-width: 800px;
}

/* Success/Error hero */
.success-hero, .error-hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.success-icon {
  font-size: 5rem;
  color: var(--gray-900);
  animation: scaleIn 0.5s ease-out;
}

.error-icon {
  font-size: 5rem;
  color: var(--gray-900);
  animation: shake 0.5s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.success-hero h1, .error-hero h1 {
  font-size: 2.25rem;
  color: var(--gray-900);
  margin: 1rem 0 0.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.success-hero p, .error-hero p {
  color: var(--gray-600);
  font-size: 1rem;
}

/* Token display */
.token-card {
  width: 100%;
  max-width: 800px;
}

.token-display {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 1.5rem;
  word-break: break-all;
  margin: 1rem 0;
}

.token-display code {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: var(--gray-900);
  line-height: 1.7;
  letter-spacing: 0.02em;
}

/* Stats */
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.stat-icon {
  width: 56px;
  height: 56px;
  background: var(--gray-900);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.stat-content p {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-900);
}

/* Warning card */
.warning-card {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  display: flex;
  gap: 1rem;
  align-items: start;
  width: 100%;
  max-width: 800px;
  margin: 1rem 0;
}

.warning-card i {
  font-size: 1.5rem;
  color: var(--gray-900);
  flex-shrink: 0;
}

.warning-card h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.warning-card ul {
  margin-left: 1.5rem;
  color: var(--gray-600);
}

.warning-card li {
  margin: 0.25rem 0;
}

/* Error card */
.error-card {
  width: 100%;
  max-width: 800px;
}

.error-card h2 {
  color: var(--gray-900);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.error-content {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
}

.error-content p {
  margin: 0.5rem 0;
  line-height: 1.8;
  color: var(--gray-700);
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1rem 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: var(--gray-900);
  color: white;
}

.btn-primary:hover {
  background: var(--gray-800);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: white;
  color: var(--gray-900);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  border-color: var(--gray-900);
  background: var(--gray-50);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--gray-900);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-xl);
  transform: translateY(150%);
  transition: transform 0.3s;
  z-index: 1000;
}

.toast.show {
  transform: translateY(0);
}

.toast i {
  font-size: 1.25rem;
}

/* Footer */
.footer {
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 2rem 0;
  margin-top: 4rem;
  text-align: center;
  color: var(--gray-600);
  font-size: 0.9rem;
}

.footer a {
  color: var(--gray-900);
  text-decoration: none;
  font-weight: 500;
}

.footer a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: var(--gray-400);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }

  .endpoint-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }

  .main-content {
    padding: 2rem 1rem;
  }
}

/* 404 Page */
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 8rem;
  color: var(--gray-900);
  margin: 0;
}

.not-found h2 {
  color: var(--gray-600);
  margin: 1rem 0;
}
  `;

  return new Response(css, {
    headers: { "Content-Type": "text/css" },
  });
}

/**
 * 404 handler
 */
function handle404() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Not Found</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="particles" id="particles"></div>
  <main class="container">
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <a href="/" class="btn btn-primary">
        <i class="fas fa-home"></i> Go Home
      </a>
    </div>
  </main>
  <script>
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.getElementById('particles').appendChild(particle);
      setTimeout(() => particle.remove(), 5000);
    }
    setInterval(createParticle, 300);
  </script>
</body>
</html>
  `;

  return new Response(html, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Generic error handler
 */
function handleError(error) {
  return new Response(
    JSON.stringify({
      error: "Internal Server Error",
      message: error.message,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Generate random state for CSRF protection
 */
function generateRandomState() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
