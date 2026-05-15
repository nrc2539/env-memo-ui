import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "@/hooks/useAuth";

interface AuthenGuardProps {
  children: ReactNode;
}

export default function AuthenGuard({ children }: AuthenGuardProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
}
