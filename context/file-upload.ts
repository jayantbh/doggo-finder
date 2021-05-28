import { createContext } from "react";

type FileUploadContext = {
  src?: string | null;
  triggerUpload?: Function;
  setTriggerUpload?: (fn: Function) => any;
};

export const FileUploadContext = createContext<FileUploadContext>({});
