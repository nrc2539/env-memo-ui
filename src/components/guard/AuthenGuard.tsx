import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { Loading } from "../Loading";

interface AuthenGuardProps {
  children: ReactNode;
}

export default function AuthenGuard({ children }: AuthenGuardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return <Loading className="mt-10" />;

  return children;
}
