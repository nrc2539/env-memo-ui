import type { ProjectType } from "@/models/ProjectType";

export interface ProjectMenuViewProps {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface WithProjectMenuProps {
  project: ProjectType;
  onEdit: (project: ProjectType) => void;
  onDelete: (project: ProjectType) => void;
}