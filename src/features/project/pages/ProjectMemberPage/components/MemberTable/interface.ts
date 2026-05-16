import type { ProjectMember } from "../../interface";

export interface MemberTableProps {
  members: ProjectMember[];
  currentUserId: number | undefined;
  isOwner: boolean;
  onRemove: (member: ProjectMember) => void;
}
