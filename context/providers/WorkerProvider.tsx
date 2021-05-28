import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { ToastContext, ToastType } from "../toast-context";
import { WorkerContext } from "../worker";
import { TensorFlowState } from "../../types/types";
import { WorkerMsg, WorkerEvents, WorkerErrors } from "../../types/worker";
import { EventType, gtagEvent } from "../../utils/gtag";

export const WorkerProvider: FC = ({ children }) => {
  const { addToast } = useContext(ToastContext);
  const workerRef = useRef<Worker | null>(null);
  const [tfState, setTfState] = useState<TensorFlowState>(
    TensorFlowState.LOADING
  );

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../worker/worker.ts", import.meta.url)
    );

    const start = new Date().getTime();

    workerRef.current.onmessage = (e: WorkerMsg) => {
      if (e.data.e === WorkerEvents.TF_LOADED) {
        setTfState(TensorFlowState.SUCCESS);

        const time = new Date().getTime() - start;

        gtagEvent({
          action: EventType.ML_LOAD,
          value: { time },
        });
      } else if (e.data.e === WorkerEvents.TF_ERROR) {
        switch (e.data.err?.type) {
          case WorkerErrors.MODEL_NOT_LOADED: {
            setTfState(TensorFlowState.FAILURE);
            return addToast({
              type: ToastType.ERROR,
              content: "The ML model hasn't loaded yet.",
            });
          }
          case WorkerErrors.MODEL_LOAD_FAILED: {
            setTfState(TensorFlowState.FAILURE);
            return addToast({
              type: ToastType.ERROR,
              content: "The ML model failed to load. Please reload.",
            });
          }
          case WorkerErrors.PREDICTION_ERR:
          case WorkerErrors.PREDICTION_PROCESSING_ERR: {
            return addToast({
              type: ToastType.ERROR,
              content:
                "The image could not be processed. Retry or reload page.",
            });
          }
        }
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setTfState]);

  return (
    <WorkerContext.Provider value={{ worker: workerRef.current, tfState }}>
      {children}
    </WorkerContext.Provider>
  );
};
