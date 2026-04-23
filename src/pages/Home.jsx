import { Link } from "react-router-dom";
import "../style.css";

const Home = () => {
  return (
    <div className="page center">
      <h1>Welcome</h1>

      <p className="muted">Choose an action to get started</p>

      <div className="actions">
        <Link className="btn" to="/login">
          Login
        </Link>
        <Link className="btn ghost" to="/register">
          Register
        </Link>
        <Link className="btn outline" to="/admin">
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Home;
