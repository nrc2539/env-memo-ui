import type { InputProps } from "@/components/Input/interface";

export interface PasswordInputFieldProps extends Omit<InputProps, "type" | "value"> {
  name: string;
}
