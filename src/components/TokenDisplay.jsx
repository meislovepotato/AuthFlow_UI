import { useAuth } from "../hooks/useAuth";

export const TokenDisplay = () => {
  const { user, accessToken, refreshToken } = useAuth();

  const initials = user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "??";

  return (
    <>
      {/* User section */}
      <div className="info-section">
        <div className="info-header">
          <span className="info-title">Authenticated user</span>
          <span className="info-badge">● Active</span>
        </div>
        <div className="user-row">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-email">{user?.email}</div>
            <div className="user-meta">Role: {user?.role ?? "user"} · ID: {user?.id ?? "usr.—"}</div>
          </div>
        </div>
      </div>

      {/* Access token */}
      <div className="info-section">
        <div className="info-header">
          <span className="info-title">Access token</span>
          <span className="info-badge info-badge-indigo">JWT · RS256</span>
        </div>
        <div className="token-pre">{accessToken || "—"}</div>
      </div>

      {/* Refresh token */}
      <div className="info-section">
        <div className="info-header">
          <span className="info-title">Refresh token</span>
          <span className="info-badge info-badge-indigo">Opaque</span>
        </div>
        <div className="token-pre">{refreshToken || "—"}</div>
      </div>
    </>
  );
};