export type Prediction = {
  className: string;
  probability: number;
  link: string;
};

export enum TensorFlowState {
  FAILURE = "FAILURE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
}

export enum FileDragState {
  VALID = "VALID",
  INVALID = "INVALID",
}
export type FileDragStateT = FileDragState | null;

export enum DogLoadState {
  FAILURE = "FAILURE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  NO_MORE = "NO_MORE",
}

export type PreviewImg = string | null | undefined;
