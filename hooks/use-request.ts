import { useState, useCallback, useMemo, useRef } from "react";
import { RequestState } from "../types/types";
import { request } from "../utils/request";

type Args<T> = {
  initialValue?: T;
};
type ReturnT<T> = [
  (input: RequestInfo, init?: RequestInit | undefined) => Promise<T>,
  RequestState,
  T | undefined | Error
];

export const useRequest = <T = any>({
  initialValue,
}: Args<T> = {}): ReturnT<T> => {
  const [state, setState] = useState<RequestState>(RequestState.DORMANT);
  const [data, setData] = useState<T | undefined | Error>(initialValue);

  const prevController = useRef<{
    controller: AbortController | null;
    signal: AbortSignal | null;
  }>({ controller: null, signal: null });

  const callback = useCallback(
    async (input: RequestInfo, init?: RequestInit | undefined): Promise<T> => {
      const controller = new AbortController();
      const signal = controller.signal;

      if (state === RequestState.LOADING) {
        prevController.current.controller?.abort();
      }

      prevController.current = {
        controller,
        signal,
      };

      setState(RequestState.LOADING);
      try {
        const response = await request<T>(input, { signal });

        setState(RequestState.SUCCESS);
        setData(response);
        return response;
      } catch (e) {
        if (e.name === "AbortError") return e;
        setState(RequestState.FAILURE);
        setData(e);
        return Promise.reject(e);
      }
    },
    [setState, setData, state]
  );

  return [callback, state, data];
};
