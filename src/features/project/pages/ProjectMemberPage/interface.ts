import type { Role } from "@/enums/roleEnum";

import type { ProjectMemberType } from "@/models/ProjectMemberType";
import type { InvitationType } from "@/models/InvitationType";

export type ProjectMemberSearchParams = {
  page: number;
};

export type ProjectMemberModalStateType = {
  type?: "inviteUser" | "deleteMember" | "deleteInvitation";
  data?: {
    member?: ProjectMemberType;
    invitation?: InvitationType;
  };
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
  resendingIds: Set<string>;
  onInviteSubmit: (values: { email: string; role: string }) => Promise<void>;
  onRemoveMember: (member: ProjectMemberType) => Promise<void>;
  onResendInvite: (invitationId: string) => Promise<void>;
  onRemoveInvitation: (invitationId: string) => Promise<void>;
  onPageChange: (page: number) => void;
}
