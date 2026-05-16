import { useApiClient } from "@/hooks/useApiClient";
import type { PaginatedResponseType } from "@/models/PaginatedResponseType";
import type { PaginationType } from "@/interfaces/PaginationType";
import type { ProjectType } from "@/models/ProjectType";
import type { ProjectDetailType } from "@/models/ProjectDetailType";

export function useProjectAction() {
  const apiClient = useApiClient();

  async function getProjects(
    params?: PaginationType & { search?: string },
  ): Promise<PaginatedResponseType<ProjectType>> {
    const { data } = await apiClient.get<PaginatedResponseType<ProjectType>>(
      "/projects",
      { params },
    );
    return data;
  }

  async function createProject(
    name: string,
    description?: string,
  ): Promise<ProjectType> {
    const { data } = await apiClient.post<ProjectType>("/projects", {
      name,
      description: description ?? null,
    });
    return data;
  }

  async function updateProject(
    id: number,
    name: string,
    description?: string | null,
  ): Promise<ProjectType> {
    const { data } = await apiClient.patch<ProjectType>(`/projects/${id}`, {
      name,
      description,
    });
    return data;
  }

  async function deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }

  async function getProject(id: number): Promise<ProjectType> {
    const { data } = await apiClient.get<ProjectType>(`/projects/${id}`);
    return data;
  }

  async function getProjectDetail(projectId: number): Promise<ProjectDetailType> {
    const { data } = await apiClient.get<ProjectDetailType>(
      `/projects/${projectId}`,
    );
    return data;
  }

  return {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getProjectDetail,
  };
}
