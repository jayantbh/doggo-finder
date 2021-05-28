import React, { ChangeEvent } from "react";
import { getImgSrcFromFile } from "./image";

export const checkFilesInEvent = (
  e: DragEvent | ChangeEvent<HTMLInputElement>
) => {
  if (e instanceof DragEvent) {
    const { items = [] } = e.dataTransfer || {};
    return items.length === 1 && items[0].type.startsWith("image");
  } else {
    const files = e.target.files || [];
    return files.length === 1 && files[0].type.startsWith("image");
  }
};

export const getFileFromEvent = (
  e: DragEvent | ClipboardEvent | ChangeEvent<HTMLInputElement>
) => {
  if (e instanceof DragEvent) {
    return e.dataTransfer?.items[0].getAsFile();
  } else if (e instanceof ClipboardEvent) {
    return e.clipboardData?.items[0].getAsFile();
  } else {
    const files = e.target.files || [];
    return files[0];
  }
};

export const noDefaultOp = (e: Event | React.UIEvent) => e.preventDefault();

export const getImageFromClipboardEvent = async (e: ClipboardEvent) => {
  const file = getFileFromEvent(e);
  if (!file) return;
  return await getImgSrcFromFile(file);
};
