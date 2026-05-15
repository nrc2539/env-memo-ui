export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginPageProps {
  initialValues: LoginFormValues;
  onSubmit: (values: LoginFormValues) => Promise<void>;
}
