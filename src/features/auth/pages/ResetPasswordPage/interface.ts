export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordPageProps {
  initialValues: ResetPasswordFormValues;
  submitted: boolean;
  onSubmit: (values: ResetPasswordFormValues) => void;
  validating: boolean;
  isValidToken: boolean;
}
