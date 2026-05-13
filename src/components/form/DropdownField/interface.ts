import type { Placement } from "@floating-ui/react-dom";

import type { SelectType } from "@/interfaces/SelectType";

export interface WithDropdownFieldProps {
  options: SelectType[];
  name: string;
  className?: string;
  buttonClassName?: string;
  menuListClassName?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  placement?: Placement;
  allowedPlacements?: Placement[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSelect?: (value: string) => void;
  onClear?: () => void;
}
