import type { EnvVariable } from "@/features/project/pages/ProjectDetailPage/interface";

export interface EnvVariableTableProps {
  variables: EnvVariable[];
  selected?: Set<number>;
  onToggleAll: () => void;
  onToggleVar: (id: number) => void;
  onEdit: (variable: EnvVariable) => void;
  onDelete: (variable: EnvVariable) => void;
}