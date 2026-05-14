export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingPageProps {
  initialValues: ChangePasswordFormValues;
  onSubmit: (values: ChangePasswordFormValues) => Promise<void>;
}
