import { IconInfoCircleFilled } from "@tabler/icons-react";
import { cn } from "@/libs/utils";

import type { ErrorMessageProps } from "./interface";

export function ErrorMessage({ className, text }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[16px_1fr] gap-1 items-start mt-1",
        className,
      )}
    >
      <IconInfoCircleFilled className="text-red-500 size-4 shrink-0" />
      <div className="text-[12px] text-red-500 wrap-break-word">{text}</div>
    </div>
  );
}
