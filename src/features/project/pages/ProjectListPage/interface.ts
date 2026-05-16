import type { Role } from "@/enums/roleEnum";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface ProjectListPageViewProps {
  displayProjects: Project[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  isModalOpen: boolean;
  isEdit: boolean;
  selectedProject: Project | null;
  isDeleteModalOpen: boolean;
  onCreateNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onSubmit: (values: { name: string; description: string }) => Promise<void>;
  onConfirmDelete: () => void;
  onCloseModal: () => void;
  onCancelDelete: () => void;
  onPageChange: (page: number) => void;
}
