import type { LikeCreateInfo } from "../api/createLike";
import { useState } from "react";
import { useLikes } from "../hooks/useLikes";
import { useAuth } from "../hooks/useAuth";
import { createLike } from "../api/createLike";
import { deleteLike } from "../api/deleteLike";

type LikeProps = {
  likes: number;
  type: "post" | "comment";
  parentId: number;
};

const Like: React.FC<LikeProps> = ({ likes, type, parentId }) => {
  const { user } = useAuth();
  const { checkIfLiked, getLike, setNewLike, removeLike } = useLikes();
  const [clicked, setClicked] = useState<boolean>(checkIfLiked(parentId, type));

  async function handleLike() {
    if (!clicked) {
      const result = await likePost();
      setClicked(result);
    } else {
      const result = await unlikePost();
      setClicked(!result);
    }
  }

  async function likePost(): Promise<boolean> {
    try {
      if (!user) {
        return false;
      }
      const likeInfo: LikeCreateInfo = { user_id: user.id };
      likeInfo[`${type}_id`] = parentId;
      const like = await createLike(likeInfo);
      if (like) {
        setNewLike(like);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async function unlikePost(): Promise<boolean> {
    try {
      if (!user) {
        return false;
      }
      const like = getLike(parentId, type);
      console.log("THIS IS LIKE: ", like);
      if (like) {
        const deletedLike = await deleteLike(like.id);
        if (!deletedLike) {
          console.error("Could not find the like to delete");
          return false;
        }
        removeLike(deletedLike.id);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  const src = clicked ? "/images/star-full.svg" : "/images/star.svg";
  return (
    <span className="cursor-pointer">
      <img className="inline pb-1" src={src} alt="star" onClick={handleLike} />
      {likes}
    </span>
  );
};

export default Like;
