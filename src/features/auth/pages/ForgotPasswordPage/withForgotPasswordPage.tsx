import { useState } from "react";
import type { ForgotFormValues, ForgotPasswordPageProps } from "./interface";

export default function withForgotPasswordPage(
  Component: React.FC<ForgotPasswordPageProps>,
) {
  function WithForgotPasswordPage() {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

    const initialValues: ForgotFormValues = {
      email: "",
    };

    function onSubmit(values: ForgotFormValues) {
      setSubmittedEmail(values.email);
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
