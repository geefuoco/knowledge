import { useRef, useEffect } from "react";

type ModalProps = {
  title: string;
  buttonText?: string;
  children: React.ReactNode;
  buttonCallback?: (() => undefined) | (() => Promise<void>);
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<ModalProps> = ({
  buttonCallback,
  title,
  buttonText,
  children,
  isOpen,
  setIsOpen,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const { current } = modalRef;
      if (current) {
        current.classList.remove("opacity-0");
      }
    }, 100);
  }, [isOpen]);

  function handleOutsideClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }

  return (
    (isOpen && (
      <div
        className="absolute w-full bg-black/70 h-full flex justify-center z-10 "
        onClick={handleOutsideClick}
      >
        <div
          className="opacity-0 flex-col rounded-md drop-shadow-sm bg-white w-96 md:max-w-md p-2 mt-24 h-fit transition-all duration-150 ease-in-out"
          ref={modalRef}
        >
          <header className="basis-1/5 flex justify-between border-b border-b-gray-100 text-lg p-2 font-bold">
            {title}
            <span className="block">
              <img
                className="w-full cursor-pointer"
                src={"/images/close-rectangle.svg"}
                alt="close"
                onClick={() => setIsOpen(false)}
              />
            </span>
          </header>
          <div className="basis-3/5 p-1">{children}</div>
          <footer className="basis-1/5 flex justify-end p-1">
            {buttonText && buttonCallback && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-md px-3 py-1 rounded-md"
                onClick={buttonCallback}
              >
                {buttonText}
              </button>
            )}
          </footer>
        </div>
      </div>
    )) ||
    null
  );
};

export default Modal;
