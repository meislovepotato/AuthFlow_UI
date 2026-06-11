import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../config/api";
import { CODE_MAP, codeMessage } from "../utils/apiClient";
import { useToast } from "../context/ToastContext";
import { generateCodeVerifier, generateCodeChallenge } from "../pkce";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
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

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
        credentials: "include",
      });

      if (res.redirected || res.status === 302) {
        window.location.href = res.url;
      } else if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const code = err.errorCode || err.code || null;
        if (code === "VALIDATION_ERROR") {
          setFieldErrors(CODE_MAP.VALIDATION_ERROR(err));
          setError(Object.values(CODE_MAP.VALIDATION_ERROR(err))[0]);
        } else if (code === "INVALID_CREDENTIALS") {
          setError(CODE_MAP.INVALID_CREDENTIALS());
        } else if (code === "RATE_LIMITED" || code === "SERVER_ERROR") {
          showToast(codeMessage(code), "error");
          setError(codeMessage(code));
        } else {
          setError(err.error || "Login failed");
        }
      }
    } else {
      setFieldErrors({});
      setError(null);
      const result = await login(email, password);
      if (result && result.success) {
        navigate("/dashboard");
      } else {
        if (result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          setError(Object.values(result.fieldErrors)[0]);
        } else {
          setError(result?.error || CODE_MAP.INVALID_CREDENTIALS());
        }
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
            {fieldErrors.email && (
              <div className="err" style={{ color: "#b00020" }}>
                {fieldErrors.email}
              </div>
            )}
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
            {fieldErrors.password && (
              <div className="err" style={{ color: "#b00020" }}>
                {fieldErrors.password}
              </div>
            )}
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
