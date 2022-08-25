import type { Comment } from "../config/types";
import { config } from "../config/config";

export async function replyToComment(
  commentId: number,
  postId: number | null,
  userId: number | null,
  body: string
): Promise<Comment | null> {
  if (!postId) {
    return null;
  }
  try {
    const data = {
      parent_id: commentId,
      post_id: postId,
      user_id: userId,
      body,
    };

    const response = await fetch(`${config.SERVER}/api/v1/comments`, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
