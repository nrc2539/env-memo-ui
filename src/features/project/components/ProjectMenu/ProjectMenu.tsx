import { IconSettings, IconEdit, IconTrash } from "@tabler/icons-react";

import type { ProjectMenuViewProps } from "./interface";

export default function ProjectMenu({ isOpen, onToggle, onEdit, onDelete }: ProjectMenuViewProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <IconSettings className="size-5" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={onEdit}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <IconEdit className="size-4" />
              Edit project
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <IconTrash className="size-4" />
              Delete project
            </button>
          </div>
        </>
      )}
    </div>
  );
}