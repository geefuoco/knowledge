import { useMemo } from "react";
import type { Comment, Post, CommentGroup } from "../config/types";
import { useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../api/getPost";

const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams();
  const {
    loading,
    error,
    value: post,
  } = useAsync(() => getPost(Number(id)), [id]);

  const commentsByParentId = useMemo(() => {
    const group: CommentGroup = {};
    (post as Post)?.comments?.forEach((comment) => {
      const key = comment.parent_id?.toString() || "root";
      group[key] ||= new Array<Comment>();
      group[key].push(comment);
    });
    return group;
  }, [post?.comments]);

  function getReplies(parentId: number) {
    return commentsByParentId[parentId];
  }

  let result;
  if (loading) {
    result = <h1>Loading..</h1>;
  } else if (error) {
    result = <h1>{error}</h1>;
  } else {
    result = children;
  }

  const contextValue = {
    post,
    getReplies,
    getRootComments: commentsByParentId["root"],
  };

  return (
    <PostContext.Provider value={contextValue}>{result}</PostContext.Provider>
  );
};

export default PostProvider;
