export interface ProjectFormValues {
  name: string;
}

export interface ProjectModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
}