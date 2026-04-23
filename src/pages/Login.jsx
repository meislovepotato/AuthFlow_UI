import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
    // If coming from an OAuth2 client request, generate PKCE verifier/challenge
    const loginPayload = {
      email,
      password,
    };

    // If coming from a client OAuth2 flow, add those params and PKCE
    if (clientId && redirectUri) {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // store verifier/client info for the callback exchange
      sessionStorage.setItem("pkce_code_verifier", codeVerifier);
      sessionStorage.setItem("oauth_client_id", clientId);
      sessionStorage.setItem("oauth_redirect_uri", redirectUri);

      loginPayload.client_id = clientId;
      loginPayload.redirect_uri = redirectUri;
      if (state) loginPayload.state = state;
      // send PKCE code_challenge so backend/authorize can bind it
      loginPayload.code_challenge = codeChallenge;
      loginPayload.code_challenge_method = "S256";

      // On success, the backend will redirect us to the client redirect
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
      // Direct login
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
