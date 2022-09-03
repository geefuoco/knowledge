import type { Post } from "../config/types";
import { Link } from "react-router-dom";
import { dateFormatter } from "../config/helpers";
import Like from "./Like";

const PostItem: React.FC<Post> = ({ id, body, user, createdAt, _count }) => {
  if (!_count) {
    return null;
  }
  const { comments, likes } = _count;
  const time = dateFormatter.format(Date.parse(createdAt));
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
        </div>
      </div>
    </div>
  );
};

export default PostItem;
