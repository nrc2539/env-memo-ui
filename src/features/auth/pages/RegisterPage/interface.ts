import type { RegisterFormType } from "@/models/RegisterFormType";

export interface RegisterPageProps {
  initialValues: RegisterFormType;
  onSubmit: (values: RegisterFormType) => Promise<void>;
}
