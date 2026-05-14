export interface EnvGroupFormValues {
  name: string;
}

export interface EnvGroupModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialValues?: EnvGroupFormValues;
  onSubmit: (values: EnvGroupFormValues) => Promise<void>;
  onCancel: () => void;
}