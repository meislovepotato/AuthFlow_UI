import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="orb orb-2" style={{ opacity: 0.2, top: "-50px", right: "-60px" }} />
      <div className="grid-bg" />

      <div className="auth-card">
        <div className="auth-badge">
          <span className="auth-badge-dot" />
          Free to start
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">
          Join developers already using AuthFlow
        </p>

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

          <button type="submit" className="btn-submit" disabled={loading || success}>
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