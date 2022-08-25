import { useEffect, useRef, useState } from "react";
import { dateFormatter } from "../config/helpers";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../hooks/useAuth";
import { replyToComment } from "../api/replyToComment";

type CommentProps = {
  id: number;
  email: string;
  body: string;
  createdAt: string;
};

const CommentComponent: React.FC<CommentProps> = ({
  id,
  email,
  body,
  createdAt,
}) => {
  const [showReply, setShowReply] = useState(false);
  const { getReplies, post, createNewComment } = usePost();
  const { user } = useAuth();
  const childComments = getReplies(id);
  const time = dateFormatter.format(Date.parse(createdAt));
  const replyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {}, [childComments]);

  async function handleReply() {
    setShowReply(false);
    if (post && user) {
      const { current } = replyRef;
      if (!current) {
        return;
      }
      const comment = await replyToComment(id, post.id, user, current.value);

      if (!comment) {
        return;
      }
      console.log(comment);
      createNewComment(comment);
    } else {
      console.error("Error: Could not find the user or post");
    }
  }

  return (
    <div className="shadow-md pl-2 pt-2 border-l-slate-200 border-l-2">
      <div className="flex justify-between">
        <div className="text-xl font-bold px-2">{email}</div>
        <div className="px-2">{time}</div>
      </div>
      <div className="pl-2 text-l">{body}</div>
      <div className="flex justify-end p-2">
        <div className="px-2">
          <span
            className="font-bold cursor-pointer"
            onClick={() => setShowReply(!showReply)}
          >
            Reply
          </span>
        </div>
      </div>
      <section>
        {showReply && (
          <div className="p-2">
            <textarea
              className="block text-sm border-slate-100 border-2 w-full my-2"
              rows={4}
              ref={replyRef}
            />
            <div className="flex justify-end">
              <button
                className="p-2 text-md bg-blue-500 text-white rounded-md transition ease-in-out duration-200 hover:bg-blue-400"
                onClick={handleReply}
              >
                Send
              </button>
            </div>
          </div>
        )}
        {childComments &&
          childComments.length > 0 &&
          childComments.map((comment) => {
            return (
              <CommentComponent
                id={comment.id}
                key={comment.id}
                email={comment.user?.email}
                body={comment.body}
                createdAt={comment.createdAt}
              />
            );
          })}
      </section>
    </div>
  );
};

export default CommentComponent;
