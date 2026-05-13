import { FloatingOverlay } from "@floating-ui/react";

import { cn } from "@/libs/utils";

import type { ModalProps } from "./interface";
import { IconXFilled } from "@tabler/icons-react";

export function Modal({
  children,
  className,
  containerClassName,
  isOpen,
  onClose,
}: ModalProps) {
  return (
    <FloatingOverlay
      onClick={(e) => e.stopPropagation()}
      lockScroll={isOpen}
      className={cn(
        "fixed bg-black/40 top-0 left-0 w-full h-full flex justify-center items-center z-20 animate-fade-in",
        containerClassName,
        { hidden: !isOpen },
      )}
    >
      <div
        className={cn(
          "relative p-8 w-full bg-white rounded-2xl shadow-level-4 max-h-[90dvh] overflow-auto max-w-180",

          className,
        )}
      >
        {onClose && (
          <button
            type="button"
            className="absolute top-6 right-6"
            onClick={onClose}
          >
            <IconXFilled className="size-6 text-black" />
          </button>
        )}
        {children}
      </div>
    </FloatingOverlay>
  );
}
