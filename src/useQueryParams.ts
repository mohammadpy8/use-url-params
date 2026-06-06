import { useCallback } from "react";
import { buildQueryString } from "./helpers";
import { usePendingParams } from "./provider/provider";
import type { UseQueryParams } from "./types";
import useURLParams from "./hooks/useURLParams";

export default function useQueryParams(): UseQueryParams {
  const { buildParams, pushParams } = useURLParams();
  const { pendingParams } = usePendingParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = buildParams();
      params.set(key, value);
      pushParams(params);
    },
    [buildParams, pushParams],
  );

  const getParam = useCallback(
    (key: string): string | null => {
      return buildParams().get(key);
    },
    [buildParams],
  );

  const removeParam = useCallback(
    (key: string) => {
      const params = buildParams();
      params.delete(key);
      pushParams(params);
    },
    [buildParams, pushParams],
  );

  const removeAllParams = useCallback(() => {
    pendingParams.current = null;
    window.history.pushState(null, "", window.location.pathname);
  }, [pendingParams]);

  const getAllParams = useCallback((): string => {
    return buildQueryString(buildParams(), window.location.pathname);
  }, [buildParams]);

  return {
    getAllParams,
    getParam,
    removeAllParams,
    removeParam,
    setParam,
  };
}
