import type { Post } from "../config/types";
import { useFeed } from "../hooks/useFeed";
import PostItem from "../components/PostItem";

const Feed: React.FC = () => {
  const { posts } = useFeed();
  const postsDisplay =
    posts &&
    posts.length > 0 &&
    posts.map((post: Post) => {
      return <PostItem key={post.id} {...post} />;
    });

  return (
    <main className="container phone:w-5/6  md:w-3/5 lg:w-2/5 mx-auto ">
      {postsDisplay}
    </main>
  );
};

export default Feed;
