import type { User, UserUpdateOptions } from "../config/types";
import { config } from "../config/config";

export async function updateUser(
  userInfo: UserUpdateOptions
): Promise<User | null> {
  try {
    const response = await fetch(
      `${config.SERVER}/api/v1/user/${userInfo.id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
