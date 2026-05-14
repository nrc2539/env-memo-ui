import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { Loading } from "@/components/Loading";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useProjectAction } from "@/hooks/actions/useProjectAction";
import { ProjectCard } from "@/features/project/components/ProjectCard";
import { ProjectModal } from "@/features/project/components/ProjectModal";

import type { ProjectListPageProps } from "./interface";
import type { Project } from "./interface";

export default function ProjectListPage({
  projects = [],
}: ProjectListPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { success, error, info } = useAlert();
  const { getProjects, createProject, updateProject, deleteProject } =
    useProjectAction();
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createProject(name),
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
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateProject(id, name),
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

  const displayProjects = projectsData ?? projects;

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

  async function handleModalSubmit(values: { name: string }) {
    if (isEdit && selectedProject) {
      await updateMutation.mutateAsync({
        id: selectedProject.id,
        name: values.name,
      });
    } else {
      await createMutation.mutateAsync(values.name);
    }
  }

  function handleDeleteConfirm() {
    if (selectedProject) {
      deleteMutation.mutateAsync(selectedProject.id);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
        >
          New Project
        </button>
      </div>

      {isLoading ? (
        <Loading size="lg" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      {!!selectedProject && (
        <ProjectModal
          isOpen={isModalOpen}
          isEdit={isEdit}
          initialValues={selectedProject}
          onSubmit={handleModalSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}
