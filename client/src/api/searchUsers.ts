import type { User } from "../config/types";
import { config } from "../config/config";

export async function searchUsers(username: string): Promise<User[] | null> {
  try {
    const data = {
      username,
    };
    const response = await fetch(`${config.SERVER}/api/v1/user/search`, {
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
