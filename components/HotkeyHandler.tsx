import React, { FC, HTMLAttributes, useEffect, useRef } from "react";
import cn from "classnames";

import css from "../styles/HotkeyHandler.module.scss";

const KEY_TEXT_MAP: Record<string, string> = {
  Escape: "Esc",
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
};

type Props = {
  hotkey: string | string[];
  detail?: string;
  onHotkey?: Function;
  disabled?: boolean;
};

export const HotkeyHandler: FC<HTMLAttributes<HTMLDivElement> & Props> = ({
  hotkey,
  detail,
  onHotkey,
  disabled,
  ...props
}) => {
  const intervalRef = useRef(-1);

  useEffect(() => {
    let keys: string[];
    if (!Array.isArray(hotkey)) {
      keys = [hotkey];
    } else {
      keys = hotkey;
    }

    const bindKey = (key: string) => {
      const listener = (e: KeyboardEvent) => {
        if (disabled) return;
        if (e.key.toLowerCase() !== key.toLowerCase()) return;

        e.stopImmediatePropagation();

        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = requestAnimationFrame(() => onHotkey?.());
      };

      window.addEventListener("keydown", listener);

      const unbindKey = () => {
        window.removeEventListener("keydown", listener);
      };

      return unbindKey;
    };

    const unbindFns = keys.map(bindKey);

    return () => {
      unbindFns.forEach((fn) => fn());
    };
  }, [hotkey, onHotkey, disabled]);

  const getLabel = () => {
    if (Array.isArray(hotkey)) {
      return hotkey.map((key) => KEY_TEXT_MAP[key] || key).join(", ");
    }

    return KEY_TEXT_MAP[hotkey] || hotkey;
  };

  if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
    return null;

  return (
    <div {...props} className={cn(css.hotkey, props.className)}>
      {detail ? <div className={css.detail}>{detail}</div> : null}
      {getLabel()}
    </div>
  );
};
