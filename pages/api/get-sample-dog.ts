// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

import { GetSampleResponse } from "../../types/api";
import { randomInt } from "../../utils/math";

export type RequestPayload = {
  err?: any;
  data?: GetSampleResponse;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<RequestPayload>
) => {
  try {
    const imagesDir = path.join(
      serverRuntimeConfig.PROJECT_ROOT,
      "public/sample-images"
    );
    const files = fs.readdirSync(imagesDir);

    const index = randomInt(0, files.length - 1);
    const file = files[index];

    return res.status(200).json({
      data: path.relative(
        path.join(serverRuntimeConfig.PROJECT_ROOT, "public"),
        path.join(imagesDir, file)
      ),
    });
  } catch (e) {
    return res.status(400).json({ err: e });
  }
};
