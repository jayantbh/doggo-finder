import "@tensorflow/tfjs";
import * as tf from "@tensorflow-models/mobilenet";

import { request } from "../utils/request";
import { WorkerErrors, WorkerEvents, WorkerMsg } from "../types/worker";
import { GetAllBreedsResponse } from "../types/api";

let model: tf.MobileNet | null = null;
let breeds: Record<string, string> = {};

const loadModel = async () => {
  try {
    model = await tf.load();
    const breedMap = await request<GetAllBreedsResponse>(
      "https://dog.ceo/api/breeds/list/all"
    ).then((r) => r.message);
    for (let breed in breedMap) {
      breeds[breed] = breed;
      if (breedMap[breed].length) {
        breedMap[breed].forEach(
          (subBreed) =>
            (breeds[`${subBreed} ${breed}`] = `${breed}/${subBreed}`)
        );
      }
    }
  } catch (e) {
    postMessage({
      e: WorkerEvents.TF_ERROR,
      msg: WorkerErrors.MODEL_LOAD_FAILED,
      err: e,
    });
    return;
  }
  postMessage({ e: WorkerEvents.TF_LOADED });
};

loadModel();

addEventListener("message", (e: WorkerMsg) => {
  switch (e.data.e) {
    case WorkerEvents.DETECT: {
      if (!model) {
        postMessage({
          e: WorkerEvents.TF_ERROR,
          msg: WorkerErrors.MODEL_NOT_LOADED,
        });
        return;
      }
      try {
        if (!e.data.bmp) {
          return postMessage({
            e: WorkerEvents.TF_ERROR,
            msg: WorkerErrors.PREDICTION_IMAGE_MISSING,
            err: e,
          });
        }

        model.classify(e.data.bmp).then((preds) => {
          try {
            postMessage({
              e: WorkerEvents.TF_PREDS,
              preds: preds
                .map((pred) => {
                  const breed = pred.className
                    .split(",")[0]
                    .toLowerCase()
                    .replaceAll("-", "");
                  return {
                    ...pred,
                    className: breed,
                    link: `https://dog.ceo/api/breed/${breeds[breed]}/images/random/`,
                  };
                })
                .filter((pred) => breeds[pred.className]),
            });
          } catch (e) {
            postMessage({
              e: WorkerEvents.TF_ERROR,
              msg: WorkerErrors.PREDICTION_PROCESSING_ERR,
              err: e,
            });
          }
        });
      } catch (e) {
        postMessage({
          e: WorkerEvents.TF_ERROR,
          msg: WorkerErrors.PREDICTION_ERR,
          err: e,
        });
      }
      break;
    }
    default:
      break;
  }
});
