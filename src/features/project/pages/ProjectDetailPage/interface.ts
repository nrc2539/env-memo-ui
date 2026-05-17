import type { Role } from "@/enums/roleEnum";

import type { EnvVariableType } from "@/models/EnvVariableType";
import type { EnvGroupType } from "@/models/EnvGroupType";
import type { ProjectType } from "@/models/ProjectType";

export interface ProjectDetailPageProps {
  projectId?: string;
  projectName?: string;
  projectDescription?: string;
  isLoading?: boolean;
  groups?: EnvGroupType[];
  expanded?: Set<string>;
  selected?: Set<string>;
  panelOpen?: boolean;
  toast?: string | null;
  currentUserRole: Role;
  onExpandGroup: (id: string) => void;
  onSelectVar: (id: string) => void;
  onSelectVarAll: (group: EnvGroupType) => void;
  onCopyToClipboard: (text: string, msg?: string) => Promise<void>;
  onSetPanelOpen: (open: boolean) => void;
  onEditProject?: (name: string, description: string | null) => Promise<void>;
  onDeleteProject?: () => Promise<void>;
  onCreateGroup?: (name: string) => Promise<void>;
  onEditGroup?: (id: string, name: string) => Promise<void>;
  onDeleteGroup?: (id: string) => Promise<void>;
  onCreateVariable?: (
    groupId: string,
    key: string,
    value: string,
  ) => Promise<void>;
  onEditVariable?: (
    variable: EnvVariableType,
    key: string,
    value: string,
  ) => Promise<void>;
  onDeleteVariable?: (variable: EnvVariableType) => Promise<void>;
}

export type ProjectDetailModalStateType = {
  type?:
    | "editProject"
    | "deleteProject"
    | "createGroup"
    | "editGroup"
    | "deleteGroup"
    | "createVariable"
    | "editVariable"
    | "deleteVariable";
  data?: {
    project?: ProjectType;
    group?: EnvGroupType;
    variable?: EnvVariableType;
  };
};
