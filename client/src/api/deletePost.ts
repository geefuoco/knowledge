import type { Post } from "../config/types";
import { config } from "../config/config";

export async function deletePost(id: number): Promise<Post | null> {
  try {
    const response = await fetch(`${config.SERVER}/api/v1/post/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
