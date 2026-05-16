import type { EnvVariableType } from "@/models/EnvVariableType";

export interface EnvVariableTableProps {
  variables: EnvVariableType[];
  selected?: Set<string>;
  onToggleAll: () => void;
  onToggleVar: (id: string) => void;
  onEdit?: (variable: EnvVariableType) => void;
  onDelete?: (variable: EnvVariableType) => void;
}