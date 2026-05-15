import { useMutation } from "@tanstack/react-query";

import { useAlert } from "@/hooks/useAlert";
import { useAuthAction } from "@/hooks/actions/useAuthAction";
import { useAuth } from "@/hooks/useAuth";

import type { LoginFormValues, LoginPageProps } from "./interface";

export default function withLoginPage(Component: React.FC<LoginPageProps>) {
  function WithLoginPage() {
    const { error: showError } = useAlert();
    const { login } = useAuthAction();
    const { setToken } = useAuth();

    const loginMutation = useMutation({
      mutationFn: ({ email, password }: LoginFormValues) =>
        login(email, password),
      onSuccess: (data) => {
        setToken(data.accessToken, data.refreshToken);
      },
      onError: () => {
        showError({
          message: "Login failed",
          description: "Invalid email or password.",
        });
      },
    });

    const initialValues: LoginFormValues = {
      email: "",
      password: "",
    };

    async function onSubmit(values: LoginFormValues) {
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
