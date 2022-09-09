import { createContext } from "react";
import type { ToastContextType, ToastType } from "../config/types";

export const ToastContext = createContext<ToastContextType>({
  toasts: null,
  getToasts: () => null,
  createToast: (_: string, __: ToastType, ___: boolean) => {},
  removeToast: (_: number) => {},
});
