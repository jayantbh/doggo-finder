import React, {
  DOMAttributes,
  FC,
  useContext,
  useCallback,
  useRef,
} from "react";
import cn from "classnames";
import { motion } from "framer-motion";

import css from "../styles/FileUploader.module.scss";
import { HotkeyHandler } from "./HotkeyHandler";
import { noDefaultOp } from "../utils/event";
import { Upload } from "./Icons";
import { FileUploadContext } from "../context/file-upload";
import { WorkerContext } from "../context/worker";
import { TensorFlowState } from "../types/types";

export type DragState = "VALID" | "INVALID" | null;

const variants = {
  hidden: { opacity: 0, y: 10 },
  active: { opacity: 1, y: 0 },
};

type Props = {
  dragState: DragState;
  onInput: DOMAttributes<HTMLInputElement>["onInput"];
  isPreviewing: boolean;
};

export const FileUploader: FC<Props> = ({
  dragState,
  onInput,
  isPreviewing,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileUploadContext = useContext(FileUploadContext);
  const { tfState } = useContext(WorkerContext);

  const tfLoaded = tfState === TensorFlowState.SUCCESS;

  const triggerFileDialog = useCallback(() => {
    inputRef.current?.click();
    fileUploadContext.setTriggerUpload?.(() => inputRef.current?.click());
  }, [fileUploadContext]);

  return (
    <>
      <motion.div
        initial="hidden"
        animate={tfLoaded && !isPreviewing ? "active" : "hidden"}
        variants={variants}
      >
        <label
          htmlFor="file-upload"
          className={cn(css.uploadBtnLabel, dragState && "pointer-events-none")}
        >
          <button
            onClick={triggerFileDialog}
            autoFocus={true}
            className="relative p-3 mt-2 ring-2 ring-gray-300 rounded-full hover:shadow-inner transition-shadow focus:ring-gray-500 focus:outline-none"
          >
            <Upload size={24} className="text-gray-500" />
            <HotkeyHandler
              hotkey="U"
              detail="Press U to upload a file"
              onHotkey={triggerFileDialog}
              disabled={isPreviewing}
            />
          </button>
        </label>
        <label
          htmlFor="file-upload"
          className={cn("h-full w-full absolute p-10 top-0 left-0")}
          onClick={noDefaultOp}
        >
          <div
            className={cn(
              "h-full w-full rounded-lg pointer-events-none border-dashed border-4 border-transparent transition-colors",
              dragState === "VALID" && "border-green-400",
              dragState === "INVALID" && "border-red-400"
            )}
          />
        </label>
      </motion.div>
      {tfLoaded ? (
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          className="hidden"
          onInput={onInput}
          accept="image/*"
        />
      ) : null}
    </>
  );
};
