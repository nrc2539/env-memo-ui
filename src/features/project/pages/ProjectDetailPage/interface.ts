import type { Role } from "@/enums/roleEnum";

import type { EnvVariableType } from "@/models/EnvVariableType";
import type { EnvGroupType } from "@/models/EnvGroupType";

export interface ProjectDetailPageProps {
  projectId?: string;
  projectName?: string;
  groups?: EnvGroupType[];
  expanded?: Set<string>;
  selected?: Set<string>;
  panelOpen?: boolean;
  toast?: string | null;
  currentUserRole: Role;
  onToggleGroup: (id: string) => void;
  onToggleVar: (id: string) => void;
  onToggleGroupAll: (group: EnvGroupType) => void;
  onCopyToClipboard: (text: string, msg?: string) => Promise<void>;
  onSetPanelOpen: (open: boolean) => void;
  onEditProject?: (name: string, description: string | null) => Promise<void>;
  onDeleteProject?: () => Promise<void>;
  onCreateGroup?: (name: string) => Promise<void>;
  onEditGroup?: (id: string, name: string) => Promise<void>;
  onDeleteGroup?: (id: string) => Promise<void>;
  onCreateVariable?: (groupId: string, key: string, value: string) => Promise<void>;
  onEditVariable?: (variable: EnvVariableType, key: string, value: string) => Promise<void>;
  onDeleteVariable?: (variable: EnvVariableType) => Promise<void>;
}
