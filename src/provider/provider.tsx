import { type PropsWithChildren, useContext, useRef } from "react";
import { URLParamsContext } from "../context";

export default function URLParamsProvider(props: PropsWithChildren) {
  const { children } = props;
  const pendingParams = useRef<URLSearchParams | null>(null);

  return <URLParamsContext.Provider value={{ pendingParams }}>{children}</URLParamsContext.Provider>;
}

export function usePendingParams() {
  const ctx = useContext(URLParamsContext);
  if (!ctx) {
    throw new Error("[use-url-params] usePendingParams must be used within <URLParamsProvider>");
  }
  return ctx;
}
