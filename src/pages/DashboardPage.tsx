import useAuth from "@features/auth/hooks/useAuth";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>User: {user?.username}</p>
      <p>Role: {user?.role}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
