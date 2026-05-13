export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterPageProps {
  initialValues: RegisterFormValues;
  onSubmit: (values: RegisterFormValues) => void;
}
