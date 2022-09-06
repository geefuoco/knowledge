import { useContext } from "react";
import { FeedContext } from "../context/FeedContext";

export function useFeed() {
  return useContext(FeedContext);
}
