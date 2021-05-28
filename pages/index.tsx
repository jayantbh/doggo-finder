import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useContext,
} from "react";

import css from "../styles/index.module.scss";
import { FileUploader } from "../components/FileUploader";
import {
  checkFilesInEvent,
  getFileFromEvent,
  getImageFromClipboardEvent,
  noDefaultOp,
} from "../utils/event";
import { PreviewPanel } from "../components/PreviewPanel";
import { TitleCard } from "../components/TitleCard";
import { b64ImgToBitMap, getImgSrcFromFile } from "../utils/image";
import { WorkerContext } from "../context/worker";
import { FileUploadProvider } from "../context/providers/FileUploadProvider";
import { ToastContext, ToastType } from "../context/toast-context";
import { FileDragState, FileDragStateT, PreviewImg } from "../types/types";
import { WorkerEvents, WorkerMsg } from "../types/worker";

export default function Home() {
  const { addToast } = useContext(ToastContext);
  const { worker, tfState } = useContext(WorkerContext);

  const rootEl = useRef<HTMLDivElement | null>(null);
  const dragSet = useRef(new Set());
  const [dragState, setDragState] = useState<FileDragStateT>(null);
  const [previewSrc, setPreviewSrc] = useState<PreviewImg>(null);

  const isTriggerAChild = useCallback((e: DragEvent) => {
    return rootEl.current?.contains(e.target as Node);
  }, []);

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      dragSet.current.add(e.currentTarget);

      if (!isTriggerAChild(e)) return;

      const correctCount = checkFilesInEvent(e);
      if (!correctCount) setDragState(FileDragState.INVALID);
      else setDragState(FileDragState.VALID);
    },
    [setDragState, isTriggerAChild]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      dragSet.current.delete(e.currentTarget);

      if (dragSet.current.size) return;
      setDragState(null);
    },
    [setDragState]
  );

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();

      try {
        setDragState(null);
        const correctCount = checkFilesInEvent(e);
        if (!correctCount) return;

        let file = getFileFromEvent(e);

        if (file) {
          let src = await getImgSrcFromFile(file);
          setPreviewSrc(src);
        }
      } catch (e) {
        addToast({
          type: ToastType.ERROR,
          content: "Failed to load image. Please retry.",
        });
      }
    },
    [setDragState, setPreviewSrc]
  );

  const handleInputFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      try {
        const correctCount = checkFilesInEvent(e);
        if (!correctCount) return;

        let file = getFileFromEvent(e);

        if (file) {
          let src = await getImgSrcFromFile(file);
          setPreviewSrc(src);
        }
      } catch {
        addToast({
          type: ToastType.ERROR,
          content: "Failed to load image. Please retry.",
        });
      }

      e.target.value = "";
    },
    [setPreviewSrc]
  );

  useEffect(() => {
    if (!tfState) return;

    const pasteListener = async (e: ClipboardEvent) => {
      try {
        const img = await getImageFromClipboardEvent(e);
        setPreviewSrc(img);
      } catch {
        addToast({
          type: ToastType.ERROR,
          content: "Failed to load image. Please retry.",
        });
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", noDefaultOp);
    window.addEventListener("drop", handleDrop);
    document.addEventListener("paste", pasteListener);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", noDefaultOp);
      window.removeEventListener("drop", handleDrop);
      document.removeEventListener("paste", pasteListener);
    };
  }, [handleDragEnter, handleDragLeave, handleDrop, tfState]);

  useEffect(() => {
    if (!previewSrc) return;

    b64ImgToBitMap(previewSrc).then((bmp) => {
      worker?.postMessage(
        { e: WorkerEvents.DETECT, bmp } as WorkerMsg["data"],
        [bmp]
      );
    });
  }, [previewSrc]);

  return (
    <FileUploadProvider src={previewSrc}>
      <div ref={rootEl} className={css.container}>
        <main className="p-10 flex flex-col h-full w-full place-items-center place-content-center">
          <TitleCard isPreviewing={Boolean(previewSrc)} />
          <FileUploader
            dragState={dragState}
            onInput={handleInputFileUpload}
            isPreviewing={Boolean(previewSrc)}
          />
          {!!previewSrc && (
            <PreviewPanel
              src={previewSrc}
              onReset={() => setPreviewSrc(null)}
            />
          )}
        </main>
      </div>
    </FileUploadProvider>
  );
}
