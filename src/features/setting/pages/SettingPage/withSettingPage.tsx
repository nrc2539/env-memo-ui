import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormikHelpers } from "formik";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAction } from "@/hooks/actions/useAuthAction";
import type { ChangePasswordFormType } from "@/models/ChangePasswordFormType";
import type { SettingPageProps } from "./interface";

export default function withSettingPage(Component: React.FC<SettingPageProps>) {
  function WithSettingPage() {
    const { user } = useAuth();
    const { success, error: showError } = useAlert();
    const { changePassword, updateProfile } = useAuthAction();
    const queryClient = useQueryClient();

    const changePasswordMutation = useMutation({
      mutationFn: ({
        currentPassword,
        newPassword,
      }: {
        currentPassword: string;
        newPassword: string;
      }) => changePassword(currentPassword, newPassword),
    });

    const initialValues: ChangePasswordFormType = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    const updateProfileMutation = useMutation({
      mutationFn: (name: string) => updateProfile(name),
    });

    async function handleSubmitProfileForm(name: string) {
      await updateProfileMutation.mutateAsync(name, {
        onSuccess: () => {
          success({
            message: "Profile updated",
            description: "Your name has been updated successfully.",
          });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: () => {
          showError({
            message: "Update failed",
            description: "Please try again.",
          });
        },
      });
    }

    async function handleSubmit(
      values: ChangePasswordFormType,
      formikHelper: FormikHelpers<ChangePasswordFormType>,
    ) {
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
    }

    const componentProps: SettingPageProps = {
      user: user ? { name: user.name, email: user.email } : null,
      onSubmitProfileForm: handleSubmitProfileForm,
      initialValues: initialValues,
      onSubmit: handleSubmit,
    };

    return <Component {...componentProps} />;
  }

  return WithSettingPage;
}
