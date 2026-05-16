import { Outlet, type RouteObject } from "react-router";

import AuthenGuard from "@/components/guard/AuthenGuard";
import ProjectGuard from "@/components/guard/ProjectGuard";
import AppLayout from "@/components/layout/AppLayout";
import { ProjectListPage } from "./pages/ProjectListPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";

export const projectRoutes: RouteObject[] = [
  {
    path: "/projects",
    element: (
      <AuthenGuard>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AuthenGuard>
    ),
    children: [
      { index: true, element: <ProjectListPage /> },
      {
        path: ":projectId",
        element: (
          <ProjectGuard>
            <ProjectDetailPage />
          </ProjectGuard>
        ),
      },
    ],
  },
];
