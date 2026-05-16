import type { FormikHelpers } from "formik";
import type { ChangePasswordFormType } from "@/models/ChangePasswordFormType";

export interface SettingPageProps {
  user: { name: string; email: string } | null;
  initialValues: ChangePasswordFormType;
  onSubmit: (
    values: ChangePasswordFormType,
    formikHelper: FormikHelpers<ChangePasswordFormType>,
  ) => Promise<void>;
}
