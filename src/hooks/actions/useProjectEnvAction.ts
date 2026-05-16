import { useApiClient } from "@/hooks/useApiClient";

import type {
  EnvGroup,
  EnvVariable,
  ProjectDetail,
} from "@/features/project/pages/ProjectDetailPage/interface";
import type {
  ProjectMember,
  Invitation,
} from "@/features/project/pages/ProjectMemberPage/interface";
import type { PaginatedResponse } from "@/interfaces/PaginatedResponse";

export function useProjectEnvAction() {
  const apiClient = useApiClient();

  async function getProjectDetail(
    projectId: number,
  ): Promise<ProjectDetail> {
    const { data } = await apiClient.get<ProjectDetail>(
      `/projects/${projectId}`,
    );
    return data;
  }

  async function getEnvGroups(projectId: number): Promise<EnvGroup[]> {
    const { data } = await apiClient.get<{ data: EnvGroup[] }>(
      `/projects/${projectId}/env-groups`,
      { params: { all: true } },
    );
    return data.data;
  }

  async function createEnvGroup(
    projectId: number,
    name: string,
  ): Promise<EnvGroup> {
    const { data } = await apiClient.post<EnvGroup>(
      `/projects/${projectId}/env-groups`,
      { name },
    );
    return data;
  }

  async function updateEnvGroup(
    projectId: number,
    groupId: string,
    name: string,
  ): Promise<EnvGroup> {
    const { data } = await apiClient.patch<EnvGroup>(
      `/projects/${projectId}/env-groups/${groupId}`,
      { name },
    );
    return data;
  }

  async function deleteEnvGroup(
    projectId: number,
    groupId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/projects/${projectId}/env-groups/${groupId}`,
    );
  }

  async function createEnvVariable(
    projectId: number,
    groupId: string,
    key: string,
    value: string,
  ): Promise<EnvVariable> {
    const { data } = await apiClient.post<EnvVariable>(
      `/projects/${projectId}/env-groups/${groupId}/variables`,
      { key, value },
    );
    return data;
  }

  async function updateEnvVariable(
    projectId: number,
    groupId: string,
    variableId: string,
    key: string,
    value: string,
  ): Promise<EnvVariable> {
    const { data } = await apiClient.patch<EnvVariable>(
      `/projects/${projectId}/env-groups/${groupId}/variables/${variableId}`,
      { key, value },
    );
    return data;
  }

  async function deleteEnvVariable(
    projectId: number,
    groupId: string,
    variableId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/projects/${projectId}/env-groups/${groupId}/variables/${variableId}`,
    );
  }

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
    getProjectDetail,
    getEnvGroups,
    createEnvGroup,
    updateEnvGroup,
    deleteEnvGroup,
    createEnvVariable,
    updateEnvVariable,
    deleteEnvVariable,
    inviteUserToProject,
    getProjectMembers,
    getProjectInvitations,
    removeProjectMember,
  };
}
