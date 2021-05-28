import { motion, HTMLMotionProps } from "framer-motion";
import React, { FC } from "react";
import cn from "classnames";
import { useSwipeable, SwipeCallback } from "react-swipeable";

import css from "../styles/ImageGallery.module.scss";
import { clamp } from "../utils/math";
import { Fetch } from "./Icons";
import { HotkeyHandler } from "./HotkeyHandler";
import { Puppy } from "./Puppy";

const MAX_IMG_ANGLE = 20;

export const MAX_HORIZ_IMG_LIMIT = 60;

export const HorizontalGallery: FC<{
  isLoading: boolean;
  focusIndex: number;
  sourceImg?: string | null;
  photos: string[];
  noMoreImgs: boolean;
  loadMore: (num: number) => any;
  onPrev: SwipeCallback;
  onNext: SwipeCallback;
}> = ({
  focusIndex,
  sourceImg,
  photos,
  isLoading,
  loadMore,
  noMoreImgs,
  onPrev,
  onNext,
}) => {
  const maxHorizontalImgLimit = photos.length >= MAX_HORIZ_IMG_LIMIT;

  const handlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrev,
  });

  return (
    <div className={css.horizontalGallery} {...handlers}>
      {[sourceImg, ...photos.slice(0, MAX_HORIZ_IMG_LIMIT - 1), ""].map(
        (photoUrl, i) => {
          if (typeof photoUrl !== "string") return;
          const props = getGalleryImgProps({
            focusIndex,
            itemIndex: i,
            totalCount: photos.length,
          });

          if (!photoUrl.length) {
            return (
              <motion.div
                key={i}
                className={cn(
                  css.slideImage,
                  css.fetchTile,
                  i === focusIndex ? "shadow-xl" : "shadow-none"
                )}
                {...props}
              >
                <Puppy size={"50%"} />
                {noMoreImgs ? (
                  <div className="mt-2">Looks like we're out of dogs...</div>
                ) : !maxHorizontalImgLimit ? (
                  <motion.button
                    className="relative ring-2 ring-current rounded-full px-4 py-2 mt-2 focus:outline-none hover:bg-gray-200 focus:bg-gray-200 transition-colors shadow-lg hover:shadow-sm justify-center"
                    onClick={loadMore as any}
                  >
                    {!isLoading ? (
                      "Fetch?"
                    ) : (
                      <Fetch className="animate-spin" size={28} />
                    )}
                    <HotkeyHandler
                      hotkey="Enter"
                      detail="Press Enter to load more images"
                      onHotkey={loadMore}
                    />
                  </motion.button>
                ) : (
                  <div className="mt-2 text-center">
                    <p>Can't load more images in this gallery</p>
                    <p>For more, see the vertical gallery</p>
                  </div>
                )}
              </motion.div>
            );
          }
          return (
            <motion.img
              key={i}
              src={photoUrl}
              className={cn(
                css.slideImage,
                i === focusIndex ? "shadow-xl" : "shadow-none"
              )}
              {...props}
            />
          );
        }
      )}
    </div>
  );
};

const getGalleryImgProps = ({
  itemIndex,
  focusIndex,
  totalCount,
}: {
  itemIndex: number;
  focusIndex: number;
  totalCount: number;
}) => {
  const props: HTMLMotionProps<"img" | "div"> = {
    animate: {
      x: (() => {
        const diff = itemIndex - focusIndex;
        const gap = 10;
        if (focusIndex > itemIndex) return `-${100 - diff * gap}%`;
        else if (focusIndex < itemIndex) return `${100 + diff * gap}%`;
        return 0;
      })(),
      scale: (() => {
        const diff = Math.abs(itemIndex - focusIndex);
        if (!diff) return 1;
        return 0.7;
      })(),
      rotateY: (() => {
        const diff = itemIndex - focusIndex;
        if (!diff) return 0;
        return clamp(-diff * 5, -MAX_IMG_ANGLE, MAX_IMG_ANGLE);
      })(),
      zIndex: (() => {
        const diff = Math.abs(itemIndex - focusIndex);
        if (!diff) return totalCount;
        return totalCount - diff;
      })(),
    },
    transition: {
      ease: "easeInOut",
    },
  };

  return props;
};
