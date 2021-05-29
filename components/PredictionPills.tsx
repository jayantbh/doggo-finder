import { motion } from "framer-motion";
import React, { FC } from "react";
import cn from "classnames";

import css from "../styles/PredictionPills.module.scss";
import { HotkeyHandler } from "./HotkeyHandler";
import { Prediction } from "../types/types";

const THRESHOLD = {
  HIGH: 0.7,
  LOW: 0.3,
};

const getTitleFromPred = (pred: Prediction) => {
  return `We're ${Math.round(pred.probability * 100)}% sure the breed is ${
    pred.className
  }`;
};

type Props = {
  predictions: Prediction[] | null;
  onSelect: (breed: Prediction, count?: any) => any;
  loadingBreed: Prediction | null;
};

export const PredictionPills: FC<Props> = ({
  predictions,
  onSelect,
  loadingBreed,
}) => {
  return (
    <>
      <div className="text-gray-600 mb-4">detected breeds</div>
      <div className="flex gap-2 mb-4 h-8 flex-shrink-0">
        {predictions === null ? (
          <motion.div
            key="no-preds"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2 },
            }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(css.predictionPill, "bg-red-50 ring-red-300")}
          >
            No predictions available. Maybe this isn't a dog?
          </motion.div>
        ) : (
          predictions.map((pred, i) => (
            <PredictionPill
              key={pred.className}
              pred={pred}
              index={i}
              onSelect={onSelect}
              isLoading={loadingBreed?.className === pred.className}
            />
          ))
        )}
      </div>
    </>
  );
};

type PredictionPill = FC<{
  pred: Prediction;
  onSelect: (breed: Prediction) => any;
  index?: number;
  isLoading: boolean;
}>;
export const PredictionPill: PredictionPill = ({
  pred,
  onSelect,
  index: i = 0,
  isLoading,
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: (i + 1) * 0.2 },
      }}
      exit={{ opacity: 0, y: 10 }}
      title={getTitleFromPred(pred)}
      className={cn(
        css.predictionPill,
        "focus:ring-gray-700 focus:outline-none relative",
        {
          "bg-red-50 ring-red-300": pred.probability <= THRESHOLD.LOW,
          "bg-yellow-50 ring-yellow-300": pred.probability > THRESHOLD.LOW,
          "bg-green-50 ring-green-300": pred.probability > THRESHOLD.HIGH,
        }
      )}
      onClick={() => onSelect(pred)}
    >
      <div
        className={cn("h-2 w-2 mr-1 rounded-full", {
          "animate-ping": isLoading,
          "bg-red-500": pred.probability <= THRESHOLD.LOW,
          "bg-yellow-500": pred.probability > THRESHOLD.LOW,
          "bg-green-500": pred.probability > THRESHOLD.HIGH,
        })}
      />
      {pred.className}
      <HotkeyHandler hotkey={String(i + 1)} onHotkey={() => onSelect(pred)} />
    </motion.button>
  );
};
