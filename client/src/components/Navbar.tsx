import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, onLogout } = useAuth();
  return (
    <nav className="sticky bg-slate-400 p-5 flex text-white ">
      <div className="basis-1/2">
        <Link to="/">
          <h1 className="text-3xl">Knowledge</h1>
        </Link>
      </div>
      <div className="basis-1/2 flex justify-end">
        {!user ? (
          <Link
            to="/login"
            className="py-2 px-3 text-lg bg-slate-600 rounded-lg"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={onLogout}
            className="py-2 px-3 text-lg bg-slate-600 rounded-lg"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
