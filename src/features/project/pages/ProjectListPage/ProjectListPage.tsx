import { IconSearch } from "@tabler/icons-react";

import { Loading } from "@/components/Loading";
import { ConfirmModal } from "@/components/ConfirmModal";
import Input from "@/components/Input";
import Pagination from "@/components/Pagination";
import { ProjectCard } from "@/features/project/components/ProjectCard";
import { ProjectModal } from "@/features/project/components/ProjectModal";

import type { ProjectListPageViewProps } from "./interface";

export default function ProjectListPage({
  displayProjects,
  isLoading,
  page,
  totalPages,
  search,
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
  onSearchChange,
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

      <div className="mb-6">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects..."
          leftIcon={<IconSearch size={18} className="text-gray-400" />}
        />
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

          <Pagination
            className="mt-8"
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
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
