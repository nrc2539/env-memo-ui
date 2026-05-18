import type { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function formatNumber(
  value: number,
  { minFracDigits = 0, maxFracDigits = 2 } = {
    minFracDigits: 0,
    maxFracDigits: 2,
  },
) {
  if (value == null || isNaN(value)) {
    return "0";
  }

  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: minFracDigits,
    maximumFractionDigits: maxFracDigits,
  });

  return formattedValue;
}

export function formatDate(
  date: string | Date | undefined,
  format = "LLL d, yyyy",
) {
  if (!date) return "-";
  const newDate = DateTime.fromISO(new Date(date).toISOString());
  return newDate.toFormat(format);
}

export function getErrorMessage(e: AxiosError): string {
  const data = e.response?.data as { message?: string } | undefined;
  return data?.message || "Something wrong.";
}
