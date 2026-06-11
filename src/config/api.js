const REMOTE = "https://authflow-b7i0.onrender.com";
const LOCAL = "http://localhost:3000";

const isLocalhost =
  typeof window !== "undefined" &&
  window.location &&
  window.location.hostname === "localhost";

export const API_BASE = isLocalhost ? LOCAL : REMOTE;
export const API_URL = `${API_BASE}/api/auth`;

export default API_URL;
