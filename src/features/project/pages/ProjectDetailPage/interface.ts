import type { Role } from "@/enums/roleEnum";

export interface EnvVariable {
  id: number;
  key: string;
  value: string;
}

export interface EnvGroup {
  id: number;
  name: string;
  variables: EnvVariable[];
}

export interface ProjectDetailPageProps {
  projectId?: string;
  projectName?: string;
  groups?: EnvGroup[];
  expanded?: Set<number>;
  selected?: Set<number>;
  panelOpen?: boolean;
  toast?: string | null;
  currentUserRole: Role;
  onToggleGroup: (id: number) => void;
  onToggleVar: (id: number) => void;
  onToggleGroupAll: (group: EnvGroup) => void;
  onCopyToClipboard: (text: string, msg?: string) => Promise<void>;
  onSetPanelOpen: (open: boolean) => void;
  onEditProject?: (name: string) => Promise<void>;
  onDeleteProject?: () => Promise<void>;
  onCreateGroup?: (name: string) => Promise<void>;
  onEditGroup?: (id: number, name: string) => Promise<void>;
  onDeleteGroup?: (id: number) => Promise<void>;
  onCreateVariable?: (groupId: number, key: string, value: string) => Promise<void>;
  onEditVariable?: (id: number, key: string, value: string) => Promise<void>;
  onDeleteVariable?: (id: number) => Promise<void>;
  onInviteUser?: (email: string, role: Role) => Promise<void>;
}