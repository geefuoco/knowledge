import { memo, useEffect, useMemo } from "react";
import type { ToastProps, ToastType } from "../config/types";
import { useToast } from "../hooks/useToast";

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
  const { removeToast } = useToast();

  function getBackgroundType(type: ToastType): string {
    let result = "";
    switch (type) {
      case "danger":
        result = "bg-red-500";
        break;
      case "info":
        result = "bg-blue-400";
        break;
      case "success":
        result = "bg-green-400";
        break;
      default:
        result = "bg-yellow-600";
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

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    if (toasts && toasts.length > 0) {
      const time = setTimeout(() => removeToast(toasts[0].id), 3000);

      return () => clearTimeout(time);
    }
  }, [toasts]);

  const memoizedToasts = useMemo(() => {
    return toasts?.map((prop) => {
      return <Toast key={prop.id} {...prop} />;
    });
  }, [toasts]);

  return (
    <div className="fixed bottom-1 right-1 w-1/2 md:w-1/4 lg:w-1/6 flex flex-col-reverse gap-2 z-50">
      {memoizedToasts}
    </div>
  );
};

export default memo(ToastContainer);
