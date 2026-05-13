import {
  autoPlacement,
  autoUpdate,
  offset,
  useClick,
  useDismiss,
  useFloating,
  type UseFloatingOptions,
  useInteractions,
} from "@floating-ui/react";
import { useEffect, useState } from "react";

interface DropdownHook extends UseFloatingOptions {
  closeOnParentScroll?: boolean;
  onOpenHandle?: (value: boolean) => void;
}

const defaultFloatingOptions: UseFloatingOptions = {
  placement: "bottom-start",
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(4),
    autoPlacement({
      allowedPlacements: ["bottom-end", "top-end", "bottom-start", "top-start"],
      padding: 4,
    }),
  ],
};

export function useDropdown(
  { closeOnParentScroll, onOpenHandle, ...options }: DropdownHook = {
    closeOnParentScroll: false,
  },
) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (onOpenHandle) onOpenHandle(isOpen);
  };

  const { refs, floatingStyles, context, x, y, strategy } =
    useFloating<HTMLLabelElement>({
      ...defaultFloatingOptions,
      ...options,
      open: isOpen,
      onOpenChange,
    });

  const click = useClick(context, { event: "mousedown" });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss],
  );

  function closeDropdown() {
    setIsOpen(false);
  }

  function findScrollableParent(
    element: HTMLElement | null,
  ): HTMLElement | null {
    if (element == null) {
      return null;
    }

    // Check if the element is scrollable
    if (
      (element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth) &&
      [
        "overflow-auto",
        "overflow-scroll",
        "overflow-y-auto",
        "overflow-x-auto",
        "overflow-y-scroll",
        "overflow-x-auto",
      ].some((v) => element.classList.contains(v))
    ) {
      return element;
    }

    // If not, check its parent element
    return findScrollableParent(element.parentElement);
  }

  function handleScroll(e: Event) {
    const { scrollTop, scrollLeft } = e.target as HTMLDivElement;
    if (isOpen && (scrollTop > 0 || scrollLeft > 0)) {
      closeDropdown();
    }
  }

  useEffect(() => {
    if (!closeOnParentScroll) {
      return;
    }

    const scrollableParent = findScrollableParent(
      refs.reference.current as HTMLElement,
    );

    if (scrollableParent) {
      scrollableParent.addEventListener("scroll", handleScroll);

      return () => {
        scrollableParent.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, refs.reference, closeOnParentScroll]);

  return {
    refs,
    isOpen,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    closeDropdown,
    context,
    x,
    y,
    strategy,
  };
}
