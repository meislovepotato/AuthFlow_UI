import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import {
  Overview,
  SecurityCenter,
  ApiKeys,
  Sessions,
} from "./dashboard/index.jsx";
import "./Dashboard.css";

const NAV = [
  { id: "overview", label: "Overview", icon: "⊞" },
  { id: "security", label: "Security Center", icon: "🛡" },
  { id: "keys", label: "API Keys", icon: "🔑" },
  { id: "sessions", label: "Active Sessions", icon: "💻" },
];

const PAGES = {
  overview: Overview,
  security: SecurityCenter,
  keys: ApiKeys,
  sessions: Sessions,
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState<PageKey>("overview");
  const Page = PAGES[page];

  type PageKey = keyof typeof PAGES;

  const initials = user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="dash-app">
      <aside className="dash-sidebar-icon">
        <div className="sb-logo">AF</div>

        {NAV.map((n) => (
          <button
            key={n.id}
            className={`sb-item ${page === n.id ? "active" : ""}`}
            title={n.label}
            onClick={() => setPage(n.id as PageKey)}
          >
            {n.icon}
          </button>
        ))}

        <div className="sb-spacer" />
        <button className="sb-avatar" title={user?.email} onClick={logout}>
          {initials}
        </button>
      </aside>

      <div className="dash-main-wrap">
        <header className="dash-topbar">
          <span className="topbar-crumb">AuthFlow</span>
          <span className="topbar-sep">›</span>
          <span className="topbar-title">
            {NAV.find((n) => n.id === page)?.label}
          </span>
          <div className="topbar-spacer" />
          <div className="pill pill-green">
            <span className="pulse" /> All systems normal
          </div>
        </header>

        <main className="dash-content">
          <Page />
        </main>
      </div>
    </div>
  );
}
