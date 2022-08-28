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
          comments={post.comments}
        />
      );
    });

  return (
    <main className="flex flex-col md:flex-row gap-10">
      <aside className="basis-2/5 p-2 md:p-4 max-w-md">
        <div className="flex gap-2">
          <div className="basis-1/3 max-w-profile">
            <img
              className="w-full"
              src={user?.avatar ?? "/public/images/default_avatar.png"}
              alt="profile-photo"
            />
          </div>
          <div className="basis-2/3 p-2 bg-gray-200 rounded-md">
            <p className="p-1 text-l">{user?.bio}</p>
          </div>
        </div>
      </aside>

      <section className="md:p-4 md:basis-2/3 lg:basis-2/5 container mx-auto lg:w-2/5">
        {loading ? (
          <h1 className="text-center text-xl font-bold">Loading</h1>
        ) : null}
        {error ? <p className="text-center text-xl font">{error}</p> : null}
        {!loading && !error && userDisplay}
      </section>
    </main>
  );
};

export default Profile;
