import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";

interface UnAuthenGuardProps {
  children: ReactNode;
}

export default function UnAuthenGuard({ children }: UnAuthenGuardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = sessionStorage.getItem("redirectAfterLogin");
      if (redirect) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirect, { replace: true });
      } else {
        navigate("/projects", { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  return children;
}
