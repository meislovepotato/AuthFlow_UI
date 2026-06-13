import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const initials = user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "??";

  return (
    <nav className="navbar">
      <RouterLink to="/" className="navbar-brand">
        <div className="navbar-logo">AF</div>
        <span className="navbar-name">AuthFlow</span>
      </RouterLink>

      <div className="navbar-links">
        {user ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {initials}
              </div>
              <span style={{ fontSize: 13, color: "var(--text)" }}>
                {user?.email || user?.name || "User"}
              </span>
            </div>
            <button className="btn btn-outline" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <RouterLink to="/login" className="btn btn-ghost">
              Sign in
            </RouterLink>
            <RouterLink to="/register" className="btn btn-primary">
              Get started
            </RouterLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
