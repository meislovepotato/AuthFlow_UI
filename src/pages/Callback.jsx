import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("processing"); // processing | success | error
  const navigate = useNavigate();
  const { refreshAccessToken } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        setError("Missing authorization code");
        setStatus("error");
        setLoading(false);
        return;
      }

      const clientId = sessionStorage.getItem("oauth_client_id");
      const redirectUri = sessionStorage.getItem("oauth_redirect_uri");

      if (!clientId || !redirectUri) {
        setError("Missing OAuth2 configuration");
        setStatus("error");
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

        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);

        await refreshAccessToken();

        sessionStorage.removeItem("oauth_client_id");
        sessionStorage.removeItem("oauth_redirect_uri");
        sessionStorage.removeItem("pkce_code_verifier");
        sessionStorage.removeItem("oauth_client_secret");

        setStatus("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (err) {
        setError(err.message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshAccessToken]);

  return (
    <Container
      maxWidth="sm"
      sx={{ py: 12, display: "flex", minHeight: "80vh", alignItems: "center" }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 2, width: "100%", textAlign: "center" }}
      >
        {status === "processing" && (
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Processing Login...
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please wait while we complete your authentication
              </Typography>
            </Box>
          </Stack>
        )}

        {status === "success" && (
          <Stack spacing={3} alignItems="center">
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: "success.main",
              }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Login Successful!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Redirecting you to dashboard...
              </Typography>
            </Box>
          </Stack>
        )}

        {status === "error" && (
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: "error.main",
                  mb: 2,
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Authentication Failed
              </Typography>
            </Box>
            {error && (
              <Alert severity="error" sx={{ textAlign: "left" }}>
                {error}
              </Alert>
            )}
            <Typography variant="body2" color="textSecondary">
              Please try logging in again
            </Typography>
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default Callback;
