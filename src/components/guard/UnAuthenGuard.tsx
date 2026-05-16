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
      navigate("/projects", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return children;
}
