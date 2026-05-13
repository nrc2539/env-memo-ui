import { useSearchParams } from "react-router";

export function useGetQuery() {
  const [searchParams] = useSearchParams();

  function getStringParam(key: string) {
    return searchParams.get(key) || "";
  }

  function getBooleanParam(key: string) {
    return (searchParams.get(key) === "true") as boolean;
  }

  function getArrayParam(key: string) {
    const value = searchParams.get(key);
    return value ? value.split(",") : [];
  }

  function getNumberParam(key: string) {
    const value = searchParams.get(key);
    return value || value === "0" ? Number(value) : undefined;
  }

  return {
    getStringParam,
    getBooleanParam,
    getArrayParam,
    getNumberParam,
  };
}
