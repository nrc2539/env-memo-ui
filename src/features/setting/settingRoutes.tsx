import type { RouteObject } from "react-router";

import AppLayout from "@/components/layout/AppLayout";

import { SettingPage } from "./pages/SettingPage";

export const settingRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: <AppLayout />,
    children: [{ index: true, element: <SettingPage /> }],
  },
];
