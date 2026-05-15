import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useAlert } from "@/hooks/useAlert";
import { useAuthAction } from "@/hooks/actions/useAuthAction";

import type { RegisterFormValues, RegisterPageProps } from "./interface";

export default function withRegisterPage(Component: React.FC<RegisterPageProps>) {
  function WithRegisterPage() {
    const navigate = useNavigate();
    const { success, error: showError } = useAlert();
    const { register } = useAuthAction();

    const registerMutation = useMutation({
      mutationFn: ({ name, email, password }: RegisterFormValues) =>
        register(name, email, password),
      onSuccess: () => {
        success({
          message: "Registration successful",
          description: "You can now sign in with your credentials.",
        });
        navigate("/login", { replace: true });
      },
      onError: () => {
        showError({
          message: "Registration failed",
          description: "Please try again with different credentials.",
        });
      },
    });

    const initialValues: RegisterFormValues = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    async function onSubmit(values: RegisterFormValues) {
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
