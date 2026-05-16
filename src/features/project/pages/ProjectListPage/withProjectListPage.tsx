import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useProjectAction } from "@/hooks/actions/useProjectAction";

import type { ProjectListPageViewProps, Project } from "./interface";

export default function withProjectListPage(
  Component: React.FC<ProjectListPageViewProps>,
) {
  function WithProjectListPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
      null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [page, setPage] = useState(1);

    const { success, error, info } = useAlert();
    const { getProjects, createProject, updateProject, deleteProject } =
      useProjectAction();
    const queryClient = useQueryClient();

    const { data: paginatedData, isLoading } = useQuery({
      queryKey: ["projects", page],
      queryFn: () => getProjects(page, 2),
      placeholderData: (prev) => prev,
    });

    const displayProjects = paginatedData?.data ?? [];
    const meta = paginatedData?.meta;

    const createMutation = useMutation({
      mutationFn: ({
        name,
        description,
      }: {
        name: string;
        description: string;
      }) => createProject(name, description || undefined),
      onSuccess: () => {
        success({
          message: "Create project success",
          description: "Your project has been created.",
        });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        setIsModalOpen(false);
      },
      onError: () => {
        error({
          message: "Create project failed",
          description: "Please try again.",
        });
      },
    });

    const updateMutation = useMutation({
      mutationFn: ({
        id,
        name,
        description,
      }: {
        id: number;
        name: string;
        description: string;
      }) => updateProject(id, name, description || null),
      onSuccess: () => {
        success({
          message: "Update project success",
          description: "Your project has been updated.",
        });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        setIsModalOpen(false);
        setSelectedProject(null);
      },
      onError: () => {
        error({
          message: "Update project failed",
          description: "Please try again.",
        });
      },
    });

    const deleteMutation = useMutation({
      mutationFn: (id: number) => deleteProject(id),
      onSuccess: () => {
        info({
          message: "Delete project success",
          description: "Your project has been deleted.",
        });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
      },
      onError: () => {
        error({
          message: "Delete project failed",
          description: "Please try again.",
        });
      },
    });

    function handleOpenCreateModal() {
      setIsEdit(false);
      setSelectedProject(null);
      setIsModalOpen(true);
    }

    function handleOpenEditModal(project: Project) {
      setIsEdit(true);
      setSelectedProject(project);
      setIsModalOpen(true);
    }

    function handleOpenDeleteModal(project: Project) {
      setSelectedProject(project);
      setIsDeleteModalOpen(true);
    }

    async function handleModalSubmit(values: {
      name: string;
      description: string;
    }) {
      if (isEdit && selectedProject) {
        await updateMutation.mutateAsync({
          id: selectedProject.id,
          name: values.name,
          description: values.description,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
    }

    function handleDeleteConfirm() {
      if (selectedProject) {
        deleteMutation.mutateAsync(selectedProject.id);
      }
    }

    function handleCloseModal() {
      setIsModalOpen(false);
      setSelectedProject(null);
    }

    function handleCancelDelete() {
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    }

    const totalPages = meta?.totalPages ?? 1;

    const viewProps: ProjectListPageViewProps = {
      displayProjects,
      isLoading,
      page,
      totalPages,
      isModalOpen,
      isEdit,
      selectedProject,
      isDeleteModalOpen,
      onCreateNew: handleOpenCreateModal,
      onEdit: handleOpenEditModal,
      onDelete: handleOpenDeleteModal,
      onSubmit: handleModalSubmit,
      onConfirmDelete: handleDeleteConfirm,
      onCloseModal: handleCloseModal,
      onCancelDelete: handleCancelDelete,
      onPageChange: setPage,
    };

    return <Component {...viewProps} />;
  }
  return WithProjectListPage;
}
