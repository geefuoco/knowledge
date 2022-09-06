import type { FeedContextType } from "../config/types";
import { createContext } from "react";

export const FeedContext = createContext<FeedContextType>({
  posts: [],
  addPost: () => undefined,
  removePost: () => undefined,
  pageNumber: 1,
  setPageNumber: () => undefined,
});
