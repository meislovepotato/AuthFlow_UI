import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./dashboard";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Callback from "./pages/Callback.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthGuard from "./components/AuthGuard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/callback" element={<Callback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AuthGuard requiredRoleId="admin-role-id">
                  <AdminPanel />
                </AuthGuard>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
