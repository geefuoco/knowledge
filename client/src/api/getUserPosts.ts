import type { User } from "../config/types";
import { config } from "../config/config";

export async function getUserPosts(userId: number): Promise<User | null> {
  try {
    const response = await fetch(
      `${config.SERVER}/api/v1/user/${userId}/posts`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
