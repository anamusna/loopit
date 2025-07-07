"use client";
import { Item } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export interface DeleteItemModalProps {
  item: Item | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  item,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!item) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size={ModalSize.MD}
      className="max-w-md"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive-subtle flex items-center justify-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-5 h-5 text-destructive"
            />
          </div>
          <div>
            <Typography as={TypographyVariant.H3} className="text-text-primary">
              Delete Item
            </Typography>
          </div>
        </div>

        <div className="mb-6">
          <Typography
            as={TypographyVariant.P}
            className="text-text-secondary mb-3"
          >
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Typography>

          <div className="bg-secondary rounded-lg p-3 mb-4">
            <Typography
              as={TypographyVariant.P}
              className="font-medium text-text-primary mb-1"
            >
              {item.title}
            </Typography>
            <Typography
              as={TypographyVariant.SMALL}
              className="text-text-muted"
            >
              {item.category} • {item.condition}
            </Typography>
          </div>
          <Typography as={TypographyVariant.SMALL} className="text-text-muted">
            This will permanently remove the item from your listings and the
            platform. Any ongoing swap requests for this item will be cancelled.
          </Typography>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.MD}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.DESTRUCTIVE}
            size={ButtonSize.MD}
            onClick={onConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default DeleteItemModal;
