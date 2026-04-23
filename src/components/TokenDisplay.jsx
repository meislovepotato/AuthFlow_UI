import { useAuth } from "../hooks/useAuth";

export const TokenDisplay = () => {
  const { user, accessToken, refreshToken, logout } = useAuth();

  return (
    <div style={{ marginTop: 20 }}>
      <h3>🔐 Token Debug</h3>

      <div>
        <strong>User:</strong>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div>
        <strong>Access Token:</strong>
        <textarea value={accessToken || ""} readOnly rows={4} style={{ width: "100%" }} />
      </div>

      <div>
        <strong>Refresh Token:</strong>
        <textarea value={refreshToken || ""} readOnly rows={4} style={{ width: "100%" }} />
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
};