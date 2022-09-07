import type { Like } from "../../config/types";
import { useState, useEffect } from "react";
import { LikeContext } from "../../context/LikeContext";
import { useAuth } from "../../hooks/useAuth";
import { getUserLikes } from "../../api/getUserLikes";
import { useAsync } from "../../hooks/useAsync";

const LikeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>([]);
  const {
    loading,
    error,
    value: userLikes,
  } = useAsync(() => getUserLikes(user?.id || -1), [user?.id]);

  useEffect(() => {
    if (userLikes) {
      setLikes(userLikes);
    }
  }, [user?.likes, userLikes]);

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
  let result;
  if (loading) {
    result = (
      <h1 className="container mx-auto font-bold text-center text-xl">
        Loading
      </h1>
    );
  } else if (error) {
    result = <h1>{error}</h1>;
  } else {
    result = children;
  }

  return (
    <LikeContext.Provider value={contextValue}>{result}</LikeContext.Provider>
  );
};

export default LikeProvider;
