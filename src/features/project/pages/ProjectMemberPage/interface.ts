import type { Role } from "@/enums/roleEnum";

import type { ProjectMemberType } from "@/models/ProjectMemberType";
import type { InvitationType } from "@/models/InvitationType";

export type ProjectMemberSearchParams = {
  page: number;
};

export interface ProjectMemberPageViewProps {
  projectId: string;
  projectName: string;
  members: ProjectMemberType[];
  invitations: InvitationType[];
  currentUserId: number | undefined;
  currentUserRole: Role;
  isOwner: boolean;
  isLoading: boolean;
  page: number;
  totalPages: number;
  isInviteModalOpen: boolean;
  isDeleteMemberModalOpen: boolean;
  selectedMember: ProjectMemberType | null;
  onOpenInviteModal: () => void;
  onCloseInviteModal: () => void;
  onInviteSubmit: (values: { email: string; role: string }) => Promise<void>;
  onRemoveMember: (member: ProjectMemberType) => void;
  onConfirmRemoveMember: () => void;
  onCancelRemoveMember: () => void;
  onPageChange: (page: number) => void;
}
