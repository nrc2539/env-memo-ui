import {
  autoPlacement,
  autoUpdate,
  offset,
  size as elementSize,
} from "@floating-ui/react";
import { useMemo, useState } from "react";

import { useDropdown } from "@/hooks/useDropdown";

import type { DropdownProps, WithDropdownProps } from "./interface";

export function withDropdown(Component: React.FC<DropdownProps>) {
  function WithDropdown({
    label,
    value,
    name,
    errorMessage,
    className,
    placeholder = "Select here",
    disabled = false,
    options,
    buttonClassName,
    placement = "bottom",
    allowedPlacements = ["bottom", "top"],
    searchable,
    searchPlaceholder,
    onSelect,
    onClear,
    handleOpenChange,
  }: WithDropdownProps) {
    const [text, setText] = useState("");
    const {
      isOpen,
      refs,
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      closeDropdown,
    } = useDropdown({
      placement,
      closeOnParentScroll: true,
      onOpenHandle: handleOpenChange,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(4),
        autoPlacement({
          allowedPlacements,
          padding: 4,
        }),
        elementSize({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              maxWidth: `${rects.reference.width}px`,
            });
          },
        }),
      ],
    });

    function handleSelect(value: string) {
      onSelect(value);
      closeDropdown();
    }

    function handleTextChange(text: string) {
      setText(text);
    }

    const selectedLabel = useMemo(
      () => options.find((item) => item.value === value)?.label,
      [value, options],
    );

    const filteredOptions = useMemo(() => {
      if (searchable) {
        return options.filter((item) =>
          item.label.toLowerCase().includes(text.toLowerCase()),
        );
      }
      return options;
    }, [options, text, searchable]);

    const componentProps = {
      refs,
      value,
      placeholder,
      name,
      label,
      className,
      errorMessage,
      options: filteredOptions,
      disabled,
      isOpen,
      floatingStyles,
      selectedLabel,
      buttonClassName,
      searchable,
      searchPlaceholder,
      text,
      handleTextChange,
      handleSelect,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      closeDropdown,
      onClear,
    };

    return <Component {...componentProps} />;
  }

  return WithDropdown;
}
