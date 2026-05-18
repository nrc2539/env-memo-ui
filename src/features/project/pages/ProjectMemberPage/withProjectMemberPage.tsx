import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useQueryStrings } from "@/hooks/useQueryStrings";
import { useProjectAction } from "@/hooks/actions/useProjectAction";
import { useProjectMemberAction } from "@/hooks/actions/useProjectMemberAction";
import { Role } from "@/enums/roleEnum";
import { InvitationStatus } from "@/enums/invitationStatusEnum";

import type { ProjectMemberType } from "@/models/ProjectMemberType";
import type { InvitationType } from "@/models/InvitationType";
import type {
  ProjectMemberSearchParams,
  ProjectMemberPageViewProps,
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
      resendInvitation,
      removeInvitation,
    } = useProjectMemberAction();

    const { getNumberParam } = useGetQuery();
    const { updateQueryStrings } = useQueryStrings<ProjectMemberSearchParams>();

    const searchParams: ProjectMemberSearchParams = {
      page: getNumberParam("page") ?? 1,
    };

    const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());

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
      queryKey: ["project", projectIdNum, "members", searchParams.page],
      queryFn: () =>
        getProjectMembers(projectIdNum, { page: searchParams.page }),
      enabled: !!projectIdNum,
    });

    const { data: invitationsData } = useQuery({
      queryKey: ["project", projectIdNum, "invitations"],
      queryFn: () =>
        getProjectInvitations(projectIdNum, {
          status: InvitationStatus.PENDING,
          all: true,
        }),
      enabled: !!projectIdNum && isOwner,
    });

    const members = membersData?.data ?? projectDetail?.members ?? [];
    const invitations: InvitationType[] = invitationsData?.data ?? [];
    const totalPages = membersData?.meta?.totalPages ?? 1;

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
          queryKey: ["project", projectIdNum],
        });
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
      },
      onError: () => {
        alert.error({
          message: "Remove failed",
          description: "Please try again.",
        });
      },
    });

    const resendInviteMutation = useMutation({
      mutationFn: (invitationId: string) =>
        resendInvitation(projectIdNum, invitationId),
      onSuccess: () => {
        alert.success({
          message: "Invitation resent",
          description: "The invitation has been resent.",
        });
      },
      onError: () => {
        alert.error({
          message: "Resend failed",
          description: "Please try again.",
        });
      },
      onSettled: (_data, _error, invitationId) => {
        setResendingIds((prev) => {
          const next = new Set(prev);
          next.delete(invitationId);
          return next;
        });
      },
    });

    const removeInvitationMutation = useMutation({
      mutationFn: (invitationId: string) =>
        removeInvitation(projectIdNum, invitationId),
      onSuccess: () => {
        alert.info({
          message: "Invitation removed",
          description: "The invitation has been removed.",
        });
        queryClient.invalidateQueries({
          queryKey: ["project", projectIdNum, "invitations"],
        });
      },
      onError: () => {
        alert.error({
          message: "Remove failed",
          description: "Please try again.",
        });
      },
    });

    const onInviteSubmit = useCallback(
      async (values: { email: string; role: string }) => {
        await inviteMutation.mutateAsync(values);
      },
      [inviteMutation],
    );

    const onRemoveMember = useCallback(
      async (member: ProjectMemberType) => {
        await removeMemberMutation.mutateAsync(member.userId);
      },
      [removeMemberMutation],
    );

    const onResendInvite = useCallback(
      async (invitationId: string) => {
        setResendingIds((prev) => new Set(prev).add(invitationId));
        await resendInviteMutation.mutateAsync(invitationId);
      },
      [resendInviteMutation],
    );

    const onRemoveInvitation = useCallback(
      async (invitationId: string) => {
        await removeInvitationMutation.mutateAsync(invitationId);
      },
      [removeInvitationMutation],
    );

    function onPageChange(newPage: number) {
      updateQueryStrings({ page: newPage });
    }

    const viewProps: ProjectMemberPageViewProps = {
      projectId,
      projectName: projectDetail?.name ?? "",
      members,
      invitations,
      currentUserId,
      currentUserRole,
      isOwner,
      isLoading,
      page: searchParams.page,
      totalPages,
      resendingIds,
      onInviteSubmit,
      onRemoveMember,
      onResendInvite,
      onRemoveInvitation,
      onPageChange,
    };

    return <Component {...viewProps} />;
  }
  return WithProjectMemberPage;
}
