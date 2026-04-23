import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Home = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Welcome to AuthFlow
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          Secure Authentication Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Choose an action to get started
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Login Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                elevation: 8,
                transform: "translateY(-4px)",
                boxShadow: `0 12px 24px ${theme.palette.primary.main}22`,
              },
            }}
          >
            <LoginIcon
              sx={{
                fontSize: 48,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Login
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Access your existing account
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                py: 1,
              }}
            >
              Login
            </Button>
          </Paper>
        </Grid>

        {/* Register Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                elevation: 8,
                transform: "translateY(-4px)",
                boxShadow: `0 12px 24px ${theme.palette.secondary.main}22`,
              },
            }}
          >
            <AppRegistrationIcon
              sx={{
                fontSize: 48,
                color: "secondary.main",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Register
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Create a new account
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                py: 1,
              }}
            >
              Register
            </Button>
          </Paper>
        </Grid>

        {/* Admin Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                elevation: 8,
                transform: "translateY(-4px)",
                boxShadow: `0 12px 24px ${theme.palette.warning.main}22`,
              },
            }}
          >
            <AdminPanelSettingsIcon
              sx={{
                fontSize: 48,
                color: "warning.main",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Administration & Settings
            </Typography>
            <Button
              component={RouterLink}
              to="/admin"
              variant="outlined"
              color="warning"
              fullWidth
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                py: 1,
              }}
            >
              Admin
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
