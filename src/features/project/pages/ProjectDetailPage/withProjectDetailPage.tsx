import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import type { ProjectDetailPageProps, EnvGroup } from "./interface";

const defaultGroups: EnvGroup[] = [
  {
    id: 1,
    name: "Staging",
    variables: [
      { id: 1, key: "API_URL", value: "https://staging.api.example.com" },
      { id: 2, key: "DB_HOST", value: "staging-db.internal" },
      { id: 3, key: "DB_PORT", value: "5432" },
      { id: 4, key: "REDIS_URL", value: "redis://staging-redis:6379" },
      { id: 5, key: "LOG_LEVEL", value: "debug" },
    ],
  },
  {
    id: 2,
    name: "UAT",
    variables: [
      { id: 6, key: "API_URL", value: "https://uat.api.example.com" },
      { id: 7, key: "DB_HOST", value: "uat-db.internal" },
      { id: 8, key: "DB_PORT", value: "5432" },
      { id: 9, key: "S3_BUCKET", value: "uat-assets" },
    ],
  },
  {
    id: 3,
    name: "Production",
    variables: [
      { id: 10, key: "API_URL", value: "https://api.example.com" },
      { id: 11, key: "DB_HOST", value: "prod-db.internal" },
      { id: 12, key: "DB_PORT", value: "5432" },
      { id: 13, key: "REDIS_URL", value: "redis://prod-redis:6379" },
      { id: 14, key: "S3_BUCKET", value: "prod-assets" },
      { id: 15, key: "LOG_LEVEL", value: "error" },
      { id: 16, key: "CDN_URL", value: "https://cdn.example.com" },
    ],
  },
];

export default function withProjectDetailPage(Component: React.FC<ProjectDetailPageProps>) {
  function WithProjectDetailPage() {
    const params = useParams();
    const projectId = params.projectId;

    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [panelOpen, setPanelOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
      if (!toast) return;
      const id = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(id);
    }, [toast]);

    const toggleGroup = (id: number) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const toggleVar = (id: number) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const toggleGroupAll = (group: EnvGroup) => {
      const ids = group.variables.map((v) => v.id);
      const allSelected = ids.every((id) => selected.has(id));
      setSelected((prev) => {
        const next = new Set(prev);
        for (const id of ids) {
          if (allSelected) next.delete(id);
          else next.add(id);
        }
        return next;
      });
    };

    const copyToClipboard = useCallback(async (text: string, msg?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setToast(msg ?? "Copied to clipboard");
      } catch {
        setToast("Failed to copy");
      }
    }, []);

    const componentProps: ProjectDetailPageProps = {
      projectId,
      projectName: "Frontend App",
      groups: defaultGroups,
      expanded,
      selected,
      panelOpen,
      toast,
      onToggleGroup: toggleGroup,
      onToggleVar: toggleVar,
      onToggleGroupAll: toggleGroupAll,
      onCopyToClipboard: copyToClipboard,
      onSetPanelOpen: setPanelOpen,
    };

    return <Component {...componentProps} />;
  }
  return WithProjectDetailPage;
}