import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Modal } from "@/components/Modal";
import { InputField } from "@/components/form/InputField";
import { IconDeviceFloppy } from "@tabler/icons-react";

import type { EnvVariableFormType } from "@/models/EnvVariableFormType";
import type { EnvVariableModalProps } from "./interface";

const initialValues: EnvVariableFormType = { key: "", value: "" };

const validationSchema = Yup.object({
  key: Yup.string()
    .trim()
    .required("Key is required")
    .test("no-leading-number", "Key cannot start with a number", (v) => {
      if (!v) return true;
      return /^[a-zA-Z_]/.test(v);
    })
    .test("no-leading-underscore", "Key cannot start with an underscore", (v) => {
      if (!v) return true;
      return /^[a-zA-Z]/.test(v);
    }),
  value: Yup.string().trim().required("Value is required"),
});

export function EnvVariableModal({
  isOpen,
  isEdit,
  initialValues: initialValuesProp,
  onSubmit,
  onCancel,
}: EnvVariableModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {isEdit ? "Edit Variable" : "Create Variable"}
      </h2>
      <Formik
        initialValues={initialValuesProp ?? initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <InputField
              label="Key"
              name="key"
              placeholder="e.g. DATABASE_URL"
            />
            <InputField
              label="Value"
              name="value"
              placeholder="Enter variable value"
            />
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconDeviceFloppy className="size-4" />
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}