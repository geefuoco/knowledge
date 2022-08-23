import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>Authorized Route</h1>} />
          <Route path="/users" element={<h1>Users</h1>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
