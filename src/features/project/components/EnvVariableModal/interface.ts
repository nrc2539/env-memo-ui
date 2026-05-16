import type { EnvVariableFormType } from "@/models/EnvVariableFormType";

export interface EnvVariableModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialValues?: EnvVariableFormType;
  onSubmit: (values: EnvVariableFormType) => Promise<void>;
  onCancel: () => void;
}