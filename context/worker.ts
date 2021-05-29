import { createContext } from "react";
import { RequestState } from "../types/types";

type WorkerContext = {
  worker: Worker | null;
  tfState: RequestState;
};

export const WorkerContext = createContext<WorkerContext>({
  worker: null,
  tfState: RequestState.LOADING,
});
