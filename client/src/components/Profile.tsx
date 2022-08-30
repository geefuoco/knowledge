import type { Post } from "../config/types";
import { useAsync } from "../hooks/useAsync";
import { getUserPosts } from "../api/getUserPosts";
import PostItem from "./PostItem";

type ProfileProps = {
  userId: number;
};

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const {
    loading,
    error,
    value: user,
  } = useAsync(() => getUserPosts(userId), [userId]);

  const userDisplay =
    user &&
    user.posts &&
    user.posts.length > 0 &&
    user.posts.map((post: Post) => {
      return (
        <PostItem
          id={post.id}
          key={post.id}
          username={user.username}
          body={post.body}
          createdAt={post.createdAt}
          comments={post._count?.comments || 0}
        />
      );
    });

  return (
    <main className="flex flex-col gap-10">
      <section className="md:p-4 md:basis-2/3 lg:basis-2/5 container mx-auto lg:w-2/5 border-t-gray-200 border-t-2">
        <section className="pb-2">
          <div className="flex gap-4 md:justify-between w-full">
            <div className="basis-1/3 max-w-profile">
              <img
                className="w-full"
                src={user?.avatar ?? "/images/default_avatar.png"}
                alt="profile-photo"
              />
            </div>
            <div className="basis-2/3 flex-grow p-2 bg-gray-200 rounded-md">
              <h3 className="text-l font-bold">{user?.username}</h3>
              <span>Bio:</span>
              <p className="p-1 text-l italic">
                {user?.bio || "Its a bit empty here"}
              </p>
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
  );
};

export default Profile;
