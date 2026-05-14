import type { Role } from "@/enums/roleEnum";

export interface InviteUserFormValues {
  email: string;
  role: string;
}

export interface InviteUserModalProps {
  isOpen: boolean;
  availableRoles: Role[];
  onSubmit: (values: InviteUserFormValues) => Promise<void>;
  onCancel: () => void;
}
