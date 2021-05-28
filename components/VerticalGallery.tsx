import { motion } from "framer-motion";
import React, { FC, useRef, useState, useEffect, useMemo } from "react";
import cn from "classnames";
import { InView } from "react-intersection-observer";

import css from "../styles/ImageGallery.module.scss";
import { splitEvery, transpose } from "../utils/array";
import { Fetch } from "./Icons";

const getNumCols = () => Math.max(Math.floor(window.innerWidth / 200 - 1), 1);

export const VerticalGallery: FC<{
  sourceImg: string;
  photos: string[];
  noMoreImgs: boolean;
  loadMore: (num: number) => any;
}> = ({ sourceImg, photos, loadMore, noMoreImgs }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = useState(getNumCols());

  useEffect(() => {
    elRef.current?.focus();
  }, []);

  useEffect(() => {
    const listener = () => {
      setNumColumns(getNumCols());
    };

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  const urlSets = useMemo(() => {
    const urls = [sourceImg, ...photos, ""];

    if (numColumns === 1) return [urls];
    return transpose(splitEvery(numColumns, urls));
  }, [numColumns, sourceImg, photos]);

  return (
    <>
      <div className={css.stickyGradient} />
      <motion.div
        tabIndex={0}
        ref={elRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={css.fullWidthWrapper}
      >
        <div
          className={cn(
            "absolute flex justify-center",
            numColumns === 1 && css.fullWidthImgs
          )}
        >
          {urlSets.map((urls, _i) => (
            <div key={_i}>
              {urls.map((photoUrl, i) => {
                if (typeof photoUrl !== "string") return;
                if (!photoUrl.length) {
                  return (
                    <InView
                      key={i}
                      as="div"
                      className={cn(
                        css.gridImg,
                        css.fetchTile,
                        "h-40 flex items-center justify-center text-center"
                      )}
                      onChange={(inView) => inView && loadMore(25)}
                    >
                      <div className="p-4">
                        {noMoreImgs ? (
                          "Looks like we are out of dogs..."
                        ) : (
                          <div className="flex flex-col justify-center items-center">
                            <Fetch size={32} className="animate-spin mb-3" />
                            <p>Fetching more...</p>
                          </div>
                        )}
                      </div>
                    </InView>
                  );
                }
                return <StatefulMotionImage key={i} src={photoUrl} />;
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

const StatefulMotionImage: FC<{ src: string }> = ({ src }) => {
  const [classes, setClasses] = useState("h-36");

  return (
    <motion.img
      src={src}
      className={cn(css.gridImg, classes)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onLoad={() => {
        setClasses("");
      }}
    />
  );
};
