import { IconEdit, IconTrash } from "@tabler/icons-react";

import type { EnvVariableTableProps } from "./interface";
import { cn } from "@/libs/utils";

export function EnvVariableTable({
  variables,
  selected,
  onToggleAll,
  onToggleVar,
  onEdit,
  onDelete,
}: EnvVariableTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500">
            <th className="w-7 px-2 sm:px-3 py-3">
              <input
                type="checkbox"
                checked={variables.every((v) => selected?.has(v.id) ?? false)}
                onChange={onToggleAll}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </th>
            <th className="px-2 sm:px-3 py-3">Key</th>
            <th className="px-2 sm:px-3 py-3">Value</th>
            {onEdit && onDelete && (
              <th className="w-14 px-2 sm:px-3 py-3 text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {variables.map((v) => (
            <tr
              key={v.id}
              className={cn("border-t border-gray-100 transition", {
                "bg-teal-100": selected?.has(v.id),
                "hover:bg-gray-50": !selected?.has(v.id),
              })}
            >
              <td className="px-2 sm:px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected?.has(v.id) ?? false}
                  onChange={() => onToggleVar(v.id)}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </td>
              <td className="max-w-20 sm:max-w-30 truncate px-1.5 sm:px-3 py-3 font-mono text-sm font-medium text-gray-900">
                {v.key}
              </td>
              <td className="max-w-28 sm:max-w-50 truncate px-1.5 sm:px-3 py-3 font-mono text-sm text-gray-600 lg:max-w-xs">
                {v.value}
              </td>
              {onEdit && onDelete && (
                <td className="px-2 sm:px-3 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(v)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                      title="Edit variable"
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(v)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-100 hover:text-red-500"
                      title="Delete variable"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
