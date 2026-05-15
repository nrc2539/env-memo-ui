import type { RouteObject } from "react-router";
import UnAuthenGuard from "@/components/guard/UnAuthenGuard";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SetupPasswordPage } from "./pages/SetupPasswordPage";

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <UnAuthenGuard><LoginPage /></UnAuthenGuard>,
  },
  {
    path: "/register",
    element: <UnAuthenGuard><RegisterPage /></UnAuthenGuard>,
  },
  {
    path: "/forgot-password",
    element: <UnAuthenGuard><ForgotPasswordPage /></UnAuthenGuard>,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/setup-password",
    element: <SetupPasswordPage />,
  },
];
