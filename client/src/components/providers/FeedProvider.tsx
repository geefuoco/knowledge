import type { Post } from "../../config/types";
import { useState, useEffect, useMemo } from "react";
import { FeedContext } from "../../context/FeedContext";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { getPosts } from "../../api/getPosts";

const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  if (!user) {
    return <>{children}</>;
  }
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, error, value } = useAsync(() => getPosts(1), []);

  useEffect(() => {
    if (value) {
      setPosts(value);
    }
  }, [value]);

  const contextValue = useMemo(
    () => ({
      posts,
      addPost,
      removePost,
      setPosts,
    }),
    [posts]
  );

  if (loading) {
    return (
      <h1 className="container mx-auto font-bold text-center text-xl">
        Loading
      </h1>
    );
  }

  if (error) {
    return (
      <h1 className="text-xl text-center">Oops ! Could not load any posts</h1>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  function addPost(post: Post) {
    setPosts([post, ...posts]);
  }

  function removePost(id: number) {
    setPosts(posts.filter((p) => p.id !== id));
  }

  return (
    <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
  );
};

export default FeedProvider;
