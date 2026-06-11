import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { TokenDisplay } from "../components/TokenDisplay";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-section-label">Main</div>
        <RouterLink to="/dashboard" className="sidebar-item active">
          <span className="sidebar-dot" /> Overview
        </RouterLink>
        <a href="#" className="sidebar-item">
          <span className="sidebar-dot" /> Profile
        </a>
        <a href="#" className="sidebar-item">
          <span className="sidebar-dot" /> Sessions
        </a>

        <div className="sidebar-section-label">Security</div>
        <a href="#" className="sidebar-item">
          <span className="sidebar-dot" /> Tokens
        </a>
        <a href="#" className="sidebar-item">
          <span className="sidebar-dot" /> OAuth Apps
        </a>
        <RouterLink to="/admin" className="sidebar-item">
          <span className="sidebar-dot" /> Admin Panel
        </RouterLink>

        <div className="sidebar-spacer" />
        <button className="btn btn-danger btn-full" onClick={logout}>
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <div className="dash-header">
          <h1 className="dash-welcome">
            Good to see you, {user?.email?.split("@")[0]} 👋
          </h1>
          <p className="dash-sub">Here's what's happening with your account</p>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Active sessions</div>
            <div className="stat-value">1</div>
            <div className="stat-sub">↑ Current device</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Token expires in</div>
            <div className="stat-value">
              59<span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 400 }}>m</span>
            </div>
            <div className="stat-sub" style={{ color: "var(--accent2)" }}>Auto-refresh on</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Role</div>
            <div className="stat-value" style={{ fontSize: 20 }}>User</div>
            <div className="stat-sub">Standard access</div>
          </div>
        </div>

        {/* Token debug */}
        <TokenDisplay />
      </main>
    </div>
  );
};

export default Dashboard;