import React, { FC, useState } from "react";
import cn from "classnames";
import { v4 as uuid } from "uuid";

import { ToastContext, ToastType } from "../toast-context";
import { CrossFlat, Check, Exclaim, Info } from "../../components/Icons";
import { HotkeyHandler } from "../../components/HotkeyHandler";
import { AnimatePresence, motion } from "framer-motion";
import { EventType, gtagEvent } from "../../utils/gtag";

const DEFAULT_TIMEOUT = 5;

export const ToastProvider: FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastContext["toasts"]>([]);

  const removeToast: ToastContext["removeToast"] = (id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    return id;
  };

  const addToast: ToastContext["addToast"] = (t) => {
    const id = uuid();
    setToasts((ts) => [...ts, { id, ...t }]);

    gtagEvent({
      action: EventType.TOAST,
      value: { type: t.type, value: String(t.content) },
    });

    setTimeout(() => {
      removeToast(id);
    }, DEFAULT_TIMEOUT * 1000);
    return id;
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
      <ul className="flex flex-col gap-2 p-4 items-end z-10 fixed top-0 left-0 h-full w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.li
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ ease: "easeIn" }}
              className={cn(
                getBgClassForType(toast.type),
                "flex items-center text-xs py-2 px-3 rounded-md pointer-events-auto backdrop-filter backdrop-blur-sm bg-gray-100 bg-opacity-20 shadow-md hover:shadow-lg transition-shadow"
              )}
            >
              {getIconForType(toast.type)}
              <span className="mr-4">{toast.content}</span>
              <div className="relative">
                <CrossCircle type={toast.type} />
                <CrossFlat
                  size={18}
                  data-testid="cross"
                  className={cn(
                    getCrossClassForType(toast.type),
                    "m-0.5 p-0.5 rounded transition-colors"
                  )}
                  onClick={() => removeToast(toast.id)}
                />
                {toast.id === toasts[0].id ? (
                  <HotkeyHandler
                    hotkey="X"
                    className="transform translate-x-3 translate-y-2"
                    onHotkey={() => removeToast(toast.id)}
                  />
                ) : null}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </ToastContext.Provider>
  );
};

const radius = 10;
const circumference = Math.ceil(2 * Math.PI * radius);

const CrossCircle: FC<{ type: ToastType }> = ({ type }) => (
  <svg
    height={22}
    width={22}
    className={cn(
      "absolute left-0 top-0 right-0 bottom-0 m-auto",
      getTextClassForType(type)
    )}
  >
    <motion.circle
      cx={11}
      cy={11}
      r={radius}
      strokeWidth={2}
      fill="none"
      stroke="currentColor"
      initial={{
        strokeDasharray: circumference,
        strokeDashoffset: 0,
      }}
      animate={{
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      }}
      transition={{ duration: DEFAULT_TIMEOUT, ease: "linear" }}
    />
  </svg>
);

const getTextClassForType = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return "text-green-400";
    case ToastType.ERROR:
      return "text-red-400";
    default:
      return "text-blue-400";
  }
};

const getBgClassForType = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return "bg-green-100";
    case ToastType.ERROR:
      return "bg-red-100";
    default:
      return "bg-blue-100";
  }
};

const getCrossClassForType = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return "hover:bg-green-200";
    case ToastType.ERROR:
      return "hover:bg-red-200";
    default:
      return "hover:bg-blue-200";
  }
};

const getIconForType = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <Check size={20} className="text-green-500 mr-2" />;
    case ToastType.ERROR:
      return <Exclaim size={20} className="text-red-500 mr-2" />;
    default:
      return <Info size={20} className="text-blue-500 mr-2" />;
  }
};
