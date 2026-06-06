import type { RefObject } from "react";

export type SortDir = "asc" | "desc";

export interface SortGroup {
  sort_by: string;
  sort_dir: SortDir;
}

export interface UseQueryParams {
  setParam: (key: string, value: string) => void;
  getParam: (key: string) => string | null;
  removeParam: (key: string) => void;
  removeAllParams: () => void;
  getAllParams: () => string;
}

export interface UseURLParams {
  buildParams: () => URLSearchParams;
  pushParams: (params: URLSearchParams) => void;
}

export interface UseSortParams {
  setSort: (model: string, sort: SortGroup) => void;
  getSort: (model: string) => SortGroup | null;
  getAllSort: () => Record<string, SortGroup>;
  removeSort: (model: string) => void;
}

export interface TURLParamsContext {
  pendingParams: RefObject<URLSearchParams | null>;
}
