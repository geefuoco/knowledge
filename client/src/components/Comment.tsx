import { useRef, useState } from "react";
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
  const [showReplyButton, setShowReplyButton] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { getReplies, post, createNewComment } = usePost();
  const { user } = useAuth();
  const childComments = getReplies(id);
  const time = dateFormatter.format(Date.parse(createdAt));
  const replyRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleReply() {
    setShowReplyButton(false);
    if (post && user) {
      const { current } = replyRef;
      if (!current) {
        return;
      }
      const comment = await replyToComment(id, post.id, user.id, current.value);

      if (!comment) {
        return;
      }
      comment.user = user;
      createNewComment(comment);
    } else {
      console.error("Error: Could not find the user or post");
    }
  }

  const nestedComments =
    childComments &&
    childComments.length > 0 &&
    showReplies &&
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
    });

  const showRepliesButton = childComments && childComments.length > 0 && (
    <button
      className="text-sm cursor-pointer transition durtaion-200 ease-in hover:text-green-400"
      type="button"
      onClick={() => setShowReplies(!showReplies)}
    >
      {!showReplies ? "Show Replies" : "Hide Replies"}
    </button>
  );

  return (
    <div className="pl-2 md:pl-8 pt-2 border-l-2 border-gray-300">
      <div className="p-2 border-slate-500 border-2 rounded-md">
        <div className="flex justify-between">
          <div className="text-sm md:text-l font-bold px-2">{email}</div>
          <div className="px-2 text-xs md:text-sm">{time}</div>
        </div>
        <div className="pl-2 text-md md:text-l">{body}</div>
        <div className="flex justify-end p-2 gap-4">
          <div>{showRepliesButton}</div>
          <div className="px-2">
            <span
              className="font-bold cursor-pointer"
              onClick={() => setShowReplyButton(!showReplyButton)}
            >
              Reply
            </span>
          </div>
        </div>
      </div>
      <section>
        {showReplyButton && (
          <div className="p-2">
            <textarea
              className="block text-sm border-gray-400 border-2 w-full rounded-md"
              rows={4}
              ref={replyRef}
            />
            <br />
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
        {nestedComments}
      </section>
    </div>
  );
};

export default CommentComponent;
