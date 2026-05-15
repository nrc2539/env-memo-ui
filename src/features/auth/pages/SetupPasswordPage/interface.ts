export interface SetupPasswordFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SetupPasswordPageProps {
  initialValues: SetupPasswordFormValues;
  submitted: boolean;
  onSubmit: (values: SetupPasswordFormValues) => void;
  validating: boolean;
  isValidToken: boolean;
}
