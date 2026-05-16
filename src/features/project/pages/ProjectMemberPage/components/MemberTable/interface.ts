import type { ProjectMemberType } from "@/models/ProjectMemberType";

export interface MemberTableProps {
  members: ProjectMemberType[];
  currentUserId: number | undefined;
  isOwner: boolean;
  onRemove: (member: ProjectMemberType) => void;
}
