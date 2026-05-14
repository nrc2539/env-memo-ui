import { Form, Formik } from "formik";
import * as Yup from "yup";

import { InputField } from "@/components/form/InputField";

import type { CreateItemFormProps } from "./interface";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

export default function CreateItemForm({ initialValues, onSubmit }: CreateItemFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <InputField name="name" label="Name" placeholder="Enter item name" />
          <InputField
            name="description"
            label="Description"
            placeholder="Enter item description"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Item"}
          </button>
        </Form>
      )}
    </Formik>
  );
}