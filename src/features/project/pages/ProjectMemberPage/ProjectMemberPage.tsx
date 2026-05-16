import { IconUserPlus } from "@tabler/icons-react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Loading } from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { InviteUserModal } from "@/features/project/components/InviteUserModal";
import { MemberTable } from "./components/MemberTable";
import { InvitationTable } from "./components/InvitationTable";
import { getAvailableRoles } from "@/enums/roleEnum";

import type { ProjectMemberPageViewProps } from "./interface";

export default function ProjectMemberPage({
  projectId,
  projectName,
  members,
  invitations,
  currentUserId,
  currentUserRole,
  isOwner,
  isLoading,
  page,
  totalPages,
  isInviteModalOpen,
  isDeleteMemberModalOpen,
  selectedMember,
  onOpenInviteModal,
  onCloseInviteModal,
  onInviteSubmit,
  onRemoveMember,
  onConfirmRemoveMember,
  onCancelRemoveMember,
  onPageChange,
}: ProjectMemberPageViewProps) {
  if (isLoading) return <Loading size="lg" className="mt-10" />;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Projects", href: "/projects" },
          { label: projectName, href: `/projects/${projectId}` },
          { label: "Members" },
        ]}
      />

      <div className="mb-6 mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
        {isOwner && (
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
          >
            <IconUserPlus size={16} />
            Invite user
          </button>
        )}
      </div>

      <MemberTable
        members={members}
        currentUserId={currentUserId}
        isOwner={isOwner}
        onRemove={onRemoveMember}
      />

      <Pagination
        className="mt-6"
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {isOwner && invitations.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Pending Invitations
          </h2>
          <InvitationTable invitations={invitations} />
        </div>
      )}

      {isInviteModalOpen && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          availableRoles={getAvailableRoles(currentUserRole)}
          onSubmit={onInviteSubmit}
          onCancel={onCloseInviteModal}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteMemberModalOpen}
        title="Remove Member"
        message={`Are you sure you want to remove "${selectedMember?.user.name}" from this project?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={onConfirmRemoveMember}
        onCancel={onCancelRemoveMember}
      />
    </div>
  );
}
