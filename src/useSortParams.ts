import { useCallback } from "react";
import { getSortKeys, parseAllSortsFromParams, parseSortFromParams } from "./helpers";
import type { SortGroup, UseSortParams } from "./types";
import useURLParams from "./hooks/useURLParams";

export default function useSortParams(): UseSortParams {
  const { buildParams, pushParams } = useURLParams();

  const setSort = useCallback(
    (model: string, sort: SortGroup) => {
      const params = buildParams();
      const { sortBy, sortDir } = getSortKeys(model);
      params.set(sortBy, sort.sort_by);
      params.set(sortDir, sort.sort_dir);
      pushParams(params);
    },
    [buildParams, pushParams],
  );

  const getSort = useCallback(
    (model: string): SortGroup | null => {
      return parseSortFromParams(buildParams(), model);
    },
    [buildParams],
  );

  const getAllSort = useCallback((): Record<string, SortGroup> => {
    return parseAllSortsFromParams(buildParams());
  }, [buildParams]);

  const removeSort = useCallback(
    (model: string) => {
      const params = buildParams();
      const { sortBy, sortDir } = getSortKeys(model);
      params.delete(sortBy);
      params.delete(sortDir);
      pushParams(params);
    },
    [buildParams, pushParams],
  );

  return {
    getAllSort,
    getSort,
    removeSort,
    setSort,
  };
}
