import type { UserProfileType } from "@/models/UserProfileType";
import type { ProjectType } from "@/models/ProjectType";
import type { ProjectDetailType } from "@/models/ProjectDetailType";
import type { ProjectMemberType } from "@/models/ProjectMemberType";
import type { EnvGroupType } from "@/models/EnvGroupType";
import type { EnvVariableType } from "@/models/EnvVariableType";
import type { InvitationType } from "@/models/InvitationType";
import type { PaginatedResponseType } from "@/models/PaginatedResponseType";
import { Role } from "@/enums/roleEnum";
import { InvitationStatus } from "@/enums/invitationStatusEnum";

export const mockUser: UserProfileType = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
};

export const mockProject: ProjectType = {
  id: 1,
  name: "Test Project",
  description: "A test project",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  role: Role.OWNER,
};

export const mockProjectDetail: ProjectDetailType = {
  id: 1,
  name: "Test Project",
  description: "A test project",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  members: [
    {
      id: "m1",
      role: Role.OWNER,
      userId: 1,
      projectId: 1,
      createdAt: "2025-01-01T00:00:00Z",
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
      },
    },
  ],
};

export const mockProjectMember: ProjectMemberType = {
  id: "m1",
  role: Role.EDITOR,
  userId: 2,
  projectId: 1,
  createdAt: "2025-01-01T00:00:00Z",
  user: {
    id: 2,
    email: "member@example.com",
    name: "Project Member",
  },
};

export const mockEnvVariable: EnvVariableType = {
  id: "v1",
  key: "DATABASE_URL",
  value: "postgres://localhost:5432/db",
  envGroupId: "g1",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

export const mockEnvGroup: EnvGroupType = {
  id: "g1",
  name: "Production",
  projectId: 1,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  variables: [mockEnvVariable],
};

export const mockInvitation: InvitationType = {
  id: "i1",
  email: "invited@example.com",
  role: Role.VIEWER,
  status: InvitationStatus.PENDING,
  createdAt: "2025-01-02T00:00:00Z",
  updatedAt: "2025-01-02T00:00:00Z",
};

export function paginatedResponse<T>(data: T[]): PaginatedResponseType<T> {
  return {
    data,
    meta: {
      total: data.length,
      page: 1,
      limitPerPage: 10,
      totalPages: 1,
    },
  };
}

export const loginResponse = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
};

export const refreshResponse = {
  accessToken: "refreshed-access-token",
  refreshToken: "refreshed-refresh-token",
};
