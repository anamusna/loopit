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
          return "w-full max-w-sm";
        case ModalSize.MD:
          return "w-full max-w-lg";
        case ModalSize.LG:
          return "w-full max-w-2xl";
        case ModalSize.XL:
          return "w-full max-w-4xl";
        case ModalSize.FULL:
          return "w-full max-w-6xl mx-4";
        default:
          return "w-full max-w-lg";
      }
    };
    const titleId = title ? "modal-title" : undefined;
    const sizeClasses = getSizeClasses(size);
    const modalContent = (
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 overflow-y-auto">
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
            "border border-border rounded-lg shadow-xl",
            "p-6 overflow-hidden",
            sizeClasses,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={`flex items-center mb-6 pb-4 border-b border-border ${
              title ? "justify-between" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-3">
              {icon && (
                <div
                  className={clsx(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary"
                  )}
                >
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3
                    id={titleId}
                    className="text-xl font-semibold text-foreground pr-8"
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-text-muted">{subtitle}</p>
                )}
              </div>
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                aria-label="Close modal"
                className="flex-shrink-0 text-text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
                onClick={onClose}
              >
                <Icon icon={faXmark} size={IconSize.LG} />
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
