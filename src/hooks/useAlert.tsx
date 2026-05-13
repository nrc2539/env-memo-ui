import { cva } from "class-variance-authority";
import {
  type CloseButtonProps,
  toast,
  type ToastOptions,
} from "react-toastify";

import { cn } from "@/libs/utils";
import {
  IconAlertTriangleFilled,
  IconCheckFilled,
  IconExclamationCircleFilled,
  IconInfoCircleFilled,
  IconXFilled,
} from "@tabler/icons-react";

interface AlertProps {
  message: React.ReactNode;
  description?: React.ReactNode;
  options?: ToastOptions;
  logo?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

interface AlertContentProps extends AlertProps {
  defaultIcon?: React.ReactNode;
}

const toastVariants = cva("border", {
  variants: {
    type: {
      info: "border-blue-500 bg-blue-100",
      success: "border-green-500 bg-green-100",
      warning: "border-yellow-500 bg-yellow-100",
      error: "border-red-500 bg-red-100",
    },
  },
});

export function useAlert() {
  const CloseButton = ({ closeToast }: CloseButtonProps) => (
    <button onClick={closeToast} className="Toastify__close-button">
      <IconXFilled className="size-4 text-black" />
    </button>
  );

  function alertContent({
    message,
    description,
    logo,
    defaultIcon,
  }: AlertContentProps) {
    return logo ? (
      <div className="grid grid-cols-[56px_1fr_16px] gap-4">
        <div className="w-full h-full all-center items-start">{logo}</div>
        <div className={cn("grid  gap-y-2 grid-cols-1")}>
          <div className="font-bold">{message}</div>
          {description && <div>{description}</div>}
        </div>
      </div>
    ) : (
      <div className={cn("grid gap-2 grid-cols-[24px_1fr_16px]")}>
        <div className="all-center">{defaultIcon}</div>
        <div className="font-bold">{message}</div>
        {description && <div className="col-span-2">{description}</div>}
      </div>
    );
  }

  function showToast(
    type: "info" | "success" | "warning" | "error",
    defaultIcon: React.ReactNode,
    { options, showCloseButton = true, className, ...props }: AlertProps,
  ) {
    toast(
      alertContent({
        defaultIcon,
        showCloseButton,
        ...props,
      }),
      {
        ...options,
        className: cn("w-[500px]", toastVariants({ type }), className),
        closeButton: showCloseButton ? CloseButton : false,
      },
    );
  }

  function info(props: AlertProps) {
    showToast(
      "info",
      <IconInfoCircleFilled className="size-5 text-blue-500" />,
      props,
    );
  }

  function success(props: AlertProps) {
    showToast(
      "success",
      <IconCheckFilled className="size-5 text-green-500" />,
      props,
    );
  }

  function warning(props: AlertProps) {
    showToast(
      "warning",
      <IconAlertTriangleFilled className="size-5 text-yellow-500" />,
      props,
    );
  }

  function error(props: AlertProps) {
    showToast(
      "error",
      <IconExclamationCircleFilled className="size-5 text-red-500" />,
      props,
    );
  }

  return {
    success,
    error,
    warning,
    info,
  };
}
