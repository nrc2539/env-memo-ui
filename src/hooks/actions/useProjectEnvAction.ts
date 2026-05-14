import type {
  EnvGroup,
  EnvVariable,
} from "@/features/project/pages/ProjectDetailPage/interface";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockGroups: EnvGroup[] = [
  {
    id: 1,
    name: "Staging",
    variables: [
      { id: 1, key: "API_URL", value: "https://staging.api.example.com" },
      { id: 2, key: "DB_HOST", value: "staging-db.internal" },
      { id: 3, key: "DB_PORT", value: "5432" },
      { id: 4, key: "REDIS_URL", value: "redis://staging-redis:6379" },
      { id: 5, key: "LOG_LEVEL", value: "debug" },
    ],
  },
  {
    id: 2,
    name: "UAT",
    variables: [
      { id: 6, key: "API_URL", value: "https://uat.api.example.com" },
      { id: 7, key: "DB_HOST", value: "uat-db.internal" },
      { id: 8, key: "DB_PORT", value: "5432" },
      { id: 9, key: "S3_BUCKET", value: "uat-assets" },
    ],
  },
  {
    id: 3,
    name: "Production",
    variables: [
      { id: 10, key: "API_URL", value: "https://api.example.com" },
      { id: 11, key: "DB_HOST", value: "prod-db.internal" },
      { id: 12, key: "DB_PORT", value: "5432" },
      { id: 13, key: "REDIS_URL", value: "redis://prod-redis:6379" },
      { id: 14, key: "S3_BUCKET", value: "prod-assets" },
      { id: 15, key: "LOG_LEVEL", value: "error" },
      { id: 16, key: "CDN_URL", value: "https://cdn.example.com" },
    ],
  },
];

let nextGroupId = 4;
let nextVarId = 17;

export function useProjectEnvAction() {
  async function getEnvGroups(projectId: number): Promise<EnvGroup[]> {
    void projectId;
    await delay(500);
    return structuredClone(mockGroups);
  }

  async function createEnvGroup(
    projectId: number,
    name: string,
  ): Promise<EnvGroup> {
    void projectId;
    await delay(500);
    const newGroup: EnvGroup = {
      id: nextGroupId++,
      name,
      variables: [],
    };
    mockGroups.push(newGroup);
    return newGroup;
  }

  async function updateEnvGroup(
    groupId: number,
    name: string,
  ): Promise<EnvGroup> {
    await delay(500);
    const group = mockGroups.find((g) => g.id === groupId);
    if (!group) throw new Error("Group not found");
    group.name = name;
    return group;
  }

  async function deleteEnvGroup(groupId: number): Promise<void> {
    await delay(500);
    const index = mockGroups.findIndex((g) => g.id === groupId);
    if (index === -1) throw new Error("Group not found");
    mockGroups.splice(index, 1);
  }

  async function createEnvVariable(
    groupId: number,
    key: string,
    value: string,
  ): Promise<EnvVariable> {
    await delay(500);
    const group = mockGroups.find((g) => g.id === groupId);
    if (!group) throw new Error("Group not found");
    const newVar: EnvVariable = { id: nextVarId++, key, value };
    group.variables.push(newVar);
    return newVar;
  }

  async function updateEnvVariable(
    variableId: number,
    key: string,
    value: string,
  ): Promise<EnvVariable> {
    await delay(500);
    for (const group of mockGroups) {
      const variable = group.variables.find((v) => v.id === variableId);
      if (variable) {
        variable.key = key;
        variable.value = value;
        return variable;
      }
    }
    throw new Error("Variable not found");
  }

  async function deleteEnvVariable(variableId: number): Promise<void> {
    await delay(500);
    for (const group of mockGroups) {
      const index = group.variables.findIndex((v) => v.id === variableId);
      if (index !== -1) {
        group.variables.splice(index, 1);
        return;
      }
    }
    throw new Error("Variable not found");
  }

  async function inviteUserToProject(
    projectId: number,
    email: string,
  ): Promise<void> {
    void projectId;
    void email;
    await delay(500);
  }

  return {
    getEnvGroups,
    createEnvGroup,
    updateEnvGroup,
    deleteEnvGroup,
    createEnvVariable,
    updateEnvVariable,
    deleteEnvVariable,
    inviteUserToProject,
  };
}
