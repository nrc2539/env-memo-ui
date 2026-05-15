import { Outlet, type RouteObject } from "react-router";

import AuthenGuard from "@/components/guard/AuthenGuard";
import AppLayout from "@/components/layout/AppLayout";

import { SettingPage } from "./pages/SettingPage";

export const settingRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: (
      <AuthenGuard>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AuthenGuard>
    ),
    children: [{ index: true, element: <SettingPage /> }],
  },
];
