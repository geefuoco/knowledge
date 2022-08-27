import { useState } from "react";

import type { Post } from "../config/types";
import { getPosts } from "../api/getPosts";
import { useAsync } from "../hooks/useAsync";
import PostItem from "../components/PostItem";

const Feed: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const {
    loading,
    error,
    value: posts,
  } = useAsync(() => getPosts(pageNumber), [pageNumber]);

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

  const postsDisplay =
    posts &&
    posts.length > 0 &&
    posts.map((post: Post) => {
      return (
        <PostItem
          id={post.id}
          key={post.id}
          username={post.user.username}
          body={post.body}
          createdAt={post.createdAt}
          comments={post.comments}
        />
      );
    });

  return <main className="container lg:w-2/5 mx-auto ">{postsDisplay}</main>;
};

export default Feed;
