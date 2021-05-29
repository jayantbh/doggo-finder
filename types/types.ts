export type Prediction = {
  className: string;
  probability: number;
  link: string;
};

export enum RequestState {
  FAILURE = "FAILURE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  DORMANT = "DORMANT",
}

export enum FileDragState {
  VALID = "VALID",
  INVALID = "INVALID",
}
export type FileDragStateT = FileDragState | null;

export enum DogLoadSpecificState {
  NO_MORE = "NO_MORE",
}

export type DogLoadState = RequestState | DogLoadSpecificState;

export type PreviewImg = string | null | undefined;
