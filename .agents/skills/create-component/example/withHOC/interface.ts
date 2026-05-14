export interface CardProps {
  title: string;
  description: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onSubmit?: (data: { title: string; description: string }) => void;
}
