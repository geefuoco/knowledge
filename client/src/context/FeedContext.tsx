import type { FeedContextType, Post } from "../config/types";
import { createContext } from "react";

export const FeedContext = createContext<FeedContextType>({
  posts: [],
  addPost: (post: Post) => undefined,
  removePost: () => undefined,
  setPosts: () => undefined,
});
