import { useMutation } from "@tanstack/react-query";
import type { FormikHelpers } from "formik";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAction } from "@/hooks/actions/useAuthAction";
import type { SettingPageProps, ChangePasswordFormValues } from "./interface";

export default function withSettingPage(Component: React.FC<SettingPageProps>) {
  function WithSettingPage() {
    const { user } = useAuth();
    const { success, error: showError } = useAlert();
    const { changePassword } = useAuthAction();

    const changePasswordMutation = useMutation({
      mutationFn: ({
        currentPassword,
        newPassword,
      }: {
        currentPassword: string;
        newPassword: string;
      }) => changePassword(currentPassword, newPassword),
    });

    const initialValues: ChangePasswordFormValues = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    const handleSubmit = async (
      values: ChangePasswordFormValues,
      formikHelper: FormikHelpers<ChangePasswordFormValues>,
    ) => {
      await changePasswordMutation.mutateAsync(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          onSuccess: () => {
            success({
              message: "Password changed",
              description: "Your password has been updated successfully.",
            });
            formikHelper.resetForm();
          },
          onError: () => {
            showError({
              message: "Password change failed",
              description: "Please try again.",
            });
          },
        },
      );
    };

    return (
      <Component
        user={user ? { name: user.name, email: user.email } : null}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    );
  }

  return WithSettingPage;
}
