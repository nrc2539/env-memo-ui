import type { ComponentPropsWithoutRef } from "react";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  label?: React.ReactNode;
  labelClassName?: string;
  showError?: boolean;
}
