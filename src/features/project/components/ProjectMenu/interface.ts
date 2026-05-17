import type { ProjectType } from "@/models/ProjectType";

export interface ProjectMenuProps {
  project: ProjectType;
  onEdit: (project: ProjectType) => void;
  onDelete: (project: ProjectType) => void;
}
