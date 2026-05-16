import type { ResetPasswordFormType } from "@/models/ResetPasswordFormType";

export interface ResetPasswordPageProps {
  initialValues: ResetPasswordFormType;
  submitted: boolean;
  onSubmit: (values: ResetPasswordFormType) => void;
  validating: boolean;
  isValidToken: boolean;
}
