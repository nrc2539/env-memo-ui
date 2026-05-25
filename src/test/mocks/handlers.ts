import { http, HttpResponse } from "msw";
import {
  mockUser,
  mockProject,
  mockProjectDetail,
  mockEnvGroup,
  mockProjectMember,
  mockInvitation,
  paginatedResponse,
  loginResponse,
  refreshResponse,
} from "./data";

const API_BASE = "*/api";

export const handlers = [
  // --- Auth ---
  http.post(`${API_BASE}/auth/login`, () =>
    HttpResponse.json(loginResponse),
  ),

  http.post(`${API_BASE}/auth/register`, () => HttpResponse.text(null, { status: 201 })),

  http.post(`${API_BASE}/auth/forgot-password`, () =>
    HttpResponse.text(null, { status: 200 }),
  ),

  http.post(`${API_BASE}/auth/reset-password`, () =>
    HttpResponse.text(null, { status: 200 }),
  ),

  http.post(`${API_BASE}/auth/setup-password`, () =>
    HttpResponse.text(null, { status: 200 }),
  ),

  http.post(`${API_BASE}/auth/change-password`, () =>
    HttpResponse.text(null, { status: 200 }),
  ),

  http.post(`${API_BASE}/auth/verify-token`, () =>
    HttpResponse.json(mockUser),
  ),

  http.get(`${API_BASE}/auth/profile`, () => HttpResponse.json(mockUser)),

  http.patch(`${API_BASE}/auth/profile`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    return HttpResponse.json({ ...mockUser, name: body.name });
  }),

  http.post(`${API_BASE}/auth/refresh`, () =>
    HttpResponse.json(refreshResponse),
  ),

  // --- Projects ---
  http.get(`${API_BASE}/projects`, () =>
    HttpResponse.json(paginatedResponse([mockProject])),
  ),

  http.post(`${API_BASE}/projects`, async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string };
    return HttpResponse.json(
      { ...mockProject, name: body.name, description: body.description ?? null },
      { status: 201 },
    );
  }),

  http.get(`${API_BASE}/projects/:projectId`, () =>
    HttpResponse.json(mockProjectDetail),
  ),

  http.patch(`${API_BASE}/projects/:projectId`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    return HttpResponse.json({ ...mockProject, name: body.name });
  }),

  http.delete(`${API_BASE}/projects/:projectId`, () =>
    HttpResponse.text(null, { status: 204 }),
  ),

  // --- Env Groups ---
  http.get(`${API_BASE}/projects/:projectId/env-groups`, () =>
    HttpResponse.json({ data: [mockEnvGroup] }),
  ),

  http.post(`${API_BASE}/projects/:projectId/env-groups`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    return HttpResponse.json(
      { ...mockEnvGroup, name: body.name },
      { status: 201 },
    );
  }),

  http.patch(`${API_BASE}/projects/:projectId/env-groups/:groupId`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    return HttpResponse.json({ ...mockEnvGroup, name: body.name });
  }),

  http.delete(`${API_BASE}/projects/:projectId/env-groups/:groupId`, () =>
    HttpResponse.text(null, { status: 204 }),
  ),

  // --- Env Variables ---
  http.post(
    `${API_BASE}/projects/:projectId/env-groups/:groupId/variables`,
    async ({ request }) => {
      const body = (await request.json()) as { key: string; value: string };
      return HttpResponse.json(
        {
          id: "v-new",
          key: body.key,
          value: body.value,
          envGroupId: "g1",
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
        },
        { status: 201 },
      );
    },
  ),

  http.patch(
    `${API_BASE}/projects/:projectId/env-groups/:groupId/variables/:variableId`,
    async ({ request }) => {
      const body = (await request.json()) as { key: string; value: string };
      return HttpResponse.json({
        id: "v1",
        key: body.key,
        value: body.value,
        envGroupId: "g1",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      });
    },
  ),

  http.delete(
    `${API_BASE}/projects/:projectId/env-groups/:groupId/variables/:variableId`,
    () => HttpResponse.text(null, { status: 204 }),
  ),

  // --- Project Members ---
  http.get(`${API_BASE}/projects/:projectId/members`, () =>
    HttpResponse.json(paginatedResponse([mockProjectMember])),
  ),

  http.delete(`${API_BASE}/projects/:projectId/members/:userId`, () =>
    HttpResponse.text(null, { status: 204 }),
  ),

  // --- Invitations ---
  http.post(`${API_BASE}/projects/:projectId/invitations`, () =>
    HttpResponse.text(null, { status: 201 }),
  ),

  http.get(`${API_BASE}/projects/:projectId/invitations`, () =>
    HttpResponse.json(paginatedResponse([mockInvitation])),
  ),

  http.delete(`${API_BASE}/projects/:projectId/invitations/:invitationId`, () =>
    HttpResponse.text(null, { status: 204 }),
  ),

  http.post(
    `${API_BASE}/projects/:projectId/invitations/:invitationId/resend`,
    () => HttpResponse.text(null, { status: 200 }),
  ),
];
