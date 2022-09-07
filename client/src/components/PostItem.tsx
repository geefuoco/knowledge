import type { Post } from "../config/types";
import { Link } from "react-router-dom";
import { dateFormatter } from "../config/helpers";
import { useAuth } from "../hooks/useAuth";
import { useFeed } from "../hooks/useFeed";
import { useToast } from "../hooks/useToast";
import { deletePost } from "../api/deletePost";

import Like from "./Like";

const PostItem: React.FC<Post> = ({ id, body, user, createdAt, _count }) => {
  const { createToast } = useToast();
  const currentUser = useAuth().user;
  const { removePost } = useFeed();
  const time = dateFormatter.format(Date.parse(createdAt));

  if (!_count) {
    console.error("Error while fetching comments and likes");
  }
  const comments = _count?.comments;
  const likes = _count?.likes;
  async function handleRemovePost() {
    try {
      const result = await deletePost(id);
      if (result && !("message" in result)) {
        removePost(id);
        createToast("Post successfully deleted", "success", true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="pl-3 pt-3 shadow-md  bg-gray-200 border-b-2 border-b-gray-300">
      <div className="flex justify-between">
        <div className="md:text-xl p-3 font-bold">{user.username}</div>
        <div className="p-3">{time}</div>
      </div>
      <div className="text-l pl-3">{body}</div>
      <div className="flex justify-end gap-10">
        <div className="p-3 flex gap-3">
          <Like likes={likes ?? 0} type="post" parentId={id} />
          <span className="font-semibold">
            <Link to={`/post/${id}`}>
              Comments: {comments && comments > 0 ? comments : 0}
            </Link>
          </span>
          {currentUser && currentUser.id === user.id && (
            <span onClick={handleRemovePost} className="cursor-pointer">
              <img src="/images/trash.svg" alt="trash icon" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
