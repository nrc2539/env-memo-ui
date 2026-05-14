import type { Project } from "@/features/project/pages/ProjectListPage/interface";

export interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}