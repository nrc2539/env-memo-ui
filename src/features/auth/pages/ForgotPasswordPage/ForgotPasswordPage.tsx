import { Link } from "react-router";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IconMail } from "@tabler/icons-react";

import AuthLayout from "@/components/AuthLayout";
import { InputField } from "@/components/form/InputField";

import type { ForgotPasswordPageProps } from "./interface";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function ForgotPasswordSuccessView({ email }: { email: string }) {
  return (
    <AuthLayout title="Check your email">
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
          <IconMail className=" size-8 text-teal-600" />
        </div>
        <p className="mt-6 text-sm text-gray-600">
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Check your inbox and follow the instructions to reset your password.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-block w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function ForgotPasswordPage({
  initialValues,
  submittedEmail,
  onSubmit,
}: ForgotPasswordPageProps) {
  if (submittedEmail) {
    return <ForgotPasswordSuccessView email={submittedEmail} />;
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-4">
            <InputField
              name="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>

            <p className="text-center text-sm text-gray-500">
              <Link
                to="/login"
                className="font-medium text-teal-600 transition hover:text-teal-500"
              >
                Back to sign in
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
