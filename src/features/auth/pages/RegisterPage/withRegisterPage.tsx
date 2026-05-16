import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useAlert } from "@/hooks/useAlert";
import { useAuthAction } from "@/hooks/actions/useAuthAction";

import type { RegisterFormType } from "@/models/RegisterFormType";
import type { RegisterPageProps } from "./interface";

export default function withRegisterPage(
  Component: React.FC<RegisterPageProps>,
) {
  function WithRegisterPage() {
    const navigate = useNavigate();
    const { success, error: showError } = useAlert();
    const { register } = useAuthAction();

    const registerMutation = useMutation({
      mutationFn: ({ name, email, password }: RegisterFormType) =>
        register(name, email, password),
      onSuccess: () => {
        success({
          message: "Registration successful",
          description: "You can now log in with your credentials.",
        });
        navigate("/login", { replace: true });
      },
      onError: () => {
        showError({
          message: "Registration failed",
          description: "Please try again.",
        });
      },
    });

    const initialValues: RegisterFormType = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    async function onSubmit(values: RegisterFormType) {
      await registerMutation.mutateAsync(values);
    }

    const componentProps: RegisterPageProps = {
      initialValues,
      onSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithRegisterPage;
}
