import type { SettingPageProps, ChangePasswordFormValues } from "./interface";

export default function withSettingPage(
  Component: React.FC<SettingPageProps>,
) {
  function WithSettingPage() {
    const initialValues: ChangePasswordFormValues = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    const handleSubmit = async (values: ChangePasswordFormValues) => {
      console.log("Password change submitted:", values);
    };

    return (
      <Component initialValues={initialValues} onSubmit={handleSubmit} />
    );
  }

  return WithSettingPage;
}
