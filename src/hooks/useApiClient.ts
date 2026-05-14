import { useContext } from "react";
import type { AxiosInstance } from "axios";
import { ApiClientContext } from "../contexts/ApiClientContext";

export function useApiClient(): AxiosInstance {
  const { client } = useContext(ApiClientContext);
  return client;
}
