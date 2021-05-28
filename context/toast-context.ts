import { createContext, ReactNode } from "react";

type ID = string;

type ToastAction = {
  content: ReactNode;
  action: Function;
};

export enum ToastType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  INFO = "INFO",
}

export type Toast = {
  id: ID;
  type: ToastType;
  content: ReactNode;
  icon?: ReactNode;
  onClose?: Function;
  actions?: ToastAction[];
};

type ToastCreationObj = Omit<Toast, "id">;

export type ToastContext = {
  toasts: Toast[];
  addToast: (toast: ToastCreationObj) => ID;
  removeToast: (id: ID) => ID;
};

export const ToastContext = createContext<ToastContext>({
  toasts: [],
  addToast: (() => {}) as any,
  removeToast: (() => {}) as any,
});
