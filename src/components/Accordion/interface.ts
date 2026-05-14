import type { ReactNode } from "react";

export interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  badge?: string | number;
  actions?: ReactNode;
  children: ReactNode;
}