import { forwardRef } from "react";
import { cn } from "@/libs/utils.ts";
import type { InputProps } from "./interface.ts";
import { ErrorMessage } from "../ErrorMessage/index.tsx";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      errorMessage,
      className,
      leftIcon,
      label,
      labelClassName,
      showError = true,
      ...props
    },
    ref,
  ) => {
    return (
      <div>
        {label && (
          <div
            className={cn(
              "text-[14px] text-black font-normal mb-1",
              labelClassName,
            )}
          >
            {label}
          </div>
        )}
        <div
          className={cn(
            "px-4 py-2 flex items-center border rounded-lg bg-white [&:has(input:focus)]:border-teal-500 [&:has(input:disabled)]:bg-gray-200 border-gray-300",
            { "border-red-500": !!errorMessage },
          )}
        >
          {leftIcon}
          <input
            ref={ref}
            className={cn(
              "w-full text-sm bg-transparent outline-none transition placeholder:text-gray-400",
              className,
            )}
            {...props}
          />
        </div>
        {showError && (
          <div className={cn(!errorMessage && "invisible")}>
            <ErrorMessage text={errorMessage || ""} />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
