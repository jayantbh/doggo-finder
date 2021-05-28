import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { WorkerContext } from "../context/worker";

import css from "../styles/PreviewPanel.module.scss";
import { PredictionPills } from "./PredictionPills";
import { DogLoadState, Prediction } from "../types/types";
import { request } from "../utils/request";
import { ImageGallery } from "./ImageGallery";
import { CloseBtn, UploadBtn } from "./Buttons";
import { FileUploadContext } from "../context/file-upload";
import { ToastContext, ToastType } from "../context/toast-context";
import { WorkerEvents, WorkerMsg } from "../types/worker";
import { RequestPayload } from "../pages/api/get-dogs";
import { gtagEvent, EventType } from "../utils/gtag";

const DEFAULT_IMG_COUNT = 10;
const DEFAULT_RETRY_COUNT = 3;

type Props = {
  src: string;
  onReset: () => any;
};

export const PreviewPanel: FC<Props> = ({ src, onReset }) => {
  const { worker } = useContext(WorkerContext);
  const fileUploadContext = useContext(FileUploadContext);
  const { addToast } = useContext(ToastContext);

  const linksMapRef = useRef<Record<string, boolean>>({});

  /**
   * null = no match
   * [] = initial state, matches not fetched
   * Prediction[] = matches
   */
  const [predictions, setPredictions] = useState<Array<Prediction> | null>([]);

  const [selectedBreed, setSelectedBreed] = useState<Prediction | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[] | null>(null);
  const [dogState, setDogState] = useState<DogLoadState>(DogLoadState.SUCCESS);

  const resetState = useCallback(() => {
    setPredictions([]);
    linksMapRef.current = {};
    setSelectedPhotos(null);
  }, []);

  const onBreedSelect = useCallback(
    async (
      breed: Prediction,
      count = DEFAULT_IMG_COUNT,
      retrial = DEFAULT_RETRY_COUNT
    ) => {
      if (retrial === DEFAULT_RETRY_COUNT) {
        gtagEvent({
          action: EventType.BREED_SELECT,
          value: {
            breed: breed.className,
            probability: breed.probability,
            count: count,
          },
        });
      }
      if (breed.className !== selectedBreed?.className) {
        linksMapRef.current = {};
        setSelectedPhotos(null);
      }
      setSelectedBreed(breed);
      setDogState(DogLoadState.LOADING);
      try {
        let links = await request<RequestPayload>(
          "/api/get-dogs?link=" + breed.link + count
        ).then((r) => r.data);

        if (!links) {
          setDogState(DogLoadState.FAILURE);
          addToast({
            type: ToastType.ERROR,
            content:
              "Failed to fetch " +
              breed.className +
              " photos. Please try again.",
          });
          return;
        }

        links = links.filter((link) => !linksMapRef.current[link]);

        if (!links.length) {
          if (retrial > 0) {
            onBreedSelect(breed, count, retrial - 1);
          } else {
            setDogState(DogLoadState.NO_MORE);
          }
          return;
        }

        const linksEntries = links.map((link) => [link, true]);
        const linksMap = Object.fromEntries(linksEntries);
        linksMapRef.current = {
          ...linksMapRef.current,
          ...linksMap,
        };

        gtagEvent({
          action: EventType.IMG_FETCH,
          value: { count, retrial, new_links: links.length },
        });

        setSelectedPhotos((urls) => [...(urls || []), ...(links as string[])]);
      } catch (e) {
        console.error(e);
        addToast({
          type: ToastType.ERROR,
          content:
            "Failed to fetch " + breed.className + " photos. Please try again.",
        });
      }
      setDogState(DogLoadState.SUCCESS);
    },
    [selectedBreed, setSelectedBreed, setSelectedPhotos, setDogState, addToast]
  );

  useEffect(() => {
    if (!worker) return;

    const listener = (e: WorkerMsg) => {
      if (e.data.e === WorkerEvents.TF_ERROR) return;
      const { preds } = e.data;

      gtagEvent({
        action: EventType.BREED_DETECT,
        value: {
          breeds: preds?.map((p) => p.className).join(",") as string,
          count: preds?.length as number,
        },
      });
      setPredictions(preds?.length ? preds : null);
    };

    worker.addEventListener("message", listener);

    return () => {
      worker.removeEventListener("message", listener);
    };
  }, [worker, setPredictions]);

  useEffect(() => {
    resetState();
  }, [src]);

  return (
    <AnimateSharedLayout type="switch">
      <AnimatePresence>
        {src ? (
          <div key="single-preview" className={css.imageUploader}>
            <motion.div
              id="preview"
              className={css.previewPanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PredictionPills
                predictions={predictions}
                onSelect={onBreedSelect}
                loadingBreed={
                  dogState === DogLoadState.LOADING ? selectedBreed : null
                }
              />
              <div className="overflow-hidden h-full flex justify-center items-center my-2 p-2">
                <motion.img
                  src={src}
                  className={css.previewImage}
                  alt="Image Preview"
                  draggable={false}
                />
              </div>
              <div className="flex gap-4 items-center mt-4">
                <UploadBtn
                  disabled={Boolean(selectedPhotos)}
                  onClick={fileUploadContext.triggerUpload}
                />
                <CloseBtn
                  disabled={Boolean(selectedPhotos)}
                  onClick={() => {
                    resetState();
                    onReset();
                  }}
                />
              </div>
            </motion.div>
          </div>
        ) : null}
        {selectedPhotos ? (
          <ImageGallery
            sourceImg={src}
            photos={selectedPhotos}
            breed={selectedBreed}
            onLoadMore={(num: number = DEFAULT_IMG_COUNT) =>
              selectedBreed && onBreedSelect(selectedBreed, num)
            }
            dogState={dogState}
            onClose={() => {
              setSelectedPhotos(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};
