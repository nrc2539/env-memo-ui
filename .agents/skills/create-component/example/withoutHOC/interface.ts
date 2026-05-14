export type BadgeVariant = "success" | "warning" | "error" | "info";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}
