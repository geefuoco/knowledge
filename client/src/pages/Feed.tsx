import type { Post } from "../config/types";
import { useState, useEffect, useMemo } from "react";
import { useFeed } from "../hooks/useFeed";
import { useAsync } from "../hooks/useAsync";
import { getPosts } from "../api/getPosts";
import PostItem from "../components/PostItem";

const Feed: React.FC = () => {
  const { posts, setPosts } = useFeed();
  const [pageNumber, setPageNumber] = useState(2);
  const [canScroll, setCanScroll] = useState(false);
  const { value: newPosts } = useAsync(
    () => getPosts(pageNumber),
    [pageNumber]
  );

  useEffect(() => {
    if (posts.length >= 20) {
      setCanScroll(true);
    } else {
      setCanScroll(false);
    }
  }, [posts]);

  useEffect(() => {
    function handleNewPage() {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight &&
        canScroll &&
        newPosts &&
        newPosts.length
      ) {
        setPageNumber((page) => page + 1);
        setPosts((old) => [...old, ...newPosts]);
      }
    }

    window.addEventListener("scroll", handleNewPage);
    return () => window.removeEventListener("scroll", handleNewPage);
  }, [newPosts]);

  const postsDisplay = useMemo(
    () =>
      posts.map((post: Post) => {
        return <PostItem key={post.id} {...post} />;
      }),
    [posts]
  );

  return (
    <main className="container phone:w-5/6 sm:w-3/5 sm:max-w-md mx-auto ">
      {postsDisplay}
    </main>
  );
};

export default Feed;
