import type { LoginFormType } from "@/models/LoginFormType";

export interface LoginPageProps {
  initialValues: LoginFormType;
  onSubmit: (values: LoginFormType) => Promise<void>;
}
