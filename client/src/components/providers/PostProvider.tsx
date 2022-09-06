import { useMemo, useState, useEffect } from "react";
import type { Comment, CommentGroup } from "../../config/types";
import { useParams } from "react-router-dom";
import { PostContext } from "../../context/PostContext";
import { useAsync } from "../../hooks/useAsync";
import { getPost } from "../../api/getPost";

const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams();
  const {
    loading,
    error,
    value: post,
  } = useAsync(() => getPost(Number(id)), [id]);
  const [comments, setComments] = useState<Comment[]>([]);

  const commentsByParentId = useMemo(() => {
    const group: CommentGroup = {};
    comments.forEach((comment) => {
      const key = comment.parent_id?.toString() || "root";
      group[key] ||= new Array<Comment>();
      group[key].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.comments) {
      setComments(post.comments);
    }
  }, [post?.comments, post?._count]);

  function getReplies(parentId: number) {
    return commentsByParentId[parentId];
  }

  function createNewComment(comment: Comment) {
    setComments([...comments, comment]);
  }

  let result;
  if (loading) {
    result = (
      <h1 className="container mx-auto font-bold text-center text-xl">
        Loading
      </h1>
    );
  } else if (error) {
    result = <h1>{error}</h1>;
  } else {
    result = children;
  }

  const contextValue = {
    post,
    getReplies,
    getRootComments: commentsByParentId["root"],
    createNewComment,
  };

  return (
    <PostContext.Provider value={contextValue}>{result}</PostContext.Provider>
  );
};

export default PostProvider;
