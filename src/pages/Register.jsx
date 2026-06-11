import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { apiPost, CODE_MAP, codeMessage } from "../utils/apiClient";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiPost("/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const errObj = /** @type {any} */ (err);
      const code = errObj?.errorCode || "SERVER_ERROR";
      if (code === "VALIDATION_ERROR") {
        const fieldMap = CODE_MAP.VALIDATION_ERROR(errObj);
        // show first field error as global as well
        setError(Object.values(fieldMap)[0] || "Validation error");
      } else if (code === "EMAIL_TAKEN") {
        setError(CODE_MAP.EMAIL_TAKEN());
      } else if (code === "ACCOUNT_LOCKED") {
        setError(CODE_MAP.ACCOUNT_LOCKED());
      } else if (code === "RATE_LIMITED" || code === "SERVER_ERROR") {
        showToast(codeMessage(code), "error");
        setError(codeMessage(code));
      } else {
        setError(errObj?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div
        className="orb orb-2"
        style={{ opacity: 0.2, top: "-50px", right: "-60px" }}
      />
      <div className="grid-bg" />

      <div className="auth-card">
        <div className="auth-badge">
          <span className="auth-badge-dot" />
          Free to start
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join developers already using AuthFlow</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✓</span> Account created — redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Email address</label>
            <input
              className="field-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Choose a strong password"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading || success}
          >
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          Already have an account?{" "}
          <RouterLink to="/login" className="auth-link">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
