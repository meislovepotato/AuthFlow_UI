import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid-bg" />

      <div className="home-content">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Secure by default
        </div>

        <h1 className="home-title">
          Auth that gets<br />
          out of <span className="home-title-gradient">your way</span>
        </h1>

        <p className="home-sub">
          Production-ready authentication with JWT, PKCE OAuth, and
          role-based access — built for developers who ship.
        </p>

        <div className="home-actions">
          <RouterLink to="/register" className="btn btn-primary btn-lg">
            Create account
          </RouterLink>
          <RouterLink to="/login" className="btn btn-outline btn-lg">
            Sign in
          </RouterLink>
        </div>

        <div className="feature-cards">
          <div className="feat-card">
            <div className="feat-icon">🔐</div>
            <div className="feat-title">PKCE OAuth</div>
            <div className="feat-desc">Authorization code flow with S256 challenge</div>
          </div>
          <div className="feat-card">
            <div className="feat-icon">⚡</div>
            <div className="feat-title">JWT Tokens</div>
            <div className="feat-desc">Access + refresh token rotation out of the box</div>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🛡️</div>
            <div className="feat-title">Role Guards</div>
            <div className="feat-desc">Fine-grained route protection via AuthGuard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;