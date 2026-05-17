import { type ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { useProjectAction } from "@/hooks/actions/useProjectAction";
import { Loading } from "@/components/Loading";

interface ProjectGuardProps {
  children: ReactNode;
}

export default function ProjectGuard({ children }: ProjectGuardProps) {
  const { projectId } = useParams();
  const projectIdNum = Number(projectId);
  const { user } = useAuth();
  const { info, error: showError } = useAlert();
  const navigate = useNavigate();
  const { getProjectDetail } = useProjectAction();

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", projectIdNum],
    queryFn: () => getProjectDetail(projectIdNum),
    enabled: !!projectIdNum,
    retry: false,
  });

  useEffect(() => {
    if (!projectIdNum) {
      navigate("/projects", { replace: true });
      return;
    }

    if (isAxiosError(error) && error.response?.status === 403) {
      info({
        message: "Access denied",
        description: "You are not a member of project.",
      });
      navigate("/projects", { replace: true });
      return;
    }

    if (error) {
      showError({
        message: "Error",
        description: "Something went wrong. Please try again.",
      });
      return;
    }
  }, [projectIdNum, error, data, user, info, showError, navigate]);

  if (isLoading || !data)
    return <Loading className="mt-5" text="Check permission.." />;

  const isMember = data.members?.some((m) => m.userId === user?.id);
  if (!projectIdNum || error || !isMember) return null;

  return children;
}
