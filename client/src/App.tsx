import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthProvider from "./components/AuthProvider";
import PostProvider from "./components/PostProvider";
import ToastProvider from "./components/ToastProvider";
import LikeProvider from "./components/LikeProvider";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
import SearchResult from "./components/SearchResult";
import { useAuth } from "./hooks/useAuth";
import UserProfile from "./pages/UserProfile";
import PersonalProfile from "./pages/PersonalProfile";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <LikeProvider>
      <Outlet />
    </LikeProvider>
  );
};

const NotFound: React.FC = () => {
  return <h1 className="text-2xl font-bold">404: Not Found</h1>;
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
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
            <Route path="/user/search" element={<SearchResult />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/profile" element={<PersonalProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
