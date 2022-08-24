import { dateFormatter } from "../config/helpers";
import { usePost } from "../hooks/usePost";

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
  const { getReplies } = usePost();
  const childComments = getReplies(id);
  const time = dateFormatter.format(Date.parse(createdAt));
  return (
    <div className="shadow-md pl-2 pt-2 border-l-slate-200 border-l-2">
      <div className="flex text-xl font-bold px-2">{email}</div>
      <div className="pl-2 text-l">{body}</div>
      <div className="flex justify-end p-2">{time}</div>
      <section>
        {childComments &&
          childComments.length > 0 &&
          childComments.map((comment) => {
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
    </div>
  );
};

export default CommentComponent;
