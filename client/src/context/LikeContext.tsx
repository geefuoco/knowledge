import { LikeContextType } from "../config/types";
import { createContext } from "react";

export const LikeContext = createContext<LikeContextType>({
  likes: [],
  checkIfLiked: () => false,
  getLike: () => undefined,
  setNewLike: () => undefined,
  removeLike: () => undefined,
});
