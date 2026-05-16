import type { ForgotFormType } from "@/models/ForgotFormType";

export interface ForgotPasswordPageProps {
  initialValues: ForgotFormType;
  submittedEmail: string | null;
  onSubmit: (values: ForgotFormType) => Promise<void>;
}
