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
  onToggleGroup: (id: number) => void;
  onToggleVar: (id: number) => void;
  onToggleGroupAll: (group: EnvGroup) => void;
  onCopyToClipboard: (text: string, msg?: string) => Promise<void>;
  onSetPanelOpen: (open: boolean) => void;
  onEditProject?: () => void;
  onDeleteProject?: () => void;
}
