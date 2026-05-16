import { useApiClient } from "@/hooks/useApiClient";

import type {
  ProjectMember,
  Invitation,
} from "@/features/project/pages/ProjectMemberPage/interface";
import type { InvitationStatus } from "@/enums/invitationStatusEnum";
import type { PaginatedResponse } from "@/interfaces/PaginatedResponse";
import type { PaginationType } from "@/interfaces/PaginationType";

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
    params?: PaginationType,
  ): Promise<PaginatedResponse<ProjectMember>> {
    const { data } = await apiClient.get<PaginatedResponse<ProjectMember>>(
      `/projects/${projectId}/members`,
      { params },
    );
    return data;
  }

  async function getProjectInvitations(
    projectId: number,
    params?: PaginationType & { status?: InvitationStatus },
  ): Promise<PaginatedResponse<Invitation>> {
    const { data } = await apiClient.get<PaginatedResponse<Invitation>>(
      `/projects/${projectId}/invitations`,
      { params },
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
