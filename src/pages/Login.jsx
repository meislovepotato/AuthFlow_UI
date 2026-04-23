import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { generateCodeVerifier, generateCodeChallenge } from "../pkce";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const loginPayload = {
      email,
      password,
    };

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
        setError("Login failed");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: `0 10px 40px ${theme.palette.primary.main}15`,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                bgcolor: "primary.light",
              }}
            >
              <LoginIcon sx={{ fontSize: 32, color: "primary.main" }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign in to your account
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              placeholder="you@example.com"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              placeholder="••••••••"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Stack>
        </form>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
