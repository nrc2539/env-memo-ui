import type { Role } from "@/enums/roleEnum";

export interface ProjectMember {
  id: string;
  role: Role;
  userId: number;
  projectId: number;
  createdAt: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMemberPageViewProps {
  projectId: string;
  projectName: string;
  members: ProjectMember[];
  invitations: Invitation[];
  currentUserId: number | undefined;
  currentUserRole: Role;
  isOwner: boolean;
  isLoading: boolean;
  isInviteModalOpen: boolean;
  isDeleteMemberModalOpen: boolean;
  selectedMember: ProjectMember | null;
  onOpenInviteModal: () => void;
  onCloseInviteModal: () => void;
  onInviteSubmit: (values: { email: string; role: string }) => Promise<void>;
  onRemoveMember: (member: ProjectMember) => void;
  onConfirmRemoveMember: () => void;
  onCancelRemoveMember: () => void;
}
