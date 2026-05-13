import type { LoginFormValues, LoginPageProps } from "./interface";

export default function withLoginPage(Component: React.FC<LoginPageProps>) {
  function WithLoginPage() {
    const initialValues: LoginFormValues = {
      email: "",
      password: "",
    };

    function onSubmit(values: LoginFormValues) {
      console.log(values);
    }

    const componentProps: LoginPageProps = {
      initialValues,
      onSubmit,
    };

    return <Component {...componentProps} />;
  }
  return WithLoginPage;
}
