import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconEye,
} from "@tabler/icons-react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Accordion } from "@/components/Accordion";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ProjectMenu } from "@/features/project/components/ProjectMenu";
import { ProjectModal } from "@/features/project/components/ProjectModal";
import { EnvGroupModal } from "@/features/project/components/EnvGroupModal";
import { EnvVariableModal } from "@/features/project/components/EnvVariableModal";
import { EnvVariableTable } from "@/features/project/components/EnvVariableTable";
import { VariablePreviewPanel } from "@/features/project/components/VariablePreviewPanel";

import { InviteUserModal } from "@/features/project/components/InviteUserModal";
import { getAvailableRoles, Role } from "@/enums/roleEnum";

import type {
  EnvVariable,
  EnvGroup,
  ProjectDetailPageProps,
} from "./interface";

export default function ProjectDetailPage({
  projectId,
  projectName,
  groups = [],
  expanded,
  selected,
  panelOpen,
  toast,
  currentUserRole,
  onToggleGroup,
  onToggleVar,
  onToggleGroupAll,
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
  onInviteUser,
}: ProjectDetailPageProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditGroup, setIsEditGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<EnvGroup | null>(null);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<EnvGroup | null>(null);

  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isEditVariable, setIsEditVariable] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<EnvVariable | null>(
    null,
  );
  const [selectedVariableGroupId, setSelectedVariableGroupId] = useState<
    string | null
  >(null);
  const [isDeleteVariableModalOpen, setIsDeleteVariableModalOpen] =
    useState(false);
  const [variableToDelete, setVariableToDelete] = useState<EnvVariable | null>(
    null,
  );

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const isOwner = currentUserRole === Role.OWNER;
  const isViewer = currentUserRole === Role.VIEWER;

  const selectedVars: EnvVariable[] = [];
  for (const group of groups) {
    for (const v of group.variables) {
      if (selected?.has(v.id)) selectedVars.push(v);
    }
  }

  const groupCount = groups.length;
  const totalVars = groups.reduce((s, g) => s + g.variables.length, 0);

  function handleOpenEditProject() {
    setIsProjectModalOpen(true);
  }

  function handleOpenDeleteProject() {
    setIsDeleteProjectModalOpen(true);
  }

  function handleOpenCreateGroup() {
    setIsEditGroup(false);
    setSelectedGroup(null);
    setIsGroupModalOpen(true);
  }

  function handleOpenEditGroup(group: EnvGroup) {
    setIsEditGroup(true);
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  }

  function handleOpenDeleteGroup(group: EnvGroup) {
    setGroupToDelete(group);
    setIsDeleteGroupModalOpen(true);
  }

  function handleOpenCreateVariable(groupId: string) {
    setIsEditVariable(false);
    setSelectedVariable(null);
    setSelectedVariableGroupId(groupId);
    setIsVariableModalOpen(true);
  }

  function handleOpenEditVariable(variable: EnvVariable) {
    setIsEditVariable(true);
    setSelectedVariable(variable);
    setIsVariableModalOpen(true);
  }

  function handleOpenDeleteVariable(variable: EnvVariable) {
    setVariableToDelete(variable);
    setIsDeleteVariableModalOpen(true);
  }

  function handleOpenInviteModal() {
    setIsInviteModalOpen(true);
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
          className={`flex flex-1 flex-col overflow-hidden ${panelOpen ? "hidden lg:flex" : "flex"}`}
        >
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 pb-4">
            <div>
              <Breadcrumb
                items={[
                  { label: "Projects", href: "/projects" },
                  { label: projectName ?? "" },
                ]}
              />
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {projectName}
                </h1>
                {isOwner && (
                  <ProjectMenu
                    project={{
                      id: Number(projectId),
                      name: projectName ?? "",
                      description: null,
                      createdAt: "",
                      updatedAt: "",
                    }}
                    onEdit={handleOpenEditProject}
                    onDelete={handleOpenDeleteProject}
                  />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {groupCount} environment groups &middot; {totalVars} variables
              </p>
            </div>
            <div className="flex gap-3">
              {isOwner && (
                <button
                  type="button"
                  onClick={handleOpenInviteModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <IconUserPlus size={16} />
                    Invite user
                  </span>
                </button>
              )}
              {!isViewer && (
                <button
                  type="button"
                  onClick={handleOpenCreateGroup}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
                >
                  Create env group
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {groups.map((group) => {
                const isOpen = expanded?.has(group.id) ?? false;
                return (
                  <Accordion
                    key={group.id}
                    isOpen={isOpen}
                    onToggle={() => onToggleGroup(group.id)}
                    title={group.name}
                    badge={group.variables.length}
                    actions={
                      !isViewer ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenCreateVariable(group.id)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                            title="Add variable"
                          >
                            <IconPlus size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditGroup(group)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                            title="Edit group"
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteGroup(group)}
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
                      onToggleAll={() => onToggleGroupAll(group)}
                      onToggleVar={onToggleVar}
                      onEdit={!isViewer ? handleOpenEditVariable : undefined}
                      onDelete={!isViewer ? handleOpenDeleteVariable : undefined}
                    />
                  </Accordion>
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

        <VariablePreviewPanel
          isOpen={panelOpen ?? false}
          selectedVars={selectedVars}
          onClose={() => onSetPanelOpen(false)}
          onCopy={(text) => onCopyToClipboard(text)}
        />
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        isEdit={true}
        initialValues={{
          name: projectName ?? "",
          description: "",
        }}
        onSubmit={async (values) => {
          if (onEditProject) {
            await onEditProject(values.name, values.description);
          }
          setIsProjectModalOpen(false);
        }}
        onCancel={() => setIsProjectModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteProjectModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (onDeleteProject) await onDeleteProject();
          setIsDeleteProjectModalOpen(false);
        }}
        onCancel={() => setIsDeleteProjectModalOpen(false)}
      />

      {isGroupModalOpen && (
        <EnvGroupModal
          isOpen={isGroupModalOpen}
          isEdit={isEditGroup}
          initialValues={
            selectedGroup ? { name: selectedGroup.name } : undefined
          }
          onSubmit={async (values) => {
            if (isEditGroup && selectedGroup && onEditGroup) {
              await onEditGroup(selectedGroup.id, values.name);
            } else if (onCreateGroup) {
              await onCreateGroup(values.name);
            }
            setIsGroupModalOpen(false);
            setSelectedGroup(null);
          }}
          onCancel={() => {
            setIsGroupModalOpen(false);
            setSelectedGroup(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteGroupModalOpen}
        title="Delete Environment Group"
        message={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (groupToDelete && onDeleteGroup)
            await onDeleteGroup(groupToDelete.id);
          setIsDeleteGroupModalOpen(false);
          setGroupToDelete(null);
        }}
        onCancel={() => {
          setIsDeleteGroupModalOpen(false);
          setGroupToDelete(null);
        }}
      />

      {isVariableModalOpen && (
        <EnvVariableModal
          isOpen={isVariableModalOpen}
          isEdit={isEditVariable}
          initialValues={
            selectedVariable
              ? { key: selectedVariable.key, value: selectedVariable.value }
              : undefined
          }
          onSubmit={async (values) => {
            if (isEditVariable && selectedVariable && onEditVariable) {
              await onEditVariable(
                selectedVariable,
                values.key,
                values.value,
              );
            } else if (selectedVariableGroupId && onCreateVariable) {
              await onCreateVariable(
                selectedVariableGroupId,
                values.key,
                values.value,
              );
            }
            setIsVariableModalOpen(false);
            setSelectedVariable(null);
            setSelectedVariableGroupId(null);
          }}
          onCancel={() => {
            setIsVariableModalOpen(false);
            setSelectedVariable(null);
            setSelectedVariableGroupId(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteVariableModalOpen}
        title="Delete Variable"
        message={`Are you sure you want to delete "${variableToDelete?.key}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (variableToDelete && onDeleteVariable)
            await onDeleteVariable(variableToDelete);
          setIsDeleteVariableModalOpen(false);
          setVariableToDelete(null);
        }}
        onCancel={() => {
          setIsDeleteVariableModalOpen(false);
          setVariableToDelete(null);
        }}
      />

      {isInviteModalOpen && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          availableRoles={getAvailableRoles(currentUserRole)}
          onSubmit={async (values) => {
            if (onInviteUser) {
              await onInviteUser(values.email, values.role as Role);
            }
            setIsInviteModalOpen(false);
          }}
          onCancel={() => setIsInviteModalOpen(false)}
        />
      )}
    </>
  );
}
