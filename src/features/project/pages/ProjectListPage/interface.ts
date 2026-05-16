import type { ProjectType } from "@/models/ProjectType";

export type ProjectListSearchParams = {
  page: number;
  search: string;
};

export interface ProjectListPageViewProps {
  displayProjects: ProjectType[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  search: string;
  isModalOpen: boolean;
  isEdit: boolean;
  selectedProject: ProjectType | null;
  isDeleteModalOpen: boolean;
  onCreateNew: () => void;
  onEdit: (project: ProjectType) => void;
  onDelete: (project: ProjectType) => void;
  onSubmit: (values: { name: string; description: string }) => Promise<void>;
  onConfirmDelete: () => void;
  onCloseModal: () => void;
  onCancelDelete: () => void;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
}
