import type { Post } from "../config/types";
import { useState, useEffect, useMemo } from "react";
import { useFeed } from "../hooks/useFeed";
import { useAsyncFn } from "../hooks/useAsync";
import { getPosts } from "../api/getPosts";
import PostItem from "../components/PostItem";

const Feed: React.FC = () => {
  const { posts } = useFeed();
  const [allPosts, setAllPosts] = useState(posts);
  const [pageNumber, setPageNumber] = useState(2);
  const { value, execute } = useAsyncFn(
    () => getPosts(pageNumber),
    [pageNumber]
  );

  useEffect(() => {
    function handleNewPage() {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        console.log("hit the bottom");
        if (posts.length >= 20) {
          console.log("value ", value);
          console.log(pageNumber);
          setPageNumber((page) => page + 1);
          execute();
        }
      }
    }

    window.addEventListener("scroll", handleNewPage);
    if (value && value.length) {
      setAllPosts((old) => [...old, ...value]);
    } else {
      setAllPosts(posts);
    }

    return () => window.removeEventListener("scroll", handleNewPage);
  }, [posts, pageNumber]);

  const postsDisplay = useMemo(
    () =>
      allPosts.map((post: Post) => {
        return <PostItem key={post.id} {...post} />;
      }),
    [allPosts]
  );

  return (
    <main className="container phone:w-5/6 sm:w-3/5 sm:max-w-md mx-auto ">
      {postsDisplay}
    </main>
  );
};

export default Feed;
