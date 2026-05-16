import type { Role } from "@/enums/roleEnum";

export interface ProjectMemberType {
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
