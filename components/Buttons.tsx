import { HTMLMotionProps, motion } from "framer-motion";
import React, { FC } from "react";
import cn from "classnames";

import css from "../styles/Buttons.module.scss";
import {
  Cross,
  DoubleDown,
  DoubleUp,
  Fetch,
  Left,
  Right,
  Upload,
} from "./Icons";
import { HotkeyHandler } from "./HotkeyHandler";

type Props = Omit<HTMLMotionProps<"button">, "onClick"> & {
  disabled?: boolean;
  onClick?: Function;
};

type CloseBtn = FC<Props>;
export const CloseBtn: CloseBtn = ({ onClick, disabled, ...props }) => (
  <motion.button
    {...props}
    name="close button"
    disabled={disabled}
    layoutId="clear-btn"
    className={cn(css.btn, "relative df-spin", props.className)}
    onClick={onClick as any}
  >
    <Cross className="text-gray-400" />
    <HotkeyHandler hotkey="Escape" disabled={disabled} onHotkey={onClick} />
  </motion.button>
);

export const LeftBtn: FC<Props> = ({ disabled, onClick, ...props }) => (
  <motion.button
    {...props}
    name="left button"
    disabled={disabled}
    className={cn(css.btn, "relative", props.className)}
    onClick={onClick as any}
  >
    <Left className="text-gray-400" />
    <HotkeyHandler
      hotkey={["ArrowLeft", "A"]}
      disabled={disabled}
      onHotkey={onClick}
    />
  </motion.button>
);

export const RightBtn: FC<Props> = ({ disabled, onClick, ...props }) => (
  <motion.button
    {...props}
    name="right button"
    disabled={disabled}
    className={cn(css.btn, "relative", props.className)}
    onClick={onClick as any}
  >
    <Right className="text-gray-400" />
    <HotkeyHandler
      hotkey={["ArrowRight", "D"]}
      disabled={disabled}
      onHotkey={onClick}
    />
  </motion.button>
);

export const UploadBtn: FC<Props> = ({ disabled, onClick, ...props }) => (
  <motion.button
    {...props}
    name="upload button"
    disabled={disabled}
    className={cn(css.btn, "relative p-2", props.className)}
    onClick={onClick as any}
  >
    <Upload className="text-gray-400" size={24} />
    <HotkeyHandler hotkey="U" disabled={disabled} onHotkey={onClick} />
  </motion.button>
);

export const FetchBtn: FC<Props> = ({ disabled, onClick, ...props }) => (
  <motion.button
    {...props}
    name="fetch images button"
    disabled={disabled}
    className={cn(css.btn, "relative p-2", props.className)}
    onClick={onClick as any}
  >
    <Fetch className="text-gray-400" size={24} />
    <HotkeyHandler
      hotkey="Enter"
      detail="Press Enter to load more images"
      disabled={disabled}
      onHotkey={onClick}
    />
  </motion.button>
);

export const UpBtn: FC<Props> = ({ disabled, onClick, ...props }) => (
  <motion.button
    {...props}
    name="pull up button"
    disabled={disabled}
    className={cn(css.btn, "relative p-2", props.className)}
    onClick={onClick as any}
  >
    <DoubleUp className="text-gray-400" size={24} />
    <HotkeyHandler
      hotkey={["W", "ArrowUp"]}
      disabled={disabled}
      onHotkey={onClick}
    />
  </motion.button>
);

export const DownBtn: FC<Props> = ({ disabled, onClick, ...props }) => (
  <motion.button
    {...props}
    name="pull down button"
    disabled={disabled}
    className={cn(css.btn, "relative p-2", props.className)}
    onClick={onClick as any}
  >
    <DoubleDown className="text-gray-400" size={24} />
    <HotkeyHandler
      hotkey={["S", "ArrowDown"]}
      disabled={disabled}
      onHotkey={onClick}
    />
  </motion.button>
);
