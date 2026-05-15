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

import type { SetupPasswordPageProps } from "./interface";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  password: Yup.string()
    .matches(passwordRegx, "Min 10 characters, 1 letter, 1 special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

function SetupPasswordSuccessView() {
  return (
    <AuthLayout title="Password set up successfully">
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
          <IconCircleCheck className="size-8 text-teal-600" />
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Your account is now active. You can sign in with your new password.
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

function SetupPasswordInvalidTokenView() {
  return (
    <AuthLayout title="Invalid link">
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <IconAlertTriangle className="size-8 text-red-600" />
        </div>
        <p className="mt-6 text-sm text-gray-600">
          This invitation link is invalid.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please contact your administrator for a new invitation.
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

function SetupPasswordLoadingView() {
  return (
    <AuthLayout title="Set up your password">
      <div className="mt-8 flex flex-col items-center">
        <IconLoader className="size-8 animate-spin text-teal-600" />
        <p className="mt-4 text-sm text-gray-500">Validating your link...</p>
      </div>
    </AuthLayout>
  );
}

export default function SetupPasswordPage({
  initialValues,
  submitted,
  onSubmit,
  validating,
  isValidToken,
}: SetupPasswordPageProps) {
  if (validating) {
    return <SetupPasswordLoadingView />;
  }

  if (!isValidToken) {
    return <SetupPasswordInvalidTokenView />;
  }

  if (submitted) {
    return <SetupPasswordSuccessView />;
  }

  return (
    <AuthLayout
      title="Set up your password"
      subtitle="Create a strong password for your account."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-8 mb-1">
              <InputField
                name="name"
                label="Name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
              />
              <InputField
                name="email"
                label="Email"
                type="email"
                disabled
                autoComplete="email"
              />
              <InputField
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
              />
              <InputField
                name="confirmPassword"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
              />
            </div>
            <div className="grid grid-cols-1 gap-y-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
              >
                {isSubmitting ? "Setting up..." : "Set up password"}
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
