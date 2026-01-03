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
  <title>TikTok OAuth - Authorization Portal</title>
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
        <a href="https://github.com/your-username/tiktok-oauth-worker" target="_blank">
          <i class="fab fa-github"></i> GitHub
        </a>
      </div>
    </div>
  </nav>

  <main class="container">
    <div class="hero">
      <div class="hero-icon">
        <i class="fas fa-shield-alt"></i>
      </div>
      <h1 class="hero-title">
        Secure TikTok OAuth
        <span class="gradient-text">Authorization</span>
      </h1>
      <p class="hero-subtitle">
        Connect your TikTok account safely and securely through our OAuth 2.0 implementation
      </p>
    </div>

    <div class="card main-card">
      <div class="card-header">
        <h2><i class="fas fa-rocket"></i> Get Started</h2>
        <p>Authorize your TikTok account to enable video uploads and more</p>
      </div>

      <div class="features">
        <div class="feature">
          <div class="feature-icon">
            <i class="fas fa-lock"></i>
          </div>
          <h3>Secure</h3>
          <p>OAuth 2.0 standard security</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <h3>Fast</h3>
          <p>Instant authorization</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Reliable</h3>
          <p>99.9% uptime on Cloudflare</p>
        </div>
      </div>

      <div class="auth-section">
        <a href="${authUrl}" class="btn btn-primary">
          <i class="fab fa-tiktok"></i>
          <span>Authorize with TikTok</span>
          <i class="fas fa-arrow-right"></i>
        </a>
        <p class="auth-note">
          <i class="fas fa-info-circle"></i>
          You'll be redirected to TikTok to grant permissions
        </p>
      </div>
    </div>

    <div class="info-grid">
      <div class="card info-card">
        <div class="info-header">
          <i class="fas fa-cog"></i>
          <h3>Configuration</h3>
        </div>
        <ul class="info-list">
          <li><strong>Redirect URI:</strong> <code>${CONFIG.redirectUri}</code></li>
          <li><strong>Scopes:</strong> <code>${CONFIG.scopes}</code></li>
          <li><strong>Response Type:</strong> <code>code</code></li>
        </ul>
      </div>

      <div class="card info-card">
        <div class="info-header">
          <i class="fas fa-key"></i>
          <h3>What You'll Get</h3>
        </div>
        <ul class="info-list">
          <li><i class="fas fa-check"></i> Access Token</li>
          <li><i class="fas fa-check"></i> Refresh Token</li>
          <li><i class="fas fa-check"></i> User Open ID</li>
          <li><i class="fas fa-check"></i> Token Expiration Info</li>
        </ul>
      </div>
    </div>

    <div class="card api-docs">
      <h3><i class="fas fa-code"></i> API Endpoints</h3>
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/</code>
        <span class="desc">Landing page</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/callback</code>
        <span class="desc">OAuth callback</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/tokens</code>
        <span class="desc">Get stored tokens</span>
      </div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/refresh</code>
        <span class="desc">Refresh access token</span>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>
        <i class="fas fa-heart"></i> Built with Cloudflare Workers
        <span class="separator">•</span>
        <a href="https://developers.tiktok.com" target="_blank">TikTok Developer Docs</a>
      </p>
    </div>
  </footer>

  <script>
    // Particle animation
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      document.getElementById('particles').appendChild(particle);

      setTimeout(() => particle.remove(), 5000);
    }

    setInterval(createParticle, 300);

    // Add entrance animations
    document.addEventListener('DOMContentLoaded', () => {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        card.style.animationDelay = (index * 0.1) + 's';
      });
    });
  </script>
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
  --primary: #fe2c55;
  --primary-dark: #d91f43;
  --secondary: #25f4ee;
  --dark: #0f0f0f;
  --dark-light: #1a1a1a;
  --gray: #6c757d;
  --gray-light: #f8f9fa;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --gradient: linear-gradient(135deg, #fe2c55 0%, #d91f43 100%);
  --gradient-secondary: linear-gradient(135deg, #25f4ee 0%, #00d4ff 100%);
  --shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.15);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Particles background */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -10px;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 5s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.nav-brand i {
  font-size: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--gray);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
}

