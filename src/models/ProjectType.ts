import type { Role } from "@/enums/roleEnum";

export interface ProjectType {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}
