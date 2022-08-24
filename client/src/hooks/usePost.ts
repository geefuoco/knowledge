import { PostContext } from "../context/PostContext";
import { useContext } from "react";

export function usePost() {
  return useContext(PostContext);
}
