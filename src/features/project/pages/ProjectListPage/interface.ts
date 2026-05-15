import type { Role } from "@/enums/roleEnum";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface ProjectListPageProps {
  projects?: Project[];
}
