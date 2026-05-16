import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useQueryStrings } from "@/hooks/useQueryStrings";
import { useDebounce } from "@/hooks/useDebounce";
import { useProjectAction } from "@/hooks/actions/useProjectAction";

import type { ProjectType } from "@/models/ProjectType";
import type { ProjectListSearchParams, ProjectListPageViewProps } from "./interface";

export default function withProjectListPage(
  Component: React.FC<ProjectListPageViewProps>,
) {
  function WithProjectListPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
      null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { success, error, info } = useAlert();
    const { getProjects, createProject, updateProject, deleteProject } =
      useProjectAction();
    const queryClient = useQueryClient();

    const { getNumberParam, getStringParam } = useGetQuery();
    const { updateQueryStrings } = useQueryStrings<ProjectListSearchParams>();

    const searchParams: ProjectListSearchParams = {
      page: getNumberParam("page") ?? 1,
      search: getStringParam("search"),
    };
    const debouncedSearch = useDebounce(searchParams.search, 300);

    const { data: paginatedData, isLoading } = useQuery({
      queryKey: ["projects", searchParams.page, debouncedSearch],
      queryFn: () =>
        getProjects({
          page: searchParams.page,
          limitPerPage: 9,
          search: debouncedSearch || undefined,
        }),
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

    function handleOpenEditModal(project: ProjectType) {
      setIsEdit(true);
      setSelectedProject(project);
      setIsModalOpen(true);
    }

    function handleOpenDeleteModal(project: ProjectType) {
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

    function handlePageChange(newPage: number) {
      updateQueryStrings({ page: newPage, search: searchParams.search });
    }

    function handleSearchChange(newSearch: string) {
      updateQueryStrings({ page: 1, search: newSearch });
    }

    const totalPages = meta?.totalPages ?? 1;

    const viewProps: ProjectListPageViewProps = {
      displayProjects,
      isLoading,
      page: searchParams.page,
      totalPages,
      search: searchParams.search,
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
      onPageChange: handlePageChange,
      onSearchChange: handleSearchChange,
    };

    return <Component {...viewProps} />;
  }
  return WithProjectListPage;
}
