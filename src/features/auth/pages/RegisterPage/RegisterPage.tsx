import { Link } from "react-router";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import AuthLayout from "@/components/layout/AuthLayout";
import { InputField } from "@/components/form/InputField";
import { passwordRegx } from "@/libs/constant";

import type { RegisterPageProps } from "./interface";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(passwordRegx, "Min 10 characters, 1 letter, 1 special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function RegisterPage({
  initialValues,
  onSubmit,
}: RegisterPageProps) {
  return (
    <AuthLayout title="Create your account" subtitle="Get started with EnvMemo">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-6">
            <div className="space-y-1">
              <InputField
                name="name"
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
              />
              <InputField
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-teal-600 transition hover:text-teal-500"
              >
                Sign in
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
