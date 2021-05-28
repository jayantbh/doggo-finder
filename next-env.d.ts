/// <reference types="next" />
/// <reference types="next/types/global" />

import { MobileNet } from "@tensorflow-models/mobilenet";

declare module "@tensorflow-models/mobilenet" {
  interface MobileNet {
    classify(
      img: ImageBitmap,
      topk?: number
    ): Promise<
      Array<{
        className: string;
        probability: number;
      }>
    >;
  }
}
