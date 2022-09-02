import { useRef, useState } from "react";
import { dateFormatter } from "../config/helpers";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../hooks/useAuth";
import { replyToComment } from "../api/replyToComment";
import { useToast } from "../hooks/useToast";
import Like from "./Like";

type CommentProps = {
  id: number;
  username: string;
  body: string;
  createdAt: string;
  likes?: number;
};

const CommentComponent: React.FC<CommentProps> = ({
  id,
  username,
  body,
  createdAt,
  likes,
}) => {
  const [showReplyButton, setShowReplyButton] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { getReplies, post, createNewComment } = usePost();
  const { createToast } = useToast();
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

      if (!comment || "message" in comment) {
        createToast("Error: could not create comment.", "danger", true);
        return;
      }
      comment.user = user;
      createNewComment(comment);
      createToast("Created comment.", "success", true);
    } else {
      console.error("Error: Could not find the user or post");
      createToast("Error: could not create comment.", "danger", true);
    }
  }

  function handleClickShowReplies() {
    if (showReplies) {
      setShowReplies(false);
    } else {
      setShowReplies(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
          username={comment.user?.username}
          body={comment.body}
          createdAt={comment.createdAt}
          likes={comment._count?.likes}
        />
      );
    });

  const showRepliesButton = childComments && childComments.length > 0 && (
    <button
      className="text-sm cursor-pointer transition durtaion-200 ease-in hover:text-green-400"
      type="button"
      onClick={handleClickShowReplies}
    >
      {!showReplies ? "Show Replies" : "Hide Replies"}
    </button>
  );

  return (
    <div className="pl-2 md:pl-4 lg:pl-6 pt-2 border-l-2 border-gray-300">
      <div className="p-2 border-slate-500 border-2 rounded-md">
        <div className="flex justify-between">
          <div className="text-sm md:text-l font-bold px-2">{username}</div>
          <div className="px-2 text-xs md:text-sm">{time}</div>
        </div>
        <div className="pl-2 text-md md:text-l">{body}</div>
        <div className="flex justify-end p-2 gap-4">
          <div>{showRepliesButton}</div>
          <div className="px-2 flex gap-3">
            <Like likes={likes || 0} />
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
