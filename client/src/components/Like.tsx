import { useState } from "react";

type LikeProps = {
  likes: number;
};

const Like: React.FC<LikeProps> = ({ likes }) => {
  const [clicked, setClicked] = useState(false);

  async function handleLike() {
    if (!clicked) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }

  const src = clicked ? "images/star-full.svg" : "/images/star.svg";
  return (
    <span className="cursor-pointer">
      <img className="inline pb-1" src={src} alt="star" onClick={handleLike} />
      {likes}
    </span>
  );
};

export default Like;
