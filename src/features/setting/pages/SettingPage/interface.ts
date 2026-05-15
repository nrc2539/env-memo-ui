import type { FormikHelpers } from "formik";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingPageProps {
  user: { name: string; email: string } | null;
  initialValues: ChangePasswordFormValues;
  onSubmit: (
    values: ChangePasswordFormValues,
    formikHelper: FormikHelpers<ChangePasswordFormValues>,
  ) => Promise<void>;
}
