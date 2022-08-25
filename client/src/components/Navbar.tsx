import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, onLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky bg-slate-400 p-5 flex text-white ">
      <div className="basis-1/2">
        <Link to="/">
          <h1 className="text-3xl">Knowledge</h1>
        </Link>
      </div>
      <div className="basis-1/2 flex justify-end md:hidden">
        <button
          className="flex flex-col gap-1 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
          type="button"
        >
          <div className="py-1 px-4 bg-white rounded-sm"></div>
          <div className="py-1 px-4 bg-white rounded-sm"></div>
          <div className="py-1 px-4 bg-white rounded-sm"></div>
        </button>
      </div>
      <div className="basis-1/2 justify-end hidden md:flex">
        {!user ? (
          <div className="flex gap-8">
            <Link
              to="/login"
              className="py-1 px-3 text-md md:text-lg bg-slate-600 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="py-1 px-3 text-md md:text-lg bg-slate-600 rounded-lg"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="py-1 px-3 text-lg bg-slate-600 rounded-lg"
          >
            Logout
          </button>
        )}
      </div>
      {showDropdown && (
        <div className="absolute top-16 left-0 w-full bg-slate-400 md:hidden">
          {!user ? (
            <>
              <div className="text-md font-bold py-2 px-4">
                <Link to="/login" onClick={() => setShowDropdown(false)}>
                  Login
                </Link>
              </div>
              <div className="text-md font-bold py-2 px-4">
                <Link to="/register" onClick={() => setShowDropdown(false)}>
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <div className="text-md font-bold py-2 px-4">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
