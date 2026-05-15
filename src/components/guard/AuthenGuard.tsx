import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";

interface AuthenGuardProps {
  children: ReactNode;
}

export default function AuthenGuard({ children }: AuthenGuardProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  return children;
}
