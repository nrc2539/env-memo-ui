import type { Project } from "@/features/project/pages/ProjectListPage/interface";

export interface ProjectMenuViewProps {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface WithProjectMenuProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}