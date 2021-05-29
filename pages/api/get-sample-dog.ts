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

// Reverted the original approach of reading files at runtime and picking one
// at random due to this issue: https://github.com/vercel/next.js/issues/8251

export default async (
  req: NextApiRequest,
  res: NextApiResponse<RequestPayload>
) => {
  try {
    const index = randomInt(1, 5);
    const file = `sample-images/sample-${index}.png`;

    return res.status(200).json({ data: file });
  } catch (e) {
    return res.status(400).json({ err: e });
  }
};
