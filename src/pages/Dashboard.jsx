import { useAuth } from "../hooks/useAuth";
import { TokenDisplay } from "../components/TokenDisplay";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>📊 Dashboard</h1>

      <p>Welcome {user?.email}</p>

      <TokenDisplay />
    </div>
  );
};
