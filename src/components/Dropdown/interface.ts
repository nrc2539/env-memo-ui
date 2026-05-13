import type { Placement, ReferenceType } from "@floating-ui/react-dom";
import type { CSSProperties, HTMLProps, MutableRefObject } from "react";

import type { SelectType } from "@/interfaces/SelectType";

export interface WithDropdownProps {
  value: string;
  options: SelectType[];
  name?: string;
  className?: string;
  buttonClassName?: string;
  menuListClassName?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  placement?: Placement;
  allowedPlacements?: Placement[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSelect: (value: string) => void;
  onClear?: () => void;
  handleOpenChange?: (value: boolean) => void;
}

export interface DropdownProps extends Omit<
  WithDropdownProps,
  "onSelect" | "handleOpenChange"
> {
  refs: {
    reference: MutableRefObject<ReferenceType | null>;
    floating: MutableRefObject<HTMLElement | null>;
    setReference: (node: ReferenceType | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  value: string;
  isOpen: boolean;
  floatingStyles: CSSProperties;
  selectedLabel?: string;
  text: string;
  handleTextChange: (text: string) => void;
  handleSelect: (value: string) => void;
  getReferenceProps: (
    userProps?: HTMLProps<Element> | undefined,
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>;
  getItemProps: (
    userProps?: Omit<HTMLProps<HTMLElement>, "selected" | "active"> | undefined,
  ) => Record<string, unknown>;
  closeDropdown: () => void;
}
