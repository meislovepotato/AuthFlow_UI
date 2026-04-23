import { useAuth } from "../hooks/useAuth";

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>🛠 Admin Panel</h1>
      <p>Welcome, Admin!</p>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default AdminPanel;
