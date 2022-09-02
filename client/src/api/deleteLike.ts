import type { Like } from "../config/types";
import { config } from "../config/config";

export async function deleteLike(id: number): Promise<Like | null> {
  try {
    const response = await fetch(`${config.SERVER}/api/v1/like/${id}`, {
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
