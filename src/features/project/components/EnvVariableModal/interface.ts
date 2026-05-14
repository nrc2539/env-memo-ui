export interface EnvVariableFormValues {
  key: string;
  value: string;
}

export interface EnvVariableModalProps {
  isOpen: boolean;
  isEdit: boolean;
  initialValues?: EnvVariableFormValues;
  onSubmit: (values: EnvVariableFormValues) => Promise<void>;
  onCancel: () => void;
}