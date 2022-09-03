import type { Like } from "../config/types";
import { useState, useEffect } from "react";
import { LikeContext } from "../context/LikeContext";
import { useAuth } from "../hooks/useAuth";
import { getUserLikes } from "../api/getUserLikes";

const LikeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    async function setupLikes() {
      if (user) {
        const likes = await getUserLikes(user.id);
        setLikes(likes ?? []);
      }
    }
    setupLikes();
  }, [user?.likes]);

  function checkIfLiked(id: number, type: "post" | "comment"): boolean {
    return likes.find((like) => like[`${type}_id`] === id) !== undefined;
  }

  function getLike(id: number, type: "post" | "comment"): Like | undefined {
    return likes.find((like) => like[`${type}_id`] === id);
  }

  function setNewLike(newLike: Like) {
    setLikes([...likes, newLike]);
  }

  function removeLike(id: number) {
    setLikes(likes.filter((like) => like.id !== id));
  }

  const contextValue = {
    likes,
    checkIfLiked,
    getLike,
    setNewLike,
    removeLike,
  };

  return (
    <LikeContext.Provider value={contextValue}>{children}</LikeContext.Provider>
  );
};

export default LikeProvider;
