export interface ForgotFormValues {
  email: string;
}

export interface ForgotPasswordPageProps {
  initialValues: ForgotFormValues;
  submittedEmail: string | null;
  onSubmit: (values: ForgotFormValues) => void;
}
