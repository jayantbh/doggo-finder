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
  const imagesDir =
    process.env.NODE_ENV === "production"
      ? "sample-images"
      : "public/sample-images";
  const publicDir = process.env.NODE_ENV === "production" ? "" : "public";

  try {
    const imagesAbsDir = path.join(serverRuntimeConfig.PROJECT_ROOT, imagesDir);
    const files = fs.readdirSync(imagesAbsDir);

    const index = randomInt(0, files.length - 1);
    const file = files[index];

    return res.status(200).json({
      data: path.relative(
        path.join(serverRuntimeConfig.PROJECT_ROOT, publicDir),
        path.join(imagesAbsDir, file)
      ),
    });
  } catch (e) {
    return res.status(400).json({ err: e });
  }
};
