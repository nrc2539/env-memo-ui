import { IconChevronRight } from "@tabler/icons-react";

import { cn } from "@/libs/utils";

import type { AccordionProps } from "./interface";

export function Accordion({ isOpen, onToggle, title, badge, actions, children }: AccordionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 transition hover:bg-gray-50">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-3 py-4 text-left"
        >
          <IconChevronRight
            className={cn("text-gray-400 transition-transform", isOpen && "rotate-90")}
            size={16}
          />
          <span className="font-medium text-gray-900">{title}</span>
          {badge !== undefined && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              {badge}
            </span>
          )}
        </button>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>

      {isOpen && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
}