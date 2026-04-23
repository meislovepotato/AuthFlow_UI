import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [meOutput, setMeOutput] = useState<Record<string, any> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const handleMe = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user info");
      }

      const json = await res.json();
      setMeOutput(json);
      setOpenDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching user info");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          AuthFlow — Dashboard
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Welcome! Click below to fetch your user information.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <GetAppIcon />}
            onClick={handleMe}
            disabled={!token || loading}
          >
            {loading ? "Loading..." : "Get My Info"}
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {token && (
          <Typography variant="caption" color="success.main" sx={{ display: "block", mb: 2 }}>
            ✓ Token loaded successfully
          </Typography>
        )}
      </Paper>

      {/* User Info Modal/Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Your User Information
          </Typography>
          <Button
            onClick={handleCloseDialog}
            size="small"
            sx={{
              minWidth: "auto",
              p: 0.5,
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          {meOutput && (
            <Box
              component="pre"
              sx={{
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
                fontFamily: "Courier, monospace",
                color: "grey.900",
                maxHeight: 300,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {JSON.stringify(meOutput, null, 2)}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}