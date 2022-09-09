import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { createPost } from "../api/createPost";
import Search from "./Search";
import { useFeed } from "../hooks/useFeed";
import Modal from "./Modal";

const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, onLogout } = useAuth();
  const { createToast } = useToast();
  const { addPost } = useFeed();
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleCreateNewPost() {
    const { current } = textRef;
    if (user && current) {
      const post = await createPost(user.id, current.value);
      if (post && !("message" in post)) {
        addPost(post);
        createToast("Created post.", "success", true);
      } else {
        createToast("Error: Could not create post", "danger", false);
      }
    }
    setIsOpen(false);
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"New Post"}
        buttonText={"Create Post"}
        buttonCallback={handleCreateNewPost}
      >
        <textarea ref={textRef} rows={4} className="w-full p-1"></textarea>
      </Modal>
      <nav className="sticky top-0  text-white bg-slate-400">
        <div className="relative z-10 flex w-full h-full bg-slate-400 p-4">
          <div className="basis-1/3 flex-grow my-auto">
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
          {user && (
            <div className="hidden md:block basis-1/3">
              <Search />
            </div>
          )}
          <div className="basis-1/3 flex-grow justify-end hidden md:flex">
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
              <div className="flex gap-2 items-center">
                <a
                  className="py-2 px-3 text-md bg-slate-600 rounded-lg"
                  href="/profile"
                >
                  Profile
                </a>
                <button
                  className="py-2 px-3 whitespace-nowrap itext-md bg-slate-600 rounded-lg"
                  onClick={() => setIsOpen(true)}
                >
                  New Post
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="py-2 px-3 text-md bg-slate-600 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`text-white transition-all duration-500 ease-in-out absolute left-0 w-full bg-slate-400 md:hidden ${
            showDropdown ? "top-16" : "-top-80"
          }`}
        >
          {!user ? (
            <>
              <div className="text-md font-bold p-4 ">
                <Link to="/login" onClick={() => setShowDropdown(false)}>
                  Login
                </Link>
              </div>
              <div className="text-md font-bold p-4">
                <Link to="/register" onClick={() => setShowDropdown(false)}>
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-md font-bold p-4">
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  Profile
                </Link>
              </div>
              <div className="text-md font-bold p-4">
                <button
                  role="button"
                  className="block"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setShowDropdown(false);
                  }}
                >
                  New Post
                </button>
              </div>
              <div className="text-md font-bold p-4">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="block"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
