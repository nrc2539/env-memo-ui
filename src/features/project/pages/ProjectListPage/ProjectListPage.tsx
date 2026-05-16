import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Loading } from "@/components/Loading";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ProjectCard } from "@/features/project/components/ProjectCard";
import { ProjectModal } from "@/features/project/components/ProjectModal";

import type { ProjectListPageViewProps } from "./interface";

export default function ProjectListPage({
  displayProjects,
  isLoading,
  page,
  totalPages,
  isModalOpen,
  isEdit,
  selectedProject,
  isDeleteModalOpen,
  onCreateNew,
  onEdit,
  onDelete,
  onSubmit,
  onConfirmDelete,
  onCloseModal,
  onCancelDelete,
  onPageChange,
}: ProjectListPageViewProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
        >
          New Project
        </button>
      </div>

      {isLoading ? (
        <Loading className="mt-5" />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <IconChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          isEdit={isEdit}
          initialValues={
            selectedProject
              ? {
                  name: selectedProject.name,
                  description: selectedProject.description ?? "",
                }
              : undefined
          }
          onSubmit={onSubmit}
          onCancel={onCloseModal}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </div>
  );
}
