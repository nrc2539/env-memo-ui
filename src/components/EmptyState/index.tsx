import { IconBox } from "@tabler/icons-react";
import { cn } from "@/libs/utils";

import type { EmptyStateProps } from "./interface";

export function EmptyState({ text, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <IconBox className="size-16 text-gray-300 mb-4" stroke={1.5} />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
