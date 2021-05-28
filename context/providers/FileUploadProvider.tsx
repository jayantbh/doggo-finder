import React, { FC, useState } from "react";
import { FileUploadContext } from "../file-upload";

type FileUploadProvider = FC<{
  src?: string | null;
}>;

export const FileUploadProvider: FileUploadProvider = ({ src, children }) => {
  const [triggerUpload, _setTriggerUpload] = useState<Function>(() => {});

  const setTriggerUpload = (fn: Function) => {
    _setTriggerUpload(() => fn);
  };

  return (
    <FileUploadContext.Provider
      value={{
        src,
        triggerUpload,
        setTriggerUpload,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
