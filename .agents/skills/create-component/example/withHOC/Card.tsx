import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import type { CardProps } from "./interface";

export default function Card({ title, description, isExpanded, onToggleExpand }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onToggleExpand}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
        </button>
      </div>
      {isExpanded && <p className="mt-2 text-gray-600">{description}</p>}
    </div>
  );
}
