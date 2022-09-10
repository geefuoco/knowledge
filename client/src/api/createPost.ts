import type { Post } from "../config/types";
import { config } from "../config/config";

export async function createPost(
  userId: number,
  text: string,
  imageUrl: string | null
): Promise<Post | null> {
  try {
    const data = {
      user_id: userId,
      body: text,
      image: imageUrl,
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
