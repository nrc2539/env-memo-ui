import { ErrorMessage } from "@/components/ErrorMessage";

import { cn } from "@/libs/utils";

import type { DropdownProps } from "./interface";
import Input from "../Input";
import {
  IconCaretUpFilled,
  IconSearch,
  IconXFilled,
} from "@tabler/icons-react";

export function Dropdown({
  refs,
  label,
  className,
  errorMessage,
  options,
  disabled,
  placeholder,
  isOpen,
  floatingStyles,
  selectedLabel,
  buttonClassName,
  menuListClassName,
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
}: DropdownProps) {
  return (
    <div className={className}>
      {label && <div className="text-[14px] text-black">{label}</div>}

      <button
        type="button"
        className={cn(
          "mt-1 grid grid-cols-[1fr_16px] gap-x-1 items-center px-4 py-2.5 h-10 border border-gray-300 rounded-md w-full disabled:text-gray-400",
          buttonClassName,
          {
            "border-teal-500": isOpen,
            "border-red-500": !!errorMessage,
            "bg-gray-200": disabled,
            "grid-cols-[1fr_16px_16px]":
              !!selectedLabel && onClear && !disabled,
          },
        )}
        {...getReferenceProps()}
        ref={refs.setReference}
        disabled={disabled}
      >
        <div
          className={cn("text-[14px] text-left w-full truncate", {
            "text-gray-400": !selectedLabel,
          })}
        >
          {selectedLabel || placeholder}
        </div>
        {!!selectedLabel && onClear && !disabled && (
          <span onClick={onClear}>
            <IconXFilled className="text-black size-4" />
          </span>
        )}
        <IconCaretUpFilled
          className={cn("rotate-180 text-teal-600 size-4", {
            "rotate-0": isOpen,
          })}
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            "relative p-1 rounded-md shadow-lg z-10 bg-white max-h-52 overflow-y-auto w-full",
            menuListClassName,
          )}
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {searchable && (
            <li className="sticky top-0 bg-white z-10 mb-1">
              <Input
                className={cn({
                  "border-red-500": !!errorMessage,
                })}
                leftIcon={<IconSearch className="shrink-0 size-4" />}
                value={text}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleTextChange(event.target.value)
                }
                placeholder={searchPlaceholder}
              />
            </li>
          )}
          {options.length ? (
            options.map((item, index) => (
              <li
                key={`${item.value}_${index}`}
                className="py-2.5 px-3 text-[14px] hover:bg-gray-100 hover:cursor-pointer rounded-md truncate"
                {...getItemProps({
                  onClick() {
                    handleSelect(item.value);
                  },
                })}
              >
                <span>{item.label}</span>
              </li>
            ))
          ) : (
            <li
              className="py-2.5 px-3 text-[14px] text-gray-400"
              onClick={closeDropdown}
            >
              No result
            </li>
          )}
        </ul>
      )}

      <div className={cn({ invisible: !errorMessage })}>
        <ErrorMessage text={errorMessage || ""} />
      </div>
    </div>
  );
}
