import { useEffect } from "react";
import type { ToastProps, ToastType } from "../config/types";
import { useToast } from "../hooks/useToast";

type ToastContainerProps = {
  messages: ToastProps[];
};

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  autoClose = true,
}) => {
  const { removeToast } = useToast();
  const closeTime = 3000;

  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        removeToast(id);
      }, closeTime);
    }
  }, []);

  function getBackgroundType(type: ToastType): string {
    let result = "";
    switch (type) {
      case "danger":
        result = "bg-red-400";
        break;
      case "info":
        result = "bg-blue-400";
        break;
      case "success":
        result = "bg-green-400";
        break;
      default:
        result = "bg-yellow-500";
    }
    return result;
  }

  function handleClose() {
    removeToast(id);
  }

  return (
    <div
      className={`py-1 px-2 rounded-md font-bold ${getBackgroundType(type)}`}
    >
      <div>
        <div className="flex justify-end">
          <button
            className="cursor-pointer text-white"
            onClick={handleClose}
            role="button"
          >
            X
          </button>
        </div>
        <p className="px-4 text-sm text-white drop-shadow">{message}</p>
        <br />
      </div>
    </div>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  return (
    <div className="fixed bottom-1 right-1 w-1/2 md:w-1/4 lg:w-1/6 flex flex-col-reverse gap-2">
      {messages.map((prop, id) => {
        return <Toast key={id} {...prop} />;
      })}
    </div>
  );
};

export default ToastContainer;
