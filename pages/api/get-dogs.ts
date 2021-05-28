// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "../../utils/request";

import { GetDogsResponse } from "../../types/api";

export type RequestPayload = {
  err?: any;
  data?: GetDogsResponse["message"];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<RequestPayload>
) => {
  try {
    if (req.query.link) {
      const response = await request<GetDogsResponse>(
        req.query.link as string
      ).then((r) => r.message);

      return res.status(200).json({ data: response });
    }
  } catch (e) {
    return res.status(400).json({ err: e });
  }
  return res.status(400).json({ err: "Missing query param: link" });
};
