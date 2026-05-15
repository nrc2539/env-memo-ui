import { Link } from "react-router";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconLoader,
} from "@tabler/icons-react";

import AuthLayout from "@/components/layout/AuthLayout";
import { InputField } from "@/components/form/InputField";
import { passwordRegx } from "@/libs/constant";

import type { ResetPasswordPageProps } from "./interface";

const validationSchema = Yup.object({
  password: Yup.string()
    .matches(passwordRegx, "Min 10 characters, 1 letter, 1 special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

function ResetPasswordSuccessView() {
  return (
    <AuthLayout title="Password reset successful">
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
          <IconCircleCheck className="size-8 text-teal-600" />
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Your password has been reset successfully.
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

function ResetPasswordInvalidTokenView() {
  return (
    <AuthLayout title="Invalid or expired link">
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <IconAlertTriangle className="size-8 text-red-600" />
        </div>
        <p className="mt-6 text-sm text-gray-600">
          This password reset link is invalid or has expired.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please request a new reset link.
        </p>
        <Link
          to="/forgot-password"
          className="mt-8 inline-block w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        >
          Request new reset link
        </Link>
      </div>
    </AuthLayout>
  );
}

function ResetPasswordLoadingView() {
  return (
    <AuthLayout title="Reset your password">
      <div className="mt-8 flex flex-col items-center">
        <IconLoader className="size-8 animate-spin text-teal-600" />
        <p className="mt-4 text-sm text-gray-500">Validating your link...</p>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage({
  initialValues,
  submitted,
  onSubmit,
  validating,
  isValidToken,
}: ResetPasswordPageProps) {
  if (validating) {
    return <ResetPasswordLoadingView />;
  }

  if (!isValidToken) {
    return <ResetPasswordInvalidTokenView />;
  }

  if (submitted) {
    return <ResetPasswordSuccessView />;
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-8 mb-2">
              <InputField
                name="password"
                label="New password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              <InputField
                name="confirmPassword"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
            </div>
            <div className="grid grid-cols-1 gap-y-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
              >
                {isSubmitting ? "Resetting..." : "Reset password"}
              </button>

              <p className="text-center text-sm text-gray-500">
                <Link
                  to="/login"
                  className="font-medium text-teal-600 transition hover:text-teal-500"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
