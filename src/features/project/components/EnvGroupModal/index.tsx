import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Modal } from "@/components/Modal";
import { InputField } from "@/components/form/InputField";
import { IconDeviceFloppy } from "@tabler/icons-react";

import type { EnvGroupModalProps, EnvGroupFormValues } from "./interface";

const initialValues: EnvGroupFormValues = { name: "" };

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Group name is required"),
});

export function EnvGroupModal({
  isOpen,
  isEdit,
  initialValues: initialValuesProp,
  onSubmit,
  onCancel,
}: EnvGroupModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {isEdit ? "Edit Environment Group" : "Create Environment Group"}
      </h2>
      <Formik
        initialValues={initialValuesProp ?? initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <InputField
              label="Group Name"
              name="name"
              placeholder="Enter group name"
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