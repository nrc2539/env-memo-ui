import type { Role } from "@/enums/roleEnum";
import type { InvitationStatus } from "@/enums/invitationStatusEnum";

export interface InvitationType {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
}
