import { useField } from "formik";

import type { WithDropdownProps } from "@/components/Dropdown/interface";

import type { WithDropdownFieldProps } from "./interface";

export function withDropdownField(Component: React.FC<WithDropdownProps>) {
  function WithDropdownField({
    name,
    onSelect,
    onClear,
    ...props
  }: WithDropdownFieldProps) {
    const [field, { touched, error }, { setValue, setTouched }] =
      useField(name);

    function handleOpenChange(value: boolean) {
      if (value === false && touched === false) {
        setTouched(true);
      }
    }

    function handleSelect(value: string) {
      setValue(value);
      if (onSelect) {
        onSelect(value);
      }
    }

    function handleClear() {
      setValue("");
      if (onClear) {
        onClear();
      }
    }

    const componentProps: WithDropdownProps = {
      ...props,
      ...field,
      errorMessage: touched && !!error ? error : "",
      onSelect: handleSelect,
      onClear: handleClear,
      handleOpenChange,
    };

    return <Component {...componentProps} />;
  }

  return WithDropdownField;
}
