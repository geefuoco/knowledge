import { useState } from "react";

import Modal from "./Modal";

type ImagePostProps = {
  src: string;
};

const ImagePost: React.FC<ImagePostProps> = ({ src }) => {
  const [showImage, setShowImage] = useState(false);
  return (
    <>
      <Modal title="" isOpen={showImage} setIsOpen={setShowImage}>
        <img src={src} alt={src} className="w-full" />
      </Modal>
      <div className="overflow-hidden p-1 pr-4">
        <img
          src={src}
          alt={src}
          className="w-fit rounded-md border-2 border-black"
          onClick={() => setShowImage(true)}
        />
      </div>
    </>
  );
};

export default ImagePost;
