import { useState } from "react";

import type { SettingPageProps, ChangePasswordData } from "./interface";

export default function withSettingPage(Component: React.FC<SettingPageProps>) {
  function WithSettingPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = () => {
      const data: ChangePasswordData = { currentPassword, newPassword, confirmPassword };
      console.log("Password change submitted:", data);
    };

    const componentProps: SettingPageProps = {
      currentPassword,
      newPassword,
      confirmPassword,
      onCurrentPasswordChange: setCurrentPassword,
      onNewPasswordChange: setNewPassword,
      onConfirmPasswordChange: setConfirmPassword,
      onSubmit: handleSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithSettingPage;
}