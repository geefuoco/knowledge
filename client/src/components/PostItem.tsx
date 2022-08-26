import { Link } from "react-router-dom";
import { dateFormatter } from "../config/helpers";
import type { Comment } from "../config/types";

type PostProps = {
  id: number;
  email: string;
  body: string;
  createdAt: string;
  comments?: Comment[] | null;
};

const PostItem: React.FC<PostProps> = ({
  id,
  email,
  body,
  createdAt,
  comments,
}) => {
  const time = dateFormatter.format(Date.parse(createdAt));
  return (
    <div className="pl-3 pt-3 shadow-md  bg-gray-200 border-b-2 border-b-gray-300">
      <div className="flex justify-between">
        <div className="text-md md:text-xl p-3 font-bold">{email}</div>
        <div className="text-sm p-3">{time}</div>
      </div>
      <div className="text-l pl-3">{body}</div>
      <div className="flex justify-end gap-10">
        <div className="p-3">
          {comments && (
            <span className="font-semibold">
              <Link to={`/post/${id}`}>Comments: {comments.length}</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
