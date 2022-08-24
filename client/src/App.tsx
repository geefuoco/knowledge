import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthProvider from "./components/AuthProvider";
import PostProvider from "./components/PostProvider";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Post from "./pages/Post";

import { useAuth } from "./hooks/useAuth";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const NotFound: React.FC = () => {
  return <h1 className="text-2xl font-bold">404: Not Found</h1>;
};

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Feed />} />
          <Route
            path="/post/:id"
            element={
              <PostProvider>
                <Post />
              </PostProvider>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
