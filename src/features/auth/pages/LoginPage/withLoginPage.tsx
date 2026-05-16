import { useMutation } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuthAction } from "@/hooks/actions/useAuthAction";
import { useAuth } from "@/hooks/useAuth";

import type { LoginFormType } from "@/models/LoginFormType";
import type { LoginPageProps } from "./interface";

export default function withLoginPage(Component: React.FC<LoginPageProps>) {
  function WithLoginPage() {
    const { error: showError } = useAlert();
    const { login } = useAuthAction();
    const { setToken } = useAuth();

    const loginMutation = useMutation({
      mutationFn: ({ email, password }: LoginFormType) =>
        login(email, password),
      onSuccess: (data) => {
        setToken(data.accessToken, data.refreshToken);
      },
      onError: () => {
        showError({
          message: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
      },
    });

    const initialValues: LoginFormType = {
      email: "",
      password: "",
    };

    async function onSubmit(values: LoginFormType) {
      await loginMutation.mutateAsync(values);
    }

    const componentProps: LoginPageProps = {
      initialValues,
      onSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithLoginPage;
}
