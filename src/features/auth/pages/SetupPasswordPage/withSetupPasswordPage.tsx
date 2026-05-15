import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { useAuthAction } from "@/hooks/actions/useAuthAction";

import type { SetupPasswordFormValues, SetupPasswordPageProps } from "./interface";

export default function withSetupPasswordPage(
  Component: React.FC<SetupPasswordPageProps>,
) {
  function WithSetupPasswordPage() {
    const [searchParams] = useSearchParams();
    const [submitted, setSubmitted] = useState(false);

    const token = searchParams.get("token");
    const { verifyToken, setupPassword } = useAuthAction();

    const { isLoading: validating, data: tokenData } = useQuery({
      queryKey: ["verify-token", "setup", token],
      queryFn: () => verifyToken(token, "setup"),
      enabled: !!token,
    });

    const isValidToken = !!tokenData;
    const name = tokenData?.name ?? "";
    const email = tokenData?.email ?? "";

    const setupPasswordMutation = useMutation({
      mutationFn: ({ password, name }: { password: string; name: string }) =>
        setupPassword(token!, password, name),
      onSuccess: () => {
        setSubmitted(true);
      },
    });

    const initialValues: SetupPasswordFormValues = {
      name,
      email,
      password: "",
      confirmPassword: "",
    };

    async function onSubmit(values: SetupPasswordFormValues) {
      await setupPasswordMutation.mutateAsync({
        password: values.password,
        name: values.name,
      });
    }

    const componentProps: SetupPasswordPageProps = {
      initialValues,
      submitted,
      onSubmit,
      validating,
      isValidToken,
    };

    return <Component {...componentProps} />;
  }
  return WithSetupPasswordPage;
}
