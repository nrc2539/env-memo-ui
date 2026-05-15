import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuthAction } from "@/hooks/actions/useAuthAction";

import type { ForgotFormValues, ForgotPasswordPageProps } from "./interface";

export default function withForgotPasswordPage(
  Component: React.FC<ForgotPasswordPageProps>,
) {
  function WithForgotPasswordPage() {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
    const { success, error: showError } = useAlert();
    const { forgotPassword } = useAuthAction();

    const forgotPasswordMutation = useMutation({
      mutationFn: ({ email }: ForgotFormValues) => forgotPassword(email),
      onSuccess: (_data, variables) => {
        setSubmittedEmail(variables.email);
        success({
          message: "Reset link sent",
          description: "If that email exists, a reset link has been sent.",
        });
      },
      onError: () => {
        showError({
          message: "Request failed",
          description: "Something went wrong. Please try again.",
        });
      },
    });

    const initialValues: ForgotFormValues = {
      email: "",
    };

    async function onSubmit(values: ForgotFormValues) {
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
