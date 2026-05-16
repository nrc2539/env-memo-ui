import { useApiClient } from "@/hooks/useApiClient";
import type { PaginatedResponse } from "@/interfaces/PaginatedResponse";
import type { Project } from "@/features/project/pages/ProjectListPage/interface";
import type { ProjectDetail } from "@/features/project/pages/ProjectDetailPage/interface";

export function useProjectAction() {
  const apiClient = useApiClient();

  async function getProjects(
    page = 1,
    limitPerPage = 10,
  ): Promise<PaginatedResponse<Project>> {
    const { data } = await apiClient.get<PaginatedResponse<Project>>(
      "/projects",
      { params: { page, limitPerPage } },
    );
    return data;
  }

  async function createProject(
    name: string,
    description?: string,
  ): Promise<Project> {
    const { data } = await apiClient.post<Project>("/projects", {
      name,
      description: description ?? null,
    });
    return data;
  }

  async function updateProject(
    id: number,
    name: string,
    description?: string | null,
  ): Promise<Project> {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, {
      name,
      description,
    });
    return data;
  }

  async function deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }

  async function getProject(id: number): Promise<Project> {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  }

  async function getProjectDetail(
    projectId: number,
  ): Promise<ProjectDetail> {
    const { data } = await apiClient.get<ProjectDetail>(
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
