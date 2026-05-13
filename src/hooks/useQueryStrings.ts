import { useMemo } from "react";
import { useSearchParams } from "react-router";

type QueryParamType = string | number | boolean | string[];

export function useQueryStrings<T extends Record<string, QueryParamType>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchObj: Partial<T> = useMemo(
    () => convertQueryStringsToObj(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  function convertQueryStringsToObj(params: URLSearchParams): Partial<T> {
    return Array.from(params.entries()).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: val,
      }),
      {},
    );
  }

  function updateQueryStrings(newParams: Partial<T>) {
    const newQueryStrings = new URLSearchParams();

    Object.keys(newParams).forEach((key) => {
      const value = newParams[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          newQueryStrings.set(key, value.join(","));
        }
      } else if (typeof value === "boolean") {
        newQueryStrings.set(key, value.toString());
      } else if (value || value === 0) {
        newQueryStrings.set(key, value.toString());
      }
    });

    setSearchParams(newQueryStrings);
  }

  return {
    searchObj,
    updateQueryStrings,
  };
}
