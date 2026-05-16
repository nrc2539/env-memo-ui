import type { SetupPasswordFormType } from "@/models/SetupPasswordFormType";

export interface SetupPasswordPageProps {
  initialValues: SetupPasswordFormType;
  submitted: boolean;
  onSubmit: (values: SetupPasswordFormType) => void;
  validating: boolean;
  isValidToken: boolean;
}
