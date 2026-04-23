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

function App() {
  return (
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
