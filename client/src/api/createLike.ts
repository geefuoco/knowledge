import type { Like } from "../config/types";
import { config } from "../config/config";

export type LikeCreateInfo = {
  user_id: number;
  post_id?: number;
  comment_id?: number;
};

export async function createLike(
  likeInfo: LikeCreateInfo
): Promise<Like | null> {
  try {
    const response = await fetch(`${config.SERVER}/api/v1/likes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likeInfo),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
