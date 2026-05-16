import { useApiClient } from "@/hooks/useApiClient";

import type {
  ProjectMember,
  Invitation,
} from "@/features/project/pages/ProjectMemberPage/interface";
import type { PaginatedResponse } from "@/interfaces/PaginatedResponse";

export function useProjectMemberAction() {
  const apiClient = useApiClient();

  async function inviteUserToProject(
    projectId: number,
    email: string,
    role: string,
  ): Promise<void> {
    await apiClient.post(`/projects/${projectId}/invitations`, {
      email,
      role,
    });
  }

  async function getProjectMembers(
    projectId: number,
    page = 1,
    limitPerPage = 100,
  ): Promise<PaginatedResponse<ProjectMember>> {
    const { data } = await apiClient.get<PaginatedResponse<ProjectMember>>(
      `/projects/${projectId}/members`,
      { params: { page, limitPerPage } },
    );
    return data;
  }

  async function getProjectInvitations(
    projectId: number,
    page = 1,
    limitPerPage = 100,
  ): Promise<PaginatedResponse<Invitation>> {
    const { data } = await apiClient.get<PaginatedResponse<Invitation>>(
      `/projects/${projectId}/invitations`,
      { params: { page, limitPerPage } },
    );
    return data;
  }

  async function removeProjectMember(
    projectId: number,
    userId: number,
  ): Promise<void> {
    await apiClient.delete(
      `/projects/${projectId}/members/${userId}`,
    );
  }

  return {
    inviteUserToProject,
    getProjectMembers,
    getProjectInvitations,
    removeProjectMember,
  };
}
