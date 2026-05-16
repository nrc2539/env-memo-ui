import type { ProjectMemberType } from "./ProjectMemberType";

export interface ProjectDetailType {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members: ProjectMemberType[];
}
