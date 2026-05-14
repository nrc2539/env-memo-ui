export interface SettingPageProps {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  onCurrentPasswordChange?: (value: string) => void;
  onNewPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  onSubmit?: () => void;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}