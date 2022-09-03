import type { Like } from "../config/types";
import { config } from "../config/config";

export async function getUserLikes(id: number): Promise<Like[] | null> {
  try {
    const response = await fetch(`${config.SERVER}/api/v1/user/${id}/likes`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await response.json();
    if (user && user.likes) {
      return user.likes;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
  return null;
}
