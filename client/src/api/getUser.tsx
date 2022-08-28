import type { User } from "../config/types";
import { config } from "../config/config";

export async function getUser(userId: number): Promise<User | null> {
  try {
    const response = await fetch(`${config}/api/v1/user/${userId}`, {
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
