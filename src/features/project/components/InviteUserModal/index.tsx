import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IconShield, IconUserPlus } from "@tabler/icons-react";

import { Modal } from "@/components/Modal";
import { InputField } from "@/components/form/InputField";
import { DropdownField } from "@/components/form/DropdownField";

import type { Role } from "@/enums/roleEnum";
import type { SelectType } from "@/interfaces/SelectType";

import type { InviteUserFormType } from "@/models/InviteUserFormType";
import type { InviteUserModalProps } from "./interface";

const initialValues: InviteUserFormType = { email: "", role: "" };

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

function roleOptions(availableRoles: Role[]): SelectType[] {
  return availableRoles.map((r) => ({
    label: r.charAt(0) + r.slice(1).toLowerCase(),
    value: r,
    icon: <IconShield size={16} />,
  }));
}

export function InviteUserModal({
  isOpen,
  availableRoles,
  onSubmit,
  onCancel,
}: InviteUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Invite User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <div className="flex flex-col gap-1">
              <InputField
                label="Email"
                name="email"
                placeholder="Enter user email"
              />
              <DropdownField
                label="Role"
                name="role"
                options={roleOptions(availableRoles)}
                placeholder="Select a role"
              />
            </div>
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
                <IconUserPlus className="size-4" />
                Invite
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
