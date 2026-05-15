import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { useAuthAction } from "@/hooks/actions/useAuthAction";

import type { ResetPasswordFormValues, ResetPasswordPageProps } from "./interface";

export default function withResetPasswordPage(
  Component: React.FC<ResetPasswordPageProps>,
) {
  function WithResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [submitted, setSubmitted] = useState(false);

    const token = searchParams.get("token");
    const { verifyToken, resetPassword } = useAuthAction();

    const { isLoading: validating, data: tokenData } = useQuery({
      queryKey: ["verify-token", "reset", token],
      queryFn: () => verifyToken(token, "reset"),
      enabled: !!token,
    });

    const isValidToken = tokenData?.valid ?? false;

    const resetPasswordMutation = useMutation({
      mutationFn: (password: string) => resetPassword(token!, password),
      onSuccess: () => {
        setSubmitted(true);
      },
    });

    const initialValues: ResetPasswordFormValues = {
      password: "",
      confirmPassword: "",
    };

    async function onSubmit(values: ResetPasswordFormValues) {
      await resetPasswordMutation.mutateAsync(values.password);
    }

    const componentProps: ResetPasswordPageProps = {
      initialValues,
      submitted,
      onSubmit,
      validating,
      isValidToken,
    };

    return <Component {...componentProps} />;
  }
  return WithResetPasswordPage;
}
