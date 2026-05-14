import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useProjectAction } from "@/hooks/actions/useProjectAction";
import { useProjectEnvAction } from "@/hooks/actions/useProjectEnvAction";
import type { Role } from "@/enums/roleEnum";

import type { ProjectDetailPageProps, EnvGroup } from "./interface";

export default function withProjectDetailPage(
  Component: React.FC<ProjectDetailPageProps>,
) {
  function WithProjectDetailPage() {
    const params = useParams();
    const projectId = params.projectId;
    const projectIdNum = Number(projectId);

    const { deleteProject } = useProjectAction();
    const {
      getEnvGroups,
      createEnvGroup,
      updateEnvGroup,
      deleteEnvGroup,
      createEnvVariable,
      updateEnvVariable,
      deleteEnvVariable,
      inviteUserToProject,
      getCurrentUserRole,
    } = useProjectEnvAction();
    const alert = useAlert();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const currentUserRole = getCurrentUserRole();

    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [panelOpen, setPanelOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const groupsQueryKey = ["project", projectIdNum, "groups"];

    const { data: groups = [] } = useQuery({
      queryKey: groupsQueryKey,
      queryFn: () => getEnvGroups(projectIdNum),
      enabled: !!projectIdNum,
    });

    useEffect(() => {
      if (!toast) return;
      const id = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(id);
    }, [toast]);

    const toggleGroup = (id: number) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const toggleVar = (id: number) => {
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

    const onEditProject = useCallback(async () => {}, []);

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
      mutationFn: ({ id, name }: { id: number; name: string }) =>
        updateEnvGroup(id, name),
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
      mutationFn: (id: number) => deleteEnvGroup(id),
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
        groupId: number;
        key: string;
        value: string;
      }) => createEnvVariable(groupId, key, value),
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
        id,
        key,
        value,
      }: {
        id: number;
        key: string;
        value: string;
      }) => updateEnvVariable(id, key, value),
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
      mutationFn: (id: number) => deleteEnvVariable(id),
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

    const inviteUserMutation = useMutation({
      mutationFn: ({
        email,
        role,
      }: {
        email: string;
        role: string;
      }) => inviteUserToProject(projectIdNum, email, role as Role),
      onSuccess: () => {
        alert.success({
          message: "User invited",
          description: "Invitation has been sent.",
        });
      },
      onError: () => {
        alert.error({
          message: "Invite failed",
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
      async (id: number, name: string) => {
        await editGroupMutation.mutateAsync({ id, name });
      },
      [editGroupMutation],
    );

    const onDeleteGroup = useCallback(
      async (id: number) => {
        await deleteGroupMutation.mutateAsync(id);
      },
      [deleteGroupMutation],
    );

    const onCreateVariable = useCallback(
      async (groupId: number, key: string, value: string) => {
        await createVariableMutation.mutateAsync({ groupId, key, value });
      },
      [createVariableMutation],
    );

    const onEditVariable = useCallback(
      async (id: number, key: string, value: string) => {
        await editVariableMutation.mutateAsync({ id, key, value });
      },
      [editVariableMutation],
    );

    const onDeleteVariable = useCallback(
      async (id: number) => {
        await deleteVariableMutation.mutateAsync(id);
      },
      [deleteVariableMutation],
    );

    const onInviteUser = useCallback(
      async (email: string, role: Role) => {
        await inviteUserMutation.mutateAsync({ email, role });
      },
      [inviteUserMutation],
    );

    const componentProps: ProjectDetailPageProps = {
      projectId,
      projectName: "Frontend App",
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
      onInviteUser,
    };

    return <Component {...componentProps} />;
  }
  return WithProjectDetailPage;
}
