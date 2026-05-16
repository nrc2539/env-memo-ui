import { useState } from "react";
import { useField } from "formik";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import Input from "@/components/Input";

import type { PasswordInputFieldProps } from "./interface";

export default function PasswordInputField({
  name,
  ...props
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [field, { touched, error }] = useField(name);

  return (
    <Input
      {...props}
      {...field}
      type={showPassword ? "text" : "password"}
      errorMessage={touched && !!error ? error : ""}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          className="text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
      }
    />
  );
}
