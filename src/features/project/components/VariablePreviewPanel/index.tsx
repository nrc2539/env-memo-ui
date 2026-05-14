import { IconCopy, IconX } from "@tabler/icons-react";

import type { VariablePreviewPanelProps } from "./interface";

export function VariablePreviewPanel({
  isOpen,
  selectedVars,
  onClose,
  onCopy,
}: VariablePreviewPanelProps) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-40 w-full max-w-md transform bg-white shadow-xl transition-transform lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "translate-x-full"} ${!isOpen && selectedVars.length === 0 ? "lg:hidden" : ""}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Selected variables
            <span className="ml-2 rounded-full bg-teal-100 px-2.5 py-0.5 text-sm text-teal-700">
              {selectedVars.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedVars.length === 0 ? (
            <p className="text-center text-sm text-gray-400">
              Select variables to preview them here.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedVars.map((v) => (
                <div
                  key={v.id}
                  className="group rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <code className="break-all text-sm text-gray-900">
                      {v.key}={v.value}
                    </code>
                    <button
                      type="button"
                      onClick={() => onCopy(`${v.key}=${v.value}`)}
                      className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                      title="Copy"
                    >
                      <IconCopy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedVars.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={() =>
                onCopy(
                  selectedVars.map((v) => `${v.key}=${v.value}`).join("\n"),
                )
              }
              className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
            >
              Copy all ({selectedVars.length} variables)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}