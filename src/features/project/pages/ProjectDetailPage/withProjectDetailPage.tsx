import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useProjectAction } from "@/hooks/actions/useProjectAction";
import { useProjectEnvAction } from "@/hooks/actions/useProjectEnvAction";
import { Role } from "@/enums/roleEnum";

import type {
  ProjectDetailPageProps,
  EnvGroup,
  EnvVariable,
} from "./interface";

export default function withProjectDetailPage(
  Component: React.FC<ProjectDetailPageProps>,
) {
  function WithProjectDetailPage() {
    const params = useParams();
    const projectId = params.projectId;
    const projectIdNum = Number(projectId);

    const { deleteProject, updateProject, getProjectDetail } = useProjectAction();
    const {
      getEnvGroups,
      createEnvGroup,
      updateEnvGroup,
      deleteEnvGroup,
      createEnvVariable,
      updateEnvVariable,
      deleteEnvVariable,
    } = useProjectEnvAction();
    const alert = useAlert();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [panelOpen, setPanelOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const groupsQueryKey = ["project", projectIdNum, "groups"];

    const { data: projectDetail } = useQuery({
      queryKey: ["project", projectIdNum],
      queryFn: () => getProjectDetail(projectIdNum),
      enabled: !!projectIdNum,
    });

    const { data: groups = [] } = useQuery({
      queryKey: groupsQueryKey,
      queryFn: () => getEnvGroups(projectIdNum),
      enabled: !!projectIdNum,
    });

    const { user: authUser } = useAuth();
    const currentUserId = authUser?.id;
    const currentUserRole: Role =
      projectDetail?.members?.find((m) => m.userId === currentUserId)?.role ??
      Role.VIEWER;

    useEffect(() => {
      if (!toast) return;
      const id = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(id);
    }, [toast]);

    const toggleGroup = (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const toggleVar = (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const toggleGroupAll = (group: EnvGroup) => {
      const ids = group.variables.map((v) => v.id);
      const allSelected = ids.every((id) => selected.has(id));
      setSelected((prev) => {
        const next = new Set(prev);
        for (const id of ids) {
          if (allSelected) next.delete(id);
          else next.add(id);
        }
        return next;
      });
    };

    const copyToClipboard = useCallback(async (text: string, msg?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setToast(msg ?? "Copied to clipboard");
      } catch {
        setToast("Failed to copy");
      }
    }, []);

    const editProjectMutation = useMutation({
      mutationFn: ({
        name,
        description,
      }: {
        name: string;
        description: string | null;
      }) => updateProject(projectIdNum, name, description),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project", projectIdNum] });
        alert.success({
          message: "Project updated",
          description: "Your project has been updated.",
        });
      },
      onError: () => {
        alert.error({
          message: "Update project failed",
          description: "Please try again.",
        });
      },
    });

    const onEditProject = useCallback(
      async (name: string, description: string | null) => {
        await editProjectMutation.mutateAsync({ name, description });
      },
      [editProjectMutation],
    );

    const deleteProjectMutation = useMutation({
      mutationFn: (id: number) => deleteProject(id),
    });

    const onDeleteProject = useCallback(async () => {
      const id = projectIdNum;
      if (!id) return;
      deleteProjectMutation.mutateAsync(id, {
        onSuccess: () => {
          alert.info({
            message: "Delete project success",
            description: "Your project has been deleted.",
          });
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          navigate("/projects", { replace: true });
        },
        onError: () => {
          alert.error({
            message: "Delete project failed",
            description: "Please try again.",
          });
        },
      });
    }, [alert, deleteProjectMutation, navigate, projectIdNum, queryClient]);

    const createGroupMutation = useMutation({
      mutationFn: (name: string) => createEnvGroup(projectIdNum, name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        alert.success({
          message: "Group created",
          description: "Environment group has been created.",
        });
      },
      onError: () => {
        alert.error({
          message: "Create group failed",
          description: "Please try again.",
        });
      },
    });

    const editGroupMutation = useMutation({
      mutationFn: ({ id, name }: { id: string; name: string }) =>
        updateEnvGroup(projectIdNum, id, name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        alert.success({
          message: "Group updated",
          description: "Environment group has been updated.",
        });
      },
      onError: () => {
        alert.error({
          message: "Update group failed",
          description: "Please try again.",
        });
      },
    });

    const deleteGroupMutation = useMutation({
      mutationFn: (id: string) => deleteEnvGroup(projectIdNum, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        alert.info({
          message: "Group deleted",
          description: "Environment group has been deleted.",
        });
      },
      onError: () => {
        alert.error({
          message: "Delete group failed",
          description: "Please try again.",
        });
      },
    });

    const createVariableMutation = useMutation({
      mutationFn: ({
        groupId,
        key,
        value,
      }: {
        groupId: string;
        key: string;
        value: string;
      }) => createEnvVariable(projectIdNum, groupId, key, value),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        alert.success({
          message: "Variable created",
          description: "Environment variable has been created.",
        });
      },
      onError: () => {
        alert.error({
          message: "Create variable failed",
          description: "Please try again.",
        });
      },
    });

    const editVariableMutation = useMutation({
      mutationFn: ({
        variable,
        key,
        value,
      }: {
        variable: EnvVariable;
        key: string;
        value: string;
      }) =>
        updateEnvVariable(
          projectIdNum,
          variable.envGroupId,
          variable.id,
          key,
          value,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        alert.success({
          message: "Variable updated",
          description: "Environment variable has been updated.",
        });
      },
      onError: () => {
        alert.error({
          message: "Update variable failed",
          description: "Please try again.",
        });
      },
    });

    const deleteVariableMutation = useMutation({
      mutationFn: (variable: EnvVariable) =>
        deleteEnvVariable(projectIdNum, variable.envGroupId, variable.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        alert.info({
          message: "Variable deleted",
          description: "Environment variable has been deleted.",
        });
      },
      onError: () => {
        alert.error({
          message: "Delete variable failed",
          description: "Please try again.",
        });
      },
    });

    const onCreateGroup = useCallback(
      async (name: string) => {
        await createGroupMutation.mutateAsync(name);
      },
      [createGroupMutation],
    );

    const onEditGroup = useCallback(
      async (id: string, name: string) => {
        await editGroupMutation.mutateAsync({ id, name });
      },
      [editGroupMutation],
    );

    const onDeleteGroup = useCallback(
      async (id: string) => {
        await deleteGroupMutation.mutateAsync(id);
      },
      [deleteGroupMutation],
    );

    const onCreateVariable = useCallback(
      async (groupId: string, key: string, value: string) => {
        await createVariableMutation.mutateAsync({ groupId, key, value });
      },
      [createVariableMutation],
    );

    const onEditVariable = useCallback(
      async (variable: EnvVariable, key: string, value: string) => {
        await editVariableMutation.mutateAsync({ variable, key, value });
      },
      [editVariableMutation],
    );

    const onDeleteVariable = useCallback(
      async (variable: EnvVariable) => {
        await deleteVariableMutation.mutateAsync(variable);
      },
      [deleteVariableMutation],
    );

    const componentProps: ProjectDetailPageProps = {
      projectId,
      projectName: projectDetail?.name ?? "Loading...",
      groups,
      expanded,
      selected,
      panelOpen,
      toast,
      currentUserRole,
      onToggleGroup: toggleGroup,
      onToggleVar: toggleVar,
      onToggleGroupAll: toggleGroupAll,
      onCopyToClipboard: copyToClipboard,
      onSetPanelOpen: setPanelOpen,
      onEditProject,
      onDeleteProject,
      onCreateGroup,
      onEditGroup,
      onDeleteGroup,
      onCreateVariable,
      onEditVariable,
      onDeleteVariable,
    };

    return <Component {...componentProps} />;
  }
  return WithProjectDetailPage;
}
