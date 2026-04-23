AuthFlow Frontend — Everything README

This repository is a minimal frontend demonstrating an OAuth2 Authorization Code flow with PKCE (S256) and a traditional session-based login. The README below documents the entire project: structure, how PKCE is implemented, how to run and test locally, where to configure server endpoints and secrets, and troubleshooting tips.

**Quick overview**

- **Type:** React + Vite single-page app (TS/JS mix)
- **Purpose:** Demo SPA + server interactions for Authorization Code + PKCE, plus direct login flows used by the demo auth server
- **Auth server base (default):** http://localhost:3000

**Contents**

- index.html — static demo page (in older examples). Not the React entry; kept for reference or static PKCE demo.
- src/ — primary app source
  - main.tsx — app bootstrap and router
  - global.d.ts — types for globals
  - style.css — global styling
  - hooks/ — auth-related hooks
    - useAuth.js — main auth context hook for login/logout/refresh
    - useAuthCode.js — helper for code flow (if present)
    - useTokenRefresh.js — refresh handling
  - context/AuthContext.jsx — provides auth state to app
  - components/ — small UI/route helpers
    - AuthGuard.jsx, ProtectedRoute.jsx, TokenDisplay.jsx
  - pages/ — route pages
    - Login.jsx — login page, now enhanced to support PKCE flows
    - Callback.jsx — OAuth callback handler (accepts ?code=... and exchanges tokens)
    - Dashboard.jsx, Home.jsx, AdminPanel.jsx, Register.jsx
  - services/authService.js — high-level API calls to backend
  - pkce.js — PKCE helper (generate code_verifier and S256 code_challenge)

Why this repo contains both static demo pages and a React SPA

- There are a few example/static files and a fully integrated React SPA. Use the SPA for the app; the static index.html/callback.html are small, standalone demonstrations of PKCE flows useful for quick testing.

PKCE (high-level)

- This project uses the PKCE extension (S256) for secure Authorization Code flow from public clients (SPAs).
- Flow summary:
  1. The client (browser) generates a random code_verifier and computes a code_challenge = BASE64URL(SHA256(code_verifier)).
  2. The client initiates login/authorize and sends code_challenge and code_challenge_method=S256 to the authorization endpoint.
  3. The authorization server stores the code_challenge with the authorization code.
  4. After the user authenticates and the client receives code at the redirect URI, the client sends the code_verifier with the token request to exchange the code for tokens.
  5. The authorization server computes the challenge from the code_verifier and verifies it matches the stored code_challenge before issuing tokens.

Where PKCE code lives

- src/pkce.js — exposes generateCodeVerifier(), generateCodeChallenge(verifier) and small helpers used by Login.jsx and by the static examples.

What changed in this repo (PKCE wiring)

- src/pages/Login.jsx now:
  - Detects an incoming client_id + redirect_uri query parameters (client-initiated OAuth flow).
  - Generates code_verifier and code_challenge when starting login for a client flow.
  - Stores pkce_code_verifier, oauth_client_id, and oauth_redirect_uri in sessionStorage to use later in Callback.jsx.
  - Sends code_challenge and code_challenge_method=S256 in the login request so the server's /authorize step can bind the challenge to the code.
- src/pages/Callback.jsx now:
  - Reads pkce_code_verifier from sessionStorage and includes it as code_verifier when POSTing to /api/auth/token to exchange the authorization code for tokens.
  - Cleans up PKCE/session items after successful exchange.

Server-side expectations

- The server should expose these endpoints (defaults used in code):
  - POST http://localhost:3000/api/auth/login — accepts login form and (for client flows) redirects to authorization endpoint which eventually returns code to redirect_uri.
  - GET http://localhost:3000/api/auth/authorize — standard OAuth authorize endpoint (server may be called by login flow or via redirects).
  - POST http://localhost:3000/api/auth/token — token endpoint; must validate code_verifier against stored code_challenge for the code when using PKCE.

If your server runs on another host or port

- Update API calls in the frontend (search for http://localhost:3000) or better: set a runtime env var and use it in requests.

Environment / configuration

- REACT_APP_CLIENT_SECRET — optional secret for confidential clients (not recommended for SPAs). If you need to embed secrets for testing in a development environment, set this env var before starting the dev server.

How to run (development)

1. Install deps
   npm install
2. Start dev server (Vite)
   npm run dev
3. Open http://localhost:5173 (or the URL Vite outputs). The SPA will use the auth server at http://localhost:3000 by default.

Static demo (quick, optional)

- To serve static demo files, run one of these from the project root:
  - Python: python -m http.server 5173
  - npm serve: npx serve -s . -l 5173

Testing the flow manually

1. Register a client in your auth server with redirect URI http://localhost:5173/callback (or the SPA callback route).
2. Initiate the client flow by visiting your SPA or use the static index.html demo.
3. Complete login; ensure the server redirects with ?code=...&state=... to the redirect URI.
4. Confirm the SPA exchanges the code and stores accessToken/refreshToken in localStorage.

Security notes / best practices

- Do NOT embed client secrets in a public SPA.
- Use PKCE (S256) for public clients (SPAs, mobile apps).
- Use HTTPS in production.
- For production, use secure, httpOnly cookies for refresh tokens where possible and avoid long-lived tokens in localStorage.

Troubleshooting

- Missing code on callback: ensure the authorize flow redirected to the correct redirect_uri and query parameters are present.
- Token exchange fails: check server logs for invalid_grant or invalid_request; verify the stored code_challenge matches SHA256(code_verifier).
- CORS errors: ensure the auth server allows the frontend origin and the token endpoint allows Content-Type: application/json and the required credentials policy.

Files to inspect for customization

- src/pages/Login.jsx — PKCE generation & storage of verifier
- src/pages/Callback.jsx — code exchange using verifier
- src/pkce.js — PKCE helper
- src/services/authService.js — centralized API calls (update base URL here if you want)
