import { dateFormatter } from "../config/helpers";
import CommentComponent from "../components/Comment";
import { usePost } from "../hooks/usePost";

const Post: React.FC = () => {
  const { post, getRootComments } = usePost();

  if (!post) {
    return <h1>Error loading post</h1>;
  }

  const time = dateFormatter.format(Date.parse(post.createdAt));

  return (
    <main className="container mx-auto h-full shadow-lg">
      <div className="p-4">
        <div className="font-bold text-2xl">{post.user.email}</div>
        <div className="text-xl">{post.body}</div>
        <div className="text-l">{time}</div>
      </div>
      <section>
        {getRootComments &&
          getRootComments.length > 0 &&
          getRootComments.map((comment) => {
            return (
              <CommentComponent
                id={comment.id}
                key={comment.id}
                email={comment.user.email}
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
