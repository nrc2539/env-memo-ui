import { useApiClient } from "@/hooks/useApiClient";

import type { EnvGroupType } from "@/models/EnvGroupType";
import type { EnvVariableType } from "@/models/EnvVariableType";

export function useProjectEnvAction() {
  const apiClient = useApiClient();

  async function getEnvGroups(projectId: number): Promise<EnvGroupType[]> {
    const { data } = await apiClient.get<{ data: EnvGroupType[] }>(
      `/projects/${projectId}/env-groups`,
      { params: { all: true } },
    );
    return data.data;
  }

  async function createEnvGroup(
    projectId: number,
    name: string,
  ): Promise<EnvGroupType> {
    const { data } = await apiClient.post<EnvGroupType>(
      `/projects/${projectId}/env-groups`,
      { name },
    );
    return data;
  }

  async function updateEnvGroup(
    projectId: number,
    groupId: string,
    name: string,
  ): Promise<EnvGroupType> {
    const { data } = await apiClient.patch<EnvGroupType>(
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
  ): Promise<EnvVariableType> {
    const { data } = await apiClient.post<EnvVariableType>(
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
  ): Promise<EnvVariableType> {
    const { data } = await apiClient.patch<EnvVariableType>(
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

  return {
    getEnvGroups,
    createEnvGroup,
    updateEnvGroup,
    deleteEnvGroup,
    createEnvVariable,
    updateEnvVariable,
    deleteEnvVariable,
  };
}
