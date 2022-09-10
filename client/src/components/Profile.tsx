import type { Post } from "../config/types";
import { config } from "../config/config";
import { useAsync } from "../hooks/useAsync";
import { getUserPosts } from "../api/getUserPosts";
import { updateUser } from "../api/updateUser";
import PostItem from "./PostItem";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { FormEvent, useRef, useState } from "react";
import Modal from "./Modal";
import { getSignedUrl } from "../api/getSignedUrl";

type ProfileProps = {
  userId: number;
};

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const auth = useAuth();
  const { createToast } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const profilePhotoRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    loading,
    error,
    value: user,
  } = useAsync(() => getUserPosts(userId), [userId]);

  function handleToggleModal() {
    setIsOpen(true);
  }

  function handleToggleUpdate() {
    const form = formRef.current;
    const p = pRef.current;

    if (!p || !form) {
      return;
    }

    p.classList.toggle("hidden");
    form.classList.toggle("hidden");
    form.classList.toggle("block");
  }

  async function handleChangeProfilePhoto() {
    try {
      const { current } = profilePhotoRef;
      const avatar = avatarRef.current;
      if (!current || !avatar) {
        return;
      }
      const file = current.files ? current.files[0] : null;
      if (!file) {
        createToast("Error: No photo provided", "warning", true);
        return;
      }
      if (file.size > 3_500_000) {
        createToast("Error: File too large. (Max 3.5Mb)", "danger", true);
        return;
      }
      const signedUrl = await getSignedUrl();
      if (!signedUrl) {
        createToast("Error: Could not upload photo", "danger", true);
        return;
      }

      const { url, fields } = signedUrl;

      const data: { [key: string]: any } = {
        ...fields,
        "Content-Type": file.type,
        file,
      };

      const formData = new FormData();

      for (let name in data) {
        formData.append(name, data[name]);
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.status === 204 || response.status === 200) {
        if (auth.user) {
          //NOTE: Since this is a profile photo, it should possibly be replacing the old photo -- perhaps use user email uuid?
          const imageUrl = `https://${config.BUCKET}.s3.us-east-2.amazonaws.com/${fields.key}`;
          const user = await updateUser({ id: auth.user.id, avatar: imageUrl });
          if (user && "avatar" in user) {
            avatar.src = imageUrl;
            createToast("Updated avatar", "success", true);
            setIsOpen(false);
          }
        }
      } else {
        createToast("Error: Could not upload photo", "danger", true);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateProfile(ev: FormEvent) {
    try {
      ev.preventDefault();
      const { current } = textRef;
      const form = formRef.current;
      const p = pRef.current;

      if (!current || !form || !p) {
        return;
      }

      if (auth.user) {
        handleToggleUpdate();
        const user = await updateUser({ id: auth.user.id, bio: current.value });
        if (user && "bio" in user) {
          p.innerText = current.value;
          createToast("Profile updated", "success", true);
        }
      } else {
        createToast("Error: Could not update", "danger", false);
      }
    } catch (error) {
      console.error(error);
      createToast("Error: Could not update", "danger", false);
    }
  }

  const userDisplay =
    user &&
    user.posts &&
    user.posts.length > 0 &&
    user.posts.map((post: Post) => {
      return <PostItem {...post} user={user} key={post.id} />;
    });

  return (
    <>
      <Modal
        buttonText={"Upload"}
        buttonCallback={handleChangeProfilePhoto}
        title={"Change Profile Photo"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <input
          ref={profilePhotoRef}
          type="file"
          accept="image/png, image/jpg"
        />
      </Modal>
      <main className="flex flex-col gap-10">
        <section className="md:p-4 md:basis-2/3 lg:basis-2/5 container mx-auto lg:w-2/5 border-t-gray-200 border-t-2">
          <section className="pb-2">
            <div className="flex gap-4 md:justify-between w-full">
              <div className="basis-1/3 max-w-profile">
                <img
                  className="w-full cursor-pointer"
                  src={user?.avatar ?? "/images/default_avatar.png"}
                  ref={avatarRef}
                  alt="profile-photo"
                  onClick={handleToggleModal}
                />
              </div>
              <div className="basis-2/3 flex-grow p-2 bg-gray-200 rounded-md">
                <div className="flex justify-between">
                  <h3 className="text-l font-bold">{user?.username}</h3>
                  {auth.user?.id === userId ? (
                    <button
                      className="px-2 py-1 text-white bg-blue-600 text-md rounded-md"
                      onClick={handleToggleUpdate}
                    >
                      Edit Profile
                    </button>
                  ) : null}
                </div>
                <span>Bio:</span>
                <p className="p-1 text-l italic" ref={pRef}>
                  {user?.bio || "Its a bit empty here"}
                </p>
                <form
                  className="hidden"
                  ref={formRef}
                  onSubmit={handleUpdateProfile}
                >
                  <textarea rows={4} className="w-full p-2" ref={textRef} />
                  <button
                    className="text-white bg-blue-600 px-2 py-1 rounded-md block ml-auto w-1/5"
                    type="submit"
                  >
                    Done
                  </button>
                </form>
              </div>
            </div>
          </section>
          {loading ? (
            <h1 className="text-center text-xl font-bold">Loading</h1>
          ) : null}
          {error ? <p className="text-center text-xl font">{error}</p> : null}
          {userDisplay ? (
            userDisplay
          ) : (
            <h2 className="text-center font-light">Nothing to see here!</h2>
          )}
        </section>
      </main>
    </>
  );
};

export default Profile;
