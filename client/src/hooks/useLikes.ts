import { useContext } from "react";
import { LikeContext } from "../context/LikeContext";

export function useLikes() {
  return useContext(LikeContext);
}
