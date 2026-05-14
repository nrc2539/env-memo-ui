import { cn } from "@/libs/utils";

import type { LoadingProps } from "./interface";

const sizeStyles = {
  sm: "size-5 border-2",
  md: "size-8 border-[3px]",
  lg: "size-12 border-4",
};

export function Loading({
  size = "md",
  className,
  text = "Loading...",
}: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            "animate-spin rounded-full border-teal-600 border-t-transparent",
            sizeStyles[size],
            className,
          )}
        />
        <div className="text-teal-600 text-lg font-medium">{text}</div>
      </div>
    </div>
  );
}
