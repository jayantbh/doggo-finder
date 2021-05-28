import { AnimatePresence, motion, MotionProps } from "framer-motion";
import React, { FC, useContext } from "react";
import cn from "classnames";

import { AnimateSVG } from "./AnimateSVG";
import { Paw } from "./Paw";
import { TensorFlowState } from "../types/types";
import { WorkerContext } from "../context/worker";

// From: https://easings.net/#easeOutBounce
const easeOutBounce = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};

const animationProps: MotionProps = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: {
    duration: 0.4,
    ease: easeOutBounce,
  },
};

const variants = {
  hidden: { opacity: 0, y: 10 },
  active: { opacity: 1, y: 0 },
};

type TitleCard = FC<{
  isPreviewing?: boolean;
}>;

export const TitleCard: TitleCard = ({ isPreviewing }) => {
  const { tfState } = useContext(WorkerContext);

  const tfLoading = tfState === TensorFlowState.LOADING;

  return (
    <motion.div
      initial="hidden"
      exit="hidden"
      variants={variants}
      animate={!isPreviewing ? "active" : "hidden"}
    >
      <h1 className="text-6xl p-10 text-gray-600 flex items-center gap-4 leading-tight">
        <div className="flex flex-col">
          <span>Doggo</span>
          <span>Finder</span>
        </div>{" "}
        <AnimateSVG className={tfLoading ? "animate-pulse" : ""}>
          <Paw
            className={cn("transition-colors", {
              "text-gray-300 text-opacity-90": tfLoading,
              "text-gray-400": tfState === TensorFlowState.SUCCESS,
              "text-red-200": tfState === TensorFlowState.FAILURE,
            })}
            height={110}
            width={110}
          />
        </AnimateSVG>
      </h1>
      <div className="text-center h-14">
        <AnimatePresence>{getTextForTfState(tfState)}</AnimatePresence>
      </div>
    </motion.div>
  );
};

const getTextForTfState = (state: TensorFlowState) => {
  switch (state) {
    case TensorFlowState.LOADING:
      return (
        <motion.div
          key="2"
          {...animationProps}
          className="absolute left-0 right-0 m-auto"
        >
          <div className="text-xl text-gray-400">
            Powering up machine brains
          </div>
          <span className="text-xs mt-1 text-gray-400">
            The machine learning system is being loaded
          </span>
        </motion.div>
      );
    case TensorFlowState.SUCCESS:
      return (
        <motion.div
          key="1"
          {...animationProps}
          className="absolute left-0 right-0 m-auto"
        >
          <div className="text-xl text-gray-400">
            Upload an image to get started
          </div>
          <span className="text-xs mt-1 text-gray-400">
            Drag or paste an image, or use the button
          </span>
        </motion.div>
      );
    default:
      return (
        <motion.div
          key="2"
          {...animationProps}
          className="absolute left-0 right-0 m-auto"
        >
          <div className="text-xl text-gray-400">
            The machine failed to load
          </div>
          <span className="text-xs mt-1 text-gray-400">
            Please reload the window, or contact @jayantbh
          </span>
        </motion.div>
      );
  }
};
