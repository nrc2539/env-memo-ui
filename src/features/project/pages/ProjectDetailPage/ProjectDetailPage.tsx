import { useState } from "react";
import { Link } from "react-router";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
} from "@tabler/icons-react";

import { cn } from "@/libs/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Accordion } from "@/components/Accordion";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Loading } from "@/components/Loading";
import { ProjectMenu } from "@/features/project/components/ProjectMenu";
import { ProjectModal } from "@/features/project/components/ProjectModal";
import { EnvGroupModal } from "@/features/project/components/EnvGroupModal";
import { EnvVariableModal } from "@/features/project/components/EnvVariableModal";
import { EnvVariableTable } from "@/features/project/components/EnvVariableTable";
import { VariablePreviewPanel } from "@/features/project/components/VariablePreviewPanel";
import { Role } from "@/enums/roleEnum";
import type { EnvVariableType } from "@/models/EnvVariableType";

import type {
  ProjectDetailModalStateType,
  ProjectDetailPageProps,
} from "./interface";

export default function ProjectDetailPage({
  projectId,
  projectName,
  projectDescription,
  isLoading,
  groups = [],
  expanded,
  selected,
  panelOpen,
  toast,
  currentUserRole,
  onExpandGroup,
  onSelectVar,
  onSelectVarAll,
  onCopyToClipboard,
  onSetPanelOpen,
  onEditProject,
  onDeleteProject,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onCreateVariable,
  onEditVariable,
  onDeleteVariable,
}: ProjectDetailPageProps) {
  const [modalState, setModalState] = useState<ProjectDetailModalStateType>({
    type: undefined,
    data: undefined,
  });

  const isOwner = currentUserRole === Role.OWNER;
  const isViewer = currentUserRole === Role.VIEWER;

  const selectedVars: EnvVariableType[] = [];
  for (const group of groups) {
    for (const v of group.variables) {
      if (selected?.has(v.id)) selectedVars.push(v);
    }
  }

  const hasSelectedVars = selectedVars.length > 0;

  const groupCount = groups.length;
  const totalVars = groups.reduce((s, g) => s + g.variables.length, 0);

  function handleOpenModal(state: ProjectDetailModalStateType) {
    setModalState(state);
  }

  function handleCloseModal() {
    setModalState({ type: undefined, data: undefined });
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-slide-up rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
      <div className="flex h-full gap-6 overflow-hidden">
        <div
          className={cn("flex flex-1 flex-col overflow-y-auto", {
            "lg:flex": panelOpen,
          })}
        >
          {isLoading ? (
            <div className="mt-5">
              <Loading />
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row shrink-0 flex-wrap items-end lg:justify-between gap-4 pb-4">
                <div
                  className={cn("max-w-full lg:max-w-1/2", {
                    "lg:max-w-full": hasSelectedVars,
                  })}
                >
                  <Breadcrumb
                    items={[
                      { label: "Projects", href: "/projects" },
                      { label: projectName ?? "" },
                    ]}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        {projectName}
                      </h1>
                      {isOwner && (
                        <ProjectMenu
                          project={{
                            id: Number(projectId),
                            name: projectName ?? "",
                            description: projectDescription ?? "",
                            createdAt: "",
                            updatedAt: "",
                          }}
                          onEdit={() =>
                            handleOpenModal({ type: "editProject" })
                          }
                          onDelete={() =>
                            handleOpenModal({ type: "deleteProject" })
                          }
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {projectDescription}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {groupCount} environment groups &middot; {totalVars}
                    &nbsp;variables
                  </p>
                </div>
                <div
                  className={cn("w-full md:w-auto flex gap-3", {
                    "ml-auto": hasSelectedVars,
                  })}
                >
                  <Link
                    to={`/projects/${projectId}/members`}
                    className="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <IconUsers size={16} />
                      {isOwner ? "Manage Member" : "View Member"}
                    </span>
                  </Link>
                  {!isViewer && (
                    <button
                      type="button"
                      onClick={() => handleOpenModal({ type: "createGroup" })}
                      className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
                    >
                      Create env group
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-3">
                  {groups.map((group) => {
                    const isOpen = expanded?.has(group.id) ?? false;
                    return (
                      <Accordion
                        key={group.id}
                        isOpen={isOpen}
                        onExpand={() => onExpandGroup(group.id)}
                        title={group.name}
                        badge={group.variables.length}
                        actions={
                          !isViewer ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal({
                                    type: "createVariable",
                                    data: { group },
                                  })
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                                title="Add variable"
                              >
                                <IconPlus size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal({
                                    type: "editGroup",
                                    data: { group },
                                  })
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                                title="Edit group"
                              >
                                <IconEdit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal({
                                    type: "deleteGroup",
                                    data: { group },
                                  })
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                                title="Delete group"
                              >
                                <IconTrash size={16} />
                              </button>
                            </div>
                          ) : undefined
                        }
                      >
                        <EnvVariableTable
                          variables={group.variables}
                          selected={selected}
                          onToggleAll={() => onSelectVarAll(group)}
                          onToggleVar={onSelectVar}
                          onEdit={
                            !isViewer
                              ? (variable) =>
                                  handleOpenModal({
                                    type: "editVariable",
                                    data: { variable },
                                  })
                              : undefined
                          }
                          onDelete={
                            !isViewer
                              ? (variable) =>
                                  handleOpenModal({
                                    type: "deleteVariable",
                                    data: { variable },
                                  })
                              : undefined
                          }
                        />
                      </Accordion>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {selectedVars.length > 0 && (
          <button
            type="button"
            onClick={() => onSetPanelOpen(true)}
            className="fixed bottom-6 right-6 z-10 flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
          >
            <IconEye size={20} />
            Preview ({selectedVars.length})
          </button>
        )}

        {panelOpen && (
          <div
            className="fixed inset-0 z-11 bg-black/40 lg:hidden"
            onClick={() => onSetPanelOpen(false)}
          />
        )}

        <VariablePreviewPanel
          isOpen={panelOpen ?? false}
          selectedVars={selectedVars}
          onClose={() => onSetPanelOpen(false)}
          onCopy={(text) => onCopyToClipboard(text)}
        />
      </div>

      <ProjectModal
        isOpen={modalState.type === "editProject"}
        isEdit={true}
        initialValues={{
          name: projectName ?? "",
          description: projectDescription ?? "",
        }}
        onSubmit={async (values) => {
          if (onEditProject) {
            await onEditProject(values.name, values.description);
          }
          handleCloseModal();
        }}
        onCancel={handleCloseModal}
      />

      <ConfirmModal
        isOpen={modalState.type === "deleteProject"}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (onDeleteProject) await onDeleteProject();
          handleCloseModal();
        }}
        onCancel={handleCloseModal}
      />

      {(modalState.type === "editGroup" ||
        modalState.type === "createGroup") && (
        <EnvGroupModal
          isOpen
          isEdit={modalState.type === "editGroup"}
          initialValues={
            modalState.data?.group?.id
              ? { name: modalState.data?.group.name }
              : undefined
          }
          onSubmit={async (values) => {
            if (
              modalState.type === "editGroup" &&
              !!modalState.data?.group?.id &&
              onEditGroup
            ) {
              await onEditGroup(modalState.data.group.id, values.name);
            } else if (onCreateGroup) {
              await onCreateGroup(values.name);
            }
            handleCloseModal();
          }}
          onCancel={handleCloseModal}
        />
      )}

      <ConfirmModal
        isOpen={modalState.type === "deleteGroup" && !!modalState.data?.group}
        title="Delete Environment Group"
        message={`Are you sure you want to delete "${modalState.data?.group?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (modalState.data?.group?.id && onDeleteGroup)
            await onDeleteGroup(modalState.data.group.id);
          handleCloseModal();
        }}
        onCancel={handleCloseModal}
      />

      {(modalState.type === "createVariable" ||
        modalState.type === "editVariable") && (
        <EnvVariableModal
          isOpen
          isEdit={modalState.type === "editVariable"}
          initialValues={
            modalState.data?.variable
              ? {
                  key: modalState.data.variable.key,
                  value: modalState.data.variable.value,
                }
              : undefined
          }
          onSubmit={async (values) => {
            if (
              modalState.type === "editVariable" &&
              modalState.data?.variable &&
              onEditVariable
            ) {
              await onEditVariable(
                modalState.data.variable,
                values.key,
                values.value,
              );
            } else if (modalState.data?.group?.id && onCreateVariable) {
              await onCreateVariable(
                modalState.data.group.id,
                values.key,
                values.value,
              );
            }
            handleCloseModal();
          }}
          onCancel={handleCloseModal}
        />
      )}

      <ConfirmModal
        isOpen={modalState.type === "deleteVariable"}
        title="Delete Variable"
        message={`Are you sure you want to delete "${modalState.data?.variable?.key}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (modalState.data?.variable && onDeleteVariable)
            await onDeleteVariable(modalState.data.variable);
          handleCloseModal();
        }}
        onCancel={handleCloseModal}
      />
    </>
  );
}
