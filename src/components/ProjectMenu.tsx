import { useState } from "react";
import { IconSettings, IconEdit, IconTrash } from "@tabler/icons-react";

export function ProjectMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <IconSettings size={20} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <IconEdit size={16} />
              Edit project
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <IconTrash size={16} />
              Delete project
            </button>
          </div>
        </>
      )}
    </div>
  );
}
