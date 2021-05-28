import { Prediction } from "./types";

export enum WorkerEvents {
  DETECT = "DETECT",
  TF_ERROR = "TF_ERROR",
  TF_LOADED = "TF_LOADED",
  TF_PREDS = "TF_PREDS",
}

export enum WorkerErrors {
  MODEL_NOT_LOADED = "MODEL_NOT_LOADED",
  MODEL_LOAD_FAILED = "MODEL_LOAD_FAILED",
  PREDICTION_ERR = "PREDICTION_ERR",
  PREDICTION_PROCESSING_ERR = "PREDICTION_PROCESSING_ERR",
  PREDICTION_IMAGE_MISSING = "PREDICTION_IMAGE_MISSING",
}

export type WorkerMsg = MessageEvent<{
  e: WorkerEvents;
  preds?: Prediction[];
  bmp?: ImageBitmap;
  err?: {
    type: WorkerErrors;
    meta: any;
  };
}>;
