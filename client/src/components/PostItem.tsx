import { Link } from "react-router-dom";
import { dateFormatter } from "../config/helpers";
import Like from "./Like";

type PostProps = {
  id: number;
  username: string;
  body: string;
  createdAt: string;
  comments: number;
  likes: number;
};

const PostItem: React.FC<PostProps> = ({
  id,
  username,
  body,
  createdAt,
  comments,
  likes,
}) => {
  const time = dateFormatter.format(Date.parse(createdAt));
  return (
    <div className="pl-3 pt-3 shadow-md  bg-gray-200 border-b-2 border-b-gray-300">
      <div className="flex justify-between">
        <div className="md:text-xl p-3 font-bold">{username}</div>
        <div className="p-3">{time}</div>
      </div>
      <div className="text-l pl-3">{body}</div>
      <div className="flex justify-end gap-10">
        <div className="p-3 flex gap-3">
          <Like likes={likes} />
          <span className="font-semibold">
            <Link to={`/post/${id}`}>
              Comments: {comments > 0 ? comments : 0}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
