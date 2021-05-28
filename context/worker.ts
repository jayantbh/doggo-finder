import { createContext } from "react";
import { TensorFlowState } from "../types/types";

type WorkerContext = {
  worker: Worker | null;
  tfState: TensorFlowState;
};

export const WorkerContext = createContext<WorkerContext>({
  worker: null,
  tfState: TensorFlowState.LOADING,
});
