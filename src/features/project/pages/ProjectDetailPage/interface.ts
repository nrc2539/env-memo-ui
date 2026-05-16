import type { Role } from "@/enums/roleEnum";
import type { ProjectMember } from "@/features/project/pages/ProjectMemberPage/interface";

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  envGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnvGroup {
  id: string;
  name: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  variables: EnvVariable[];
}

export interface ProjectDetail {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
}

export interface ProjectDetailPageProps {
  projectId?: string;
  projectName?: string;
  groups?: EnvGroup[];
  expanded?: Set<string>;
  selected?: Set<string>;
  panelOpen?: boolean;
  toast?: string | null;
  currentUserRole: Role;
  onToggleGroup: (id: string) => void;
  onToggleVar: (id: string) => void;
  onToggleGroupAll: (group: EnvGroup) => void;
  onCopyToClipboard: (text: string, msg?: string) => Promise<void>;
  onSetPanelOpen: (open: boolean) => void;
  onEditProject?: (name: string, description: string | null) => Promise<void>;
  onDeleteProject?: () => Promise<void>;
  onCreateGroup?: (name: string) => Promise<void>;
  onEditGroup?: (id: string, name: string) => Promise<void>;
  onDeleteGroup?: (id: string) => Promise<void>;
  onCreateVariable?: (groupId: string, key: string, value: string) => Promise<void>;
  onEditVariable?: (variable: EnvVariable, key: string, value: string) => Promise<void>;
  onDeleteVariable?: (variable: EnvVariable) => Promise<void>;
}
