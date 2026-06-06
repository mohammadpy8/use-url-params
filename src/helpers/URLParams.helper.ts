import type { SortDir, SortGroup } from "./types";

const SORT_BY_PATTERN = /^(.+)\[sort_by\]$/;

export const getSortKeys = (model: string) => ({
  sortBy: `${model}[sort_by]`,
  sortDir: `${model}[sort_dir]`,
});

export const parseSortFromParams = (
  params: URLSearchParams,
  model: string
): SortGroup | null => {
  const { sortBy, sortDir } = getSortKeys(model);
  const sort_by = params.get(sortBy);
  const sort_dir = params.get(sortDir) as SortDir | null;

  if (!sort_by || !sort_dir) {
    return null;
  }
  return { sort_by, sort_dir };
};

export const parseAllSortsFromParams = (
  params: URLSearchParams
): Record<string, SortGroup> => {
  const result: Record<string, SortGroup> = {};

  params.forEach((value, key) => {
    const match = key.match(SORT_BY_PATTERN);
    if (match) {
      const model = match[1];
      const sort_dir = params.get(`${model}[sort_dir]`) as SortDir | null;
      if (sort_dir && model) {
        result[model] = { sort_by: value, sort_dir };
      }
    }
  });

  return result;
};

export const buildQueryString = (
  params: URLSearchParams,
  pathname: string
): string => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};
