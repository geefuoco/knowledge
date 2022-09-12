import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useFeed } from "../hooks/useFeed";
import { createPost } from "../api/createPost";
import { getSignedUrl } from "../api/getSignedUrl";
import { config } from "../config/config";

import Search from "./Search";
import Modal from "./Modal";

const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
  const { user, onLogout } = useAuth();
  const { createToast } = useToast();
  const { addPost } = useFeed();
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  async function handleCreateNewPost() {
    const { current } = textRef;
    const uploadedImage = uploadRef.current;
    if (user && current && uploadedImage) {
      if (current.value === "") {
        return;
      }
      const file = uploadedImage.files ? uploadedImage.files[0] : null;
      let imageUrl: string | null = null;
      if (file) {
        const response = await getSignedUrl();
        if (!response) {
          createToast("Error: Could not upload image", "danger", true);
          return;
        }

        const { url, fields } = response;
        const data: { [key: string]: any } = {
          ...fields,
          "Content-Type": file.type,
          file,
        };

        const formData = new FormData();

        for (let name in data) {
          formData.append(name, data[name]);
        }

        const bucketResponse = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (bucketResponse.status === 204 || bucketResponse.status === 200) {
          imageUrl = `https://${config.BUCKET}.s3.us-east-2.amazonaws.com/${fields.key}`;
        }
        //TODO: Test if this works
      }
      const post = await createPost(user.id, current.value, imageUrl);
      if (post && !("message" in post)) {
        addPost(post);
        createToast("Created post.", "success", true);
      } else {
        createToast("Error: Could not create post", "danger", false);
      }
    }
    setUploadImage("");
    setIsOpen(false);
  }

  function handleUploadImage() {
    const { current } = uploadRef;
    if (!current) {
      return;
    }
    const file = current.files ? current.files[0] : null;
    if (!file) {
      return;
    }
    setUploadImage(URL.createObjectURL(file));
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
        {uploadImage && (
          <div className="mb-2 max-h-36 overflow-y-scroll relative z-0 border-2 border-gray-200 rounded-sm">
            <span
              className="sticky left-0 top-0"
              onClick={() => {
                setUploadImage("");
                if (uploadRef.current && uploadRef.current.files) {
                  uploadRef.current.value = "";
                }
              }}
            >
              <img src="/images/close-rectangle.svg" alt="X" />
            </span>
            <img className="w-full" src={uploadImage} alt="uploaded image" />
          </div>
        )}
        <textarea
          ref={textRef}
          rows={4}
          className="w-full p-1 border-black block"
        ></textarea>
        <input type="file" ref={uploadRef} onChange={handleUploadImage} />
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
                <Search callback={() => setShowDropdown(false)} />
              </div>
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
