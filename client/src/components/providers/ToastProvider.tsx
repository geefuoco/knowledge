import type { ToastProps, ToastType } from "../../config/types";
import { memo, useMemo, useState } from "react";
import { ToastContext } from "../../context/ToastContext";
import ToastContainer from "../Toast";

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  function createToast(message: string, type: ToastType, autoClose: boolean) {
    const toast = {
      id: toasts.length + 1,
      message,
      type,
      autoClose,
    };
    setToasts((toasts) => [toast, ...toasts]);
  }

  function removeToast(id: number) {
    const newToasts = toasts.filter((toast) => toast.id !== id);
    setToasts(newToasts);
  }

  const contextValue = useMemo(
    () => ({
      toasts,
      createToast,
      removeToast,
    }),
    [toasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default memo(ToastProvider);
