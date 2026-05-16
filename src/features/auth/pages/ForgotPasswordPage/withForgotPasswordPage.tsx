import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuthAction } from "@/hooks/actions/useAuthAction";

import type { ForgotFormType } from "@/models/ForgotFormType";
import type { ForgotPasswordPageProps } from "./interface";

export default function withForgotPasswordPage(
  Component: React.FC<ForgotPasswordPageProps>,
) {
  function WithForgotPasswordPage() {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
    const { success, error: showError } = useAlert();
    const { forgotPassword } = useAuthAction();

    const forgotPasswordMutation = useMutation({
      mutationFn: ({ email }: ForgotFormType) => forgotPassword(email),
      onSuccess: (_data, variables) => {
        success({
          message: "Email sent",
          description: "Check your inbox for the reset link.",
        });
        setSubmittedEmail(variables.email);
      },
      onError: () => {
        showError({
          message: "Failed to send email",
          description: "Please try again.",
        });
      },
    });

    const initialValues: ForgotFormType = {
      email: "",
    };

    async function onSubmit(values: ForgotFormType) {
      await forgotPasswordMutation.mutateAsync(values);
    }

    const componentProps: ForgotPasswordPageProps = {
      initialValues,
      submittedEmail,
      onSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithForgotPasswordPage;
}
