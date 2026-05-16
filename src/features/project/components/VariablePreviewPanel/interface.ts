import type { EnvVariableType } from "@/models/EnvVariableType";

export interface VariablePreviewPanelProps {
  isOpen: boolean;
  selectedVars: EnvVariableType[];
  onClose: () => void;
  onCopy: (text: string) => Promise<void>;
}