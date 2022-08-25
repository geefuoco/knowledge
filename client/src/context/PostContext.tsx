import type { PostContextType, Comment } from "../config/types";
import { createContext } from "react";

const defaultContext = {
  post: null,
  getReplies: () => new Array<Comment>(),
  getRootComments: new Array<Comment>(),
  createNewComment: (comment: Comment) => {},
};

export const PostContext = createContext<PostContextType>(defaultContext);
