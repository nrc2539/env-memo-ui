import type { EnvVariable } from "@/features/project/pages/ProjectDetailPage/interface";

export interface VariablePreviewPanelProps {
  isOpen: boolean;
  selectedVars: EnvVariable[];
  onClose: () => void;
  onCopy: (text: string) => Promise<void>;
}