import type { EnvGroupFormType } from "@/models/EnvGroupFormType";

export interface EnvGroupModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialValues?: EnvGroupFormType;
  onSubmit: (values: EnvGroupFormType) => Promise<void>;
  onCancel: () => void;
}