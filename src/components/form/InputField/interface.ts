import type { InputProps } from "@/components/Input/interface";

export interface WithInputFieldProps extends Omit<InputProps, "value"> {
  name: string;
  autoTrim?: boolean;
}
