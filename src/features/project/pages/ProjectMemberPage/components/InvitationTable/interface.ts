import type { InvitationType } from "@/models/InvitationType";

export interface InvitationTableProps {
  invitations: InvitationType[];
  resendingIds: Set<string>;
  onResend: (invitation: InvitationType) => void;
  onRemove: (invitation: InvitationType) => void;
}
