import type { ProjectType } from "@/models/ProjectType";

export interface ProjectCardProps {
  project: ProjectType;
  onEdit: (project: ProjectType) => void;
  onDelete: (project: ProjectType) => void;
}