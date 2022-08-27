import { useState, useRef } from "react";
import { dateFormatter } from "../config/helpers";
import CommentComponent from "../components/Comment";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { replyToPost } from "../api/replyToPost";

const Post: React.FC = () => {
  const [showReply, setShowReply] = useState(false);
  const { post, getRootComments, createNewComment } = usePost();
  const { user } = useAuth();
  const { createToast } = useToast();
  const replyRef = useRef<HTMLTextAreaElement | null>(null);

  if (!post) {
    return <h1>Error loading post</h1>;
  }

  const time = dateFormatter.format(Date.parse(post.createdAt));

  async function handleReply() {
    setShowReply(false);
    if (post && user) {
      const { current } = replyRef;
      if (!current) {
        return;
      }
      const comment = await replyToPost(post.id, user.id, current.value);

      if (!comment || "message" in comment) {
        createToast("Error: Could not post reply", "danger", true);
        return;
      }
      comment.user = user;
      createNewComment(comment);
      createToast("Comment Successfully created!", "success", true);
    } else {
      console.error("Error: Could not find the user or post");
      createToast("Error: Could not post reply", "danger", true);
    }
  }

  return (
    <main className="container mx-auto lg:w-2/5 mb-2">
      <div className="p-4 bg-gray-200 rounded-md">
        <div className=" flex justify-between gap-8">
          <div className="font-bold text-xl md:text-2xl">
            {post.user.username}
          </div>
          <div className="pt-2 text-sm">{time}</div>
        </div>
        <div className="text-l md:text-xl">{post.body}</div>
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
      </div>
      <section className="p-1">
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
        {getRootComments &&
          getRootComments.length > 0 &&
          getRootComments.map((comment) => {
            return (
              <CommentComponent
                id={comment.id}
                key={comment.id}
                username={comment.user.username}
                body={comment.body}
                createdAt={comment.createdAt}
              />
            );
          })}
      </section>
    </main>
  );
};

export default Post;
