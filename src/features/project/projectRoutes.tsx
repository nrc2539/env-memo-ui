import type { RouteObject } from "react-router";

import AppLayout from "@/components/layout/AppLayout";
import ProjectListPage from "./pages/ProjectListPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";

export const projectRoutes: RouteObject[] = [
  {
    path: "/projects",
    element: <AppLayout />,
    children: [
      { index: true, element: <ProjectListPage /> },
      { path: ":projectId", element: <ProjectDetailPage /> },
    ],
  },
];
