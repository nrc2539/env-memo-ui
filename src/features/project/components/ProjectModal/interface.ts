import type { ProjectFormType } from "@/models/ProjectFormType";

export interface ProjectModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialValues?: ProjectFormType;
  onSubmit: (values: ProjectFormType) => Promise<void>;
  onCancel: () => void;
}