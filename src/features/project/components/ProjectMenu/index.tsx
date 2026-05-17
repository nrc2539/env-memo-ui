import { IconEdit, IconSettings, IconTrash } from "@tabler/icons-react";

import { useDropdown } from "@/hooks/useDropdown";

import type { ProjectMenuProps } from "./interface";

export function ProjectMenu({ project, onEdit, onDelete }: ProjectMenuProps) {
  const {
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    closeDropdown,
  } = useDropdown();

  const handleEdit = () => {
    onEdit(project);
    closeDropdown();
  };

  const handleDelete = () => {
    onDelete(project);
    closeDropdown();
  };

  return (
    <>
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <IconSettings className="size-5" />
      </button>
      {isOpen && (
        <div
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-20 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <IconEdit className="size-4" />
            Edit project
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <IconTrash className="size-4" />
            Delete project
          </button>
        </div>
      )}
    </>
  );
}
