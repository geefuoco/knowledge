import type { Post } from "../config/types";
import { config } from "../config/config";

export async function createPost(
  userId: number,
  text: string
): Promise<Post | null> {
  try {
    const data = {
      user_id: userId,
      body: text,
    };

    const response = await fetch(`${config.SERVER}/api/v1/posts`, {
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
