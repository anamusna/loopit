import { faXmark } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon, { IconSize } from "../elements/Icon";

export enum ModalSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  FULL = "full",
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    children,
    title,
    subtitle,
    icon,
    size = ModalSize.MD,
    className = "",
    hideCloseButton = false,
    closeOnBackdropClick = true,
    closeOnEscape = true,
  }) => {
    const [mounted, setMounted] = useState(false);
    const modalIsOpen = Boolean(isOpen);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    const handleEscapeKey = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      },
      [onClose]
    );

    useEffect(() => {
      if (!closeOnEscape || !modalIsOpen) return;
      document.addEventListener("keydown", handleEscapeKey);
      return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [modalIsOpen, closeOnEscape, handleEscapeKey]);

    useEffect(() => {
      if (modalIsOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [modalIsOpen]);

    const handleBackdropClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          onClose();
        }
      },
      [closeOnBackdropClick, onClose]
    );

    if (!mounted || !modalIsOpen) return null;

    const getSizeClasses = (modalSize: ModalSize): string => {
      switch (modalSize) {
        case ModalSize.SM:
          return "w-full max-w-sm mx-4 sm:mx-0";
        case ModalSize.MD:
          return "w-full max-w-md sm:max-w-lg mx-4 sm:mx-0";
        case ModalSize.LG:
          return "w-full max-w-lg sm:max-w-2xl mx-4 sm:mx-0";
        case ModalSize.XL:
          return "w-full max-w-2xl sm:max-w-4xl mx-4 sm:mx-0";
        case ModalSize.FULL:
          return "w-full max-w-4xl sm:max-w-6xl mx-4 sm:mx-0";
        default:
          return "w-full max-w-md sm:max-w-lg mx-4 sm:mx-0";
      }
    };

    const titleId = title ? "modal-title" : undefined;
    const sizeClasses = getSizeClasses(size);

    const modalContent = (
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={handleBackdropClick}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={[
            "relative bg-card text-card-foreground",
            "border border-border rounded-xl sm:rounded-lg shadow-xl",
            "p-4 sm:p-6 overflow-hidden",
            "max-h-[90vh] sm:max-h-[85vh] overflow-y-auto",
            sizeClasses,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={`flex items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border ${
              title ? "justify-between" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {icon && (
                <div
                  className={clsx(
                    "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0"
                  )}
                >
                  {icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {title && (
                  <h3
                    id={titleId}
                    className="text-lg sm:text-xl font-semibold text-foreground pr-6 sm:pr-8 truncate"
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-text-muted mt-1 line-clamp-2">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                aria-label="Close modal"
                className="flex-shrink-0 text-text-muted hover:text-foreground transition-colors p-1.5 sm:p-2 rounded-md hover:bg-accent ml-2"
                onClick={onClose}
              >
                <Icon
                  icon={faXmark}
                  size={IconSize.MD}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            )}
          </div>

          <div className="text-text-primary">{children}</div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";
export default Modal;
