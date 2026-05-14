import { Link } from "react-router";
import {
  IconChevronRight,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconEye,
  IconX,
  IconCopy,
} from "@tabler/icons-react";

import { ProjectMenu } from "@/components/ProjectMenu";

import type { EnvVariable, ProjectDetailPageProps } from "./interface";

export default function ProjectDetailPage({
  projectId,
  projectName,
  groups = [],
  expanded,
  selected,
  panelOpen,
  toast,
  onToggleGroup,
  onToggleVar,
  onToggleGroupAll,
  onCopyToClipboard,
  onSetPanelOpen,
}: ProjectDetailPageProps) {
  const selectedVars: EnvVariable[] = [];
  for (const group of groups) {
    for (const v of group.variables) {
      if (selected?.has(v.id)) selectedVars.push(v);
    }
  }

  const groupCount = groups.length;
  const totalVars = groups.reduce((s, g) => s + g.variables.length, 0);

  return (
    <>
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-slide-up rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
      <div className="flex h-full gap-6 overflow-hidden">
        <div
          className={`flex flex-1 flex-col overflow-hidden ${panelOpen ? "hidden lg:flex" : "flex"}`}
        >
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 pb-4">
            <div>
              <nav className="mb-1 text-sm text-gray-500">
                <Link to="/projects" className="hover:text-teal-600">
                  Projects
                </Link>
                <span className="mx-2">/</span>
                <Link to={`/projects/${projectId}`}>
                  <span className="text-gray-900">{projectName}</span>
                </Link>
              </nav>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {projectName}
                </h1>
                <ProjectMenu />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {groupCount} environment groups &middot; {totalVars} variables
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <IconUserPlus size={16} />
                  Invite user
                </span>
              </button>
              <button
                type="button"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
              >
                Create env group
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {groups.map((group) => {
                const isOpen = expanded?.has(group.id);
                return (
                  <div
                    key={group.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between px-5 transition hover:bg-gray-50">
                      <button
                        type="button"
                        onClick={() => onToggleGroup(group.id)}
                        className="flex flex-1 items-center gap-3 py-4 text-left"
                      >
                        <IconChevronRight
                          className={`text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                          size={16}
                        />
                        <span className="font-medium text-gray-900">
                          {group.name}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                          {group.variables.length}
                        </span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onToggleGroup(group.id)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                          title="Add variable"
                        >
                          <IconPlus size={16} />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                          title="Edit group"
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                          title="Delete group"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-gray-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500">
                              <th className="w-12 px-5 py-3">
                                <input
                                  type="checkbox"
                                  checked={group.variables.every((v) =>
                                    selected?.has(v.id),
                                  )}
                                  onChange={() => onToggleGroupAll(group)}
                                  className="h-4 w-4 rounded border-gray-300 text-teal-600 outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                              </th>
                              <th className="px-0 py-3">Key</th>
                              <th className="px-5 py-3">Value</th>
                              <th className="w-24 px-4 py-3 text-right">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.variables.map((v) => (
                              <tr
                                key={v.id}
                                className={`border-t border-gray-100 transition ${selected?.has(v.id) ? "bg-teal-50" : "hover:bg-gray-50"}`}
                              >
                                <td className="px-5 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selected?.has(v.id)}
                                    onChange={() => onToggleVar(v.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-teal-600 outline-none focus:ring-2 focus:ring-teal-500/20"
                                  />
                                </td>
                                <td className="px-0 py-3 font-mono text-sm font-medium text-gray-900">
                                  {v.key}
                                </td>
                                <td className="max-w-50 truncate px-5 py-3 font-mono text-sm text-gray-600 lg:max-w-xs">
                                  {v.value}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                                      title="Edit variable"
                                    >
                                      <IconEdit size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-100 hover:text-red-500"
                                      title="Delete variable"
                                    >
                                      <IconTrash size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedVars.length > 0 && (
          <button
            type="button"
            onClick={() => onSetPanelOpen(true)}
            className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
          >
            <IconEye size={20} />
            Preview ({selectedVars.length})
          </button>
        )}

        {panelOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => onSetPanelOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 right-0 z-40 w-full max-w-md transform bg-white shadow-xl transition-transform lg:static lg:translate-x-0 ${panelOpen ? "translate-x-0" : "translate-x-full"} ${!panelOpen && selectedVars.length === 0 ? "lg:hidden" : ""}`}
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
                onClick={() => onSetPanelOpen(false)}
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
                          onClick={() =>
                            onCopyToClipboard(`${v.key}=${v.value}`)
                          }
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
                    onCopyToClipboard(
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
      </div>
    </>
  );
}
