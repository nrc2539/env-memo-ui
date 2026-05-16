import { useApiClient } from "@/hooks/useApiClient";

import type { ProjectMemberType } from "@/models/ProjectMemberType";
import type { InvitationType } from "@/models/InvitationType";
import type { InvitationStatus } from "@/enums/invitationStatusEnum";
import type { PaginatedResponseType } from "@/models/PaginatedResponseType";
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
  ): Promise<PaginatedResponseType<ProjectMemberType>> {
    const { data } = await apiClient.get<PaginatedResponseType<ProjectMemberType>>(
      `/projects/${projectId}/members`,
      { params },
    );
    return data;
  }

  async function getProjectInvitations(
    projectId: number,
    params?: PaginationType & { status?: InvitationStatus },
  ): Promise<PaginatedResponseType<InvitationType>> {
    const { data } = await apiClient.get<PaginatedResponseType<InvitationType>>(
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
