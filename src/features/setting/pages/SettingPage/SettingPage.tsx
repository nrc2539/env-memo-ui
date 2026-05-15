import { Form, Formik } from "formik";
import * as Yup from "yup";

import { InputField } from "@/components/form/InputField";
import { passwordRegx } from "@/libs/constant";

import type { SettingPageProps } from "./interface";

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .matches(passwordRegx, "Min 10 characters, 1 letter, 1 special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SettingPage({
  user,
  initialValues,
  onSubmit,
}: SettingPageProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Settings</h1>

      {user && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Name</span>
              <p className="text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Ensure your account is secure by using a strong password.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-6 space-y-5">
              <InputField
                name="currentPassword"
                label="Current password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter current password"
              />
              <InputField
                name="newPassword"
                label="New password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              <InputField
                name="confirmPassword"
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
