import { useField } from "formik";

import type { InputProps } from "@/components/Input/interface";

import type { WithInputFieldProps } from "./interface";

export function withInputField(Component: React.FC<InputProps>) {
  function WithInputField({
    name,
    autoTrim = true,
    onBlur,
    ...props
  }: WithInputFieldProps) {
    const [field, { touched, error }, { setValue }] = useField(name);

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      if (onBlur) {
        onBlur(e);
      }
      if (autoTrim) {
        const { value } = e.target;
        setValue(value.trim());
      }
      field.onBlur(e);
    }

    const componentProps = {
      ...props,
      ...field,
      errorMessage: touched && !!error ? error : "",
      onBlur: handleBlur,
    };

    return <Component {...componentProps} />;
  }

  return WithInputField;
}
