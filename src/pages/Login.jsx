import { useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { generateCodeVerifier, generateCodeChallenge } from "../pkce";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const loginPayload = { email, password };

    if (clientId && redirectUri) {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      sessionStorage.setItem("pkce_code_verifier", codeVerifier);
      sessionStorage.setItem("oauth_client_id", clientId);
      sessionStorage.setItem("oauth_redirect_uri", redirectUri);

      loginPayload.client_id = clientId;
      loginPayload.redirect_uri = redirectUri;
      if (state) loginPayload.state = state;
      loginPayload.code_challenge = codeChallenge;
      loginPayload.code_challenge_method = "S256";

      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
        credentials: "include",
      });

      if (res.redirected || res.status === 302) {
        window.location.href = res.url;
      } else if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Login failed");
      }
    } else {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="orb orb-1" style={{ opacity: 0.2 }} />
      <div className="grid-bg" />

      <div className="auth-card">
        <div className="auth-badge">
          <span className="auth-badge-dot" />
          Secure sign-in
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="field-label">Email address</label>
            <input
              className="field-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          No account?{" "}
          <RouterLink to="/register" className="auth-link">
            Create one free
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default Login;