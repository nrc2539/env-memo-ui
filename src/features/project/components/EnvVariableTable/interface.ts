import type { EnvVariable } from "@/features/project/pages/ProjectDetailPage/interface";

export interface EnvVariableTableProps {
  variables: EnvVariable[];
  selected?: Set<string>;
  onToggleAll: () => void;
  onToggleVar: (id: string) => void;
  onEdit?: (variable: EnvVariable) => void;
  onDelete?: (variable: EnvVariable) => void;
}