import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshAccessToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        setError("Missing authorization code");
        setLoading(false);
        return;
      }

      // Get the original redirect_uri and client_id from sessionStorage
      // (you stored them before redirecting to /authorize)
      const clientId = sessionStorage.getItem("oauth_client_id");
      const redirectUri = sessionStorage.getItem("oauth_redirect_uri");

      if (!clientId || !redirectUri) {
        setError("Missing OAuth2 configuration");
        setLoading(false);
        return;
      }

      try {
        const clientSecret =
          sessionStorage.getItem("oauth_client_secret") ||
          process.env.REACT_APP_CLIENT_SECRET ||
          null;

        const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

        const body = {
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          redirect_uri: redirectUri,
        };
        if (clientSecret) body.client_secret = clientSecret;
        if (codeVerifier) body.code_verifier = codeVerifier;

        const res = await fetch("http://localhost:3000/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Token exchange failed");
        }

        const data = await res.json();

        // Store tokens
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);

        // Refresh the auth context
        await refreshAccessToken();

        // Clean up session storage
        sessionStorage.removeItem("oauth_client_id");
        sessionStorage.removeItem("oauth_redirect_uri");
        sessionStorage.removeItem("pkce_code_verifier");
        sessionStorage.removeItem("oauth_client_secret");

        navigate("/dashboard");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshAccessToken]);

  if (loading) return <div>Processing login...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return <div>Redirecting...</div>;
};

export default Callback;
