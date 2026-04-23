import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const AdminPanel = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <AdminPanelSettingsIcon
            sx={{
              fontSize: 40,
              color: "warning.main",
              mr: 2,
            }}
          />
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              Admin Panel
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome, Administrator!
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* User Status */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label="Role: Admin"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Status: Active"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        {/* User Data */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            User Information
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1.5,
            }}
          >
            <Box
              component="pre"
              sx={{
                overflow: "auto",
                fontSize: "0.875rem",
                fontFamily: "Courier, monospace",
                color: "grey.900",
                m: 0,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                maxHeight: 400,
              }}
            >
              {JSON.stringify(user, null, 2)}
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
