import type { EnvVariableType } from "./EnvVariableType";

export interface EnvGroupType {
  id: string;
  name: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  variables: EnvVariableType[];
}
