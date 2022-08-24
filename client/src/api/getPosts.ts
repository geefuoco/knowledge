import { config } from "../config/config";

import type { Post } from "../config/types";

export async function getPosts(pageNumber: number): Promise<Post[] | null> {
  try {
    const response = await fetch(
      `${config.SERVER}/api/v1/posts?page=${pageNumber}`,
      {
        credentials: "include",
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
}
