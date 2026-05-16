import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useProjectAction } from "@/hooks/actions/useProjectAction";
import { useProjectMemberAction } from "@/hooks/actions/useProjectMemberAction";
import { Role } from "@/enums/roleEnum";

import type {
  ProjectMemberPageViewProps,
  ProjectMember,
  Invitation,
} from "./interface";

export default function withProjectMemberPage(
  Component: React.FC<ProjectMemberPageViewProps>,
) {
  function WithProjectMemberPage() {
    const params = useParams();
    const projectId = params.projectId ?? "";
    const projectIdNum = Number(projectId);
    const queryClient = useQueryClient();
    const alert = useAlert();
    const { user: authUser } = useAuth();
    const currentUserId = authUser?.id;

    const { getProjectDetail } = useProjectAction();
    const {
      getProjectMembers,
      getProjectInvitations,
      inviteUserToProject,
      removeProjectMember,
    } = useProjectMemberAction();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);

    const { data: projectDetail } = useQuery({
      queryKey: ["project", projectIdNum],
      queryFn: () => getProjectDetail(projectIdNum),
      enabled: !!projectIdNum,
    });

    const currentUserRole: Role =
      projectDetail?.members?.find((m) => m.userId === currentUserId)?.role ??
      Role.VIEWER;

    const isOwner = currentUserRole === Role.OWNER;

    const { data: membersData, isLoading: isLoadingMembers } = useQuery({
      queryKey: ["project", projectIdNum, "members"],
      queryFn: () => getProjectMembers(projectIdNum),
      enabled: !!projectIdNum,
    });

    const { data: invitationsData } = useQuery({
      queryKey: ["project", projectIdNum, "invitations"],
      queryFn: () => getProjectInvitations(projectIdNum),
      enabled: !!projectIdNum && isOwner,
    });

    const members = membersData?.data ?? projectDetail?.members ?? [];
    const invitations: Invitation[] = invitationsData?.data ?? [];

    const isLoading = !projectDetail || isLoadingMembers;

    const inviteMutation = useMutation({
      mutationFn: ({ email, role }: { email: string; role: string }) =>
        inviteUserToProject(projectIdNum, email, role),
      onSuccess: () => {
        alert.success({
          message: "User invited",
          description: "Invitation has been sent.",
        });
        queryClient.invalidateQueries({
          queryKey: ["project", projectIdNum, "invitations"],
        });
        setIsInviteModalOpen(false);
      },
      onError: () => {
        alert.error({
          message: "Invite failed",
          description: "Please try again.",
        });
      },
    });

    const removeMemberMutation = useMutation({
      mutationFn: (userId: number) => removeProjectMember(projectIdNum, userId),
      onSuccess: () => {
        alert.info({
          message: "Member removed",
          description: "Member has been removed from the project.",
        });
        queryClient.invalidateQueries({
          queryKey: ["project", projectIdNum],
        });
        queryClient.invalidateQueries({
          queryKey: ["project", projectIdNum, "members"],
        });
        setIsDeleteMemberModalOpen(false);
        setSelectedMember(null);
      },
      onError: () => {
        alert.error({
          message: "Remove failed",
          description: "Please try again.",
        });
      },
    });

    const handleOpenInviteModal = useCallback(() => {
      setIsInviteModalOpen(true);
    }, []);

    const handleCloseInviteModal = useCallback(() => {
      setIsInviteModalOpen(false);
    }, []);

    const handleInviteSubmit = useCallback(
      async (values: { email: string; role: string }) => {
        await inviteMutation.mutateAsync(values);
      },
      [inviteMutation],
    );

    const handleRemoveMember = useCallback((member: ProjectMember) => {
      setSelectedMember(member);
      setIsDeleteMemberModalOpen(true);
    }, []);

    const handleConfirmRemoveMember = useCallback(() => {
      if (selectedMember) {
        removeMemberMutation.mutateAsync(selectedMember.userId);
      }
    }, [selectedMember, removeMemberMutation]);

    const handleCancelRemoveMember = useCallback(() => {
      setIsDeleteMemberModalOpen(false);
      setSelectedMember(null);
    }, []);

    const viewProps: ProjectMemberPageViewProps = {
      projectId,
      projectName: projectDetail?.name ?? "",
      members,
      invitations,
      currentUserId,
      currentUserRole,
      isOwner,
      isLoading,
      isInviteModalOpen,
      isDeleteMemberModalOpen,
      selectedMember,
      onOpenInviteModal: handleOpenInviteModal,
      onCloseInviteModal: handleCloseInviteModal,
      onInviteSubmit: handleInviteSubmit,
      onRemoveMember: handleRemoveMember,
      onConfirmRemoveMember: handleConfirmRemoveMember,
      onCancelRemoveMember: handleCancelRemoveMember,
    };

    return <Component {...viewProps} />;
  }
  return WithProjectMemberPage;
}