.navbar .container {
  flex-direction: row;
}

/* Hero */
.hero {
  text-align: center;
  padding: 4rem 0 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.hero-icon {
  font-size: 5rem;
  color: white;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.gradient-text {
  background: var(--gradient-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
}

/* Cards */
.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
  animation: fadeInUp 0.8s ease-out;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-card {
  width: 100%;
  max-width: 800px;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 2rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.card-header p {
  color: var(--gray);
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.feature {
  text-align: center;
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(254, 44, 85, 0.3);
}

.feature h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--dark);
}

.feature p {
  color: var(--gray);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  justify-content: center;
}

.btn-primary {
  background: var(--gradient);
  color: white;
  box-shadow: 0 10px 30px rgba(254, 44, 85, 0.4);
}

.btn-primary:hover {
  box-shadow: 0 15px 40px rgba(254, 44, 85, 0.5);
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: var(--gray);
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Auth section */
.auth-section {
  text-align: center;
  padding: 2rem 0;
}

.auth-note {
  margin-top: 1rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Info grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.info-card {
  padding: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--primary);
  font-size: 1.5rem;
}

.info-header h3 {
  font-size: 1.25rem;
  color: var(--dark);
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list code {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  color: var(--primary);
}

.info-list i {
  color: var(--success);
}

/* API Docs */
.api-docs {
  width: 100%;
  max-width: 800px;
}

.api-docs h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
}

.endpoint {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.method {
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 60px;
  text-align: center;
}

.method.get {
  background: #d4edda;
  color: #155724;
}

.method.post {
  background: #d1ecf1;
  color: #0c5460;
}

.endpoint code {
  flex: 1;
  font-weight: 600;
  color: var(--dark);
}

.endpoint .desc {
  color: var(--gray);
  font-size: 0.9rem;
}

/* Success/Error pages */
.success-hero, .error-hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.success-icon {
  font-size: 6rem;
  color: var(--success);
  animation: scaleIn 0.5s ease-out;
}

.error-icon {
  font-size: 6rem;
  color: var(--danger);
  animation: shake 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.success-hero h1, .error-hero h1 {
  font-size: 2.5rem;
  color: white;
  margin: 1rem 0 0.5rem;
}

.success-hero p, .error-hero p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

/* Token display */
.token-card {
  width: 100%;
  max-width: 800px;
}

.token-display {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  word-break: break-all;
}

.token-display code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--dark);
  line-height: 1.8;
}

/* Stats */
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  flex-shrink: 0;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.stat-content p {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark);
}

/* Warning card */
.warning-card {
  background: #fff3cd;
  border: 2px solid #ffc107;
  display: flex;
  gap: 1rem;
  align-items: start;
  width: 100%;
  max-width: 800px;
}

.warning-card i {
  font-size: 2rem;
  color: #856404;
  flex-shrink: 0;
}

.warning-card h3 {
  color: #856404;
  margin-bottom: 0.5rem;
}

.warning-card ul {
  margin-left: 1.5rem;
  color: #856404;
}

.warning-card li {
  margin: 0.25rem 0;
}

/* Error card */
.error-card {
  width: 100%;
  max-width: 800px;
  border: 2px solid var(--danger);
}

.error-card h2 {
  color: var(--danger);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-content {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
}

.error-content p {
  margin: 0.5rem 0;
  line-height: 1.8;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1rem 0;
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--dark);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-lg);
  transform: translateY(150%);
  transition: transform 0.3s;
  z-index: 1000;
}

.toast.show {
  transform: translateY(0);
}

.toast.success {
  background: var(--success);
}

.toast.error {
  background: var(--danger);
}

.toast i {
  font-size: 1.25rem;
}

/* Footer */
.footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 0;
  margin-top: 4rem;
  text-align: center;
  color: var(--gray);
}

.footer a {
  color: var(--primary);
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: #ddd;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .navbar .container {
    flex-direction: column;
    gap: 1rem;
  }

  .endpoint {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}

/* 404 Page */
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 8rem;
  color: white;
  margin: 0;
}

.not-found h2 {
  color: rgba(255, 255, 255, 0.9);
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
