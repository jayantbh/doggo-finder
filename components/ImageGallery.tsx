import { motion } from "framer-motion";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import css from "../styles/ImageGallery.module.scss";
import {
  DogLoadSpecificState,
  DogLoadState,
  Prediction,
  RequestState,
} from "../types/types";
import {
  CloseBtn,
  DownBtn,
  FetchBtn,
  LeftBtn,
  RightBtn,
  UpBtn,
  UploadBtn,
} from "./Buttons";
import { FileUploadContext } from "../context/file-upload";
import { VerticalGallery } from "./VerticalGallery";
import { MAX_HORIZ_IMG_LIMIT, HorizontalGallery } from "./HorizontalGallery";

type ImageGallery = FC<{
  sourceImg: string;
  photos: string[];
  breed: Prediction | null;
  onLoadMore: (count?: any, retrial?: any) => any;
  dogState: DogLoadState;
  onClose: Function;
}>;

export const ImageGallery: ImageGallery = ({
  sourceImg,
  photos,
  breed,
  onLoadMore,
  dogState,
  onClose,
}) => {
  const fileUploadContext = useContext(FileUploadContext);

  const intervalRef = useRef(-1);
  const [index, setIndex] = useState<number>(0);
  const [galleryMode, setGalleryMode] =
    useState<"horizontal" | "vertical">("horizontal");

  const isLoading = dogState === RequestState.LOADING;
  const noMoreImgs = dogState === DogLoadSpecificState.NO_MORE;

  let visiblePhotos = useMemo(() => {
    if (galleryMode === "vertical") return photos;
    return photos.slice(0, MAX_HORIZ_IMG_LIMIT - 1);
  }, [photos, galleryMode]);

  const onPrev = useCallback(
    () => setIndex((i) => Math.max(0, i - 1)),
    [setIndex]
  );
  const onNext = useCallback(
    () =>
      setIndex((i) =>
        Math.min(
          (visiblePhotos?.length || Infinity) + 1,
          i + 1,
          MAX_HORIZ_IMG_LIMIT
        )
      ),
    [setIndex, visiblePhotos.length]
  );

  useEffect(() => {
    if (galleryMode === "vertical") return;

    const wheelListener = (e: WheelEvent) => {
      cancelAnimationFrame(intervalRef.current);

      intervalRef.current = window.setTimeout(() => {
        const isNext = e.deltaY > 0 || e.deltaX > 0;
        const isPrev = e.deltaY < 0 || e.deltaX < 0;
        if (isPrev) {
          onPrev();
        } else if (isNext) {
          onNext();
        }
      }, 100);
    };

    document.body.addEventListener("wheel", wheelListener);

    return () => {
      document.body.removeEventListener("wheel", wheelListener);
    };
  }, [photos, onPrev, onNext, galleryMode]);

  useEffect(() => {
    setIndex(0);
  }, [breed, galleryMode, setIndex]);

  return (
    <motion.div key="multi-preview" exit={{ opacity: 0 }}>
      <div className="fixed z-10 top-0 left-0 h-full w-full m-auto bg-gray-200 bg-opacity-90" />
      <div className={css.slideImgWrapper}>
        <div className="text-center pb-4 z-10">
          <div className="text-gray-600">photos of</div>
          <div className="text-lg">{breed?.className} dogs</div>
        </div>
        {galleryMode === "horizontal" ? (
          <HorizontalGallery
            focusIndex={index}
            sourceImg={sourceImg}
            photos={visiblePhotos}
            loadMore={onLoadMore}
            isLoading={isLoading}
            noMoreImgs={noMoreImgs}
            onPrev={onPrev}
            onNext={onNext}
          />
        ) : null}
        <motion.div layout className={css.galleryControls}>
          <UploadBtn
            className="transform scale-75"
            onClick={fileUploadContext.triggerUpload}
          />
          <LeftBtn
            disabled={!Boolean(visiblePhotos)}
            onClick={onPrev}
            className="transform scale-75"
          />
          <div>
            <div className="flex flex-col gap-3 items-center justify-center transform scale-75">
              {galleryMode === "vertical" ? (
                <UpBtn onClick={() => setGalleryMode("horizontal")} />
              ) : null}
              <CloseBtn disabled={!Boolean(visiblePhotos)} onClick={onClose} />
              {galleryMode === "horizontal" ? (
                <DownBtn onClick={() => setGalleryMode("vertical")} />
              ) : null}
            </div>
          </div>
          <RightBtn
            disabled={!Boolean(visiblePhotos)}
            onClick={onNext}
            className="transform scale-75"
          />
          <FetchBtn className="transform scale-75" onClick={onLoadMore} />
        </motion.div>
        {galleryMode === "vertical" ? (
          <VerticalGallery
            sourceImg={sourceImg}
            photos={visiblePhotos}
            loadMore={onLoadMore}
            noMoreImgs={noMoreImgs}
          />
        ) : null}
      </div>
    </motion.div>
  );
};
