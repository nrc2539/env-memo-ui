import type { Role } from "@/enums/roleEnum";
import type { InviteUserFormType } from "@/models/InviteUserFormType";

export interface InviteUserModalProps {
  isOpen: boolean;
  availableRoles: Role[];
  onSubmit: (values: InviteUserFormType) => Promise<void>;
  onCancel: () => void;
}
