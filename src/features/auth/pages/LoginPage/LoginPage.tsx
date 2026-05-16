import { Link } from "react-router";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { InputField } from "@/components/form/InputField";
import PasswordInputField from "@/components/form/PasswordInputField";
import AuthLayout from "@/components/layout/AuthLayout";

import type { LoginPageProps } from "./interface";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage({ initialValues, onSubmit }: LoginPageProps) {
  return (
    <AuthLayout title="Sign in to your account" subtitle="Welcome back!">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-6">
            <div className="space-y-1">
              <InputField
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
              />
              <div>
                <PasswordInputField
                  name="password"
                  label="Password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <div className="mt-2 flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-teal-600 transition hover:text-teal-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-teal-600 transition hover:text-teal-500"
              >
                Create one
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
