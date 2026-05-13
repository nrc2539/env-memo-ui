import type { RegisterFormValues, RegisterPageProps } from "./interface";

export default function withRegisterPage(Component: React.FC<RegisterPageProps>) {
  function WithRegisterPage() {
    const initialValues: RegisterFormValues = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    function onSubmit(values: RegisterFormValues) {
      console.log(values);
    }

    const componentProps: RegisterPageProps = {
      initialValues,
      onSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithRegisterPage;
}
