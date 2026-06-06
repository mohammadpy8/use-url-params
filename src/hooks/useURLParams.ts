import { useCallback } from "react";
import { buildQueryString } from "../helpers";
import { usePendingParams } from "../provider/provider";
import type { UseURLParams } from "../types";

export default function useURLParams(): UseURLParams {
  const { pendingParams } = usePendingParams();

  const buildParams = useCallback((): URLSearchParams => {
    if (pendingParams.current) {
      return new URLSearchParams(pendingParams.current.toString());
    }
    return new URLSearchParams(window.location.search);
  }, [pendingParams]);

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      pendingParams.current = params;
      const newUrl = buildQueryString(params, window.location.pathname);
      window.history.pushState(null, "", newUrl);
    },
    [pendingParams],
  );

  return { buildParams, pushParams };
}
