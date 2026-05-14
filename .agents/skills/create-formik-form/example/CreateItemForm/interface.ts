export interface CreateItemFormValues {
  name: string;
  description: string;
}

export interface CreateItemFormProps {
  initialValues: CreateItemFormValues;
  onSubmit: (values: CreateItemFormValues) => void;
}