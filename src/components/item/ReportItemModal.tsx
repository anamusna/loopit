"use client";
import { REPORT_REASONS } from "@/constants/reportReasons";
import { Item } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Select, { SelectState } from "@/tailwind/components/forms/Select";
import Textarea from "@/tailwind/components/forms/Textarea";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faExclamationTriangle,
  faFlag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
export interface ReportItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onReport: (itemId: string, reason: string, details: string) => Promise<void>;
}
const ReportItemModal: React.FC<ReportItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onReport,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!item || !selectedReason) return;
      setIsSubmitting(true);
      setError(null);
      try {
        await onReport(item.id, selectedReason, details);
        setSelectedReason("");
        setDetails("");
        onClose();
      } catch (err) {
        setError("Failed to submit report. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [item, selectedReason, details, onReport, onClose]
  );
  const handleClose = useCallback(() => {
    setSelectedReason("");
    setDetails("");
    setError(null);
    onClose();
  }, [onClose]);
  const reasonOptions = [
    { value: "", label: "Select a reason..." },
    ...REPORT_REASONS.map((reason) => ({
      value: reason.id,
      label: `${reason.icon} ${reason.label}`,
    })),
  ];
  const selectedReasonData = REPORT_REASONS.find(
    (r) => r.id === selectedReason
  );
  if (!item) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={ModalSize.MD}
      title="Report Item"
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-6">
        {}
        <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <span className="text-xl">📷</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Typography
                as={TypographyVariant.H4}
                className="font-semibold text-text-primary line-clamp-2"
              >
                {item.title}
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted mt-1"
              >
                Listed by {item.ownerName}
              </Typography>
            </div>
          </div>
        </div>
        {}
        <form onSubmit={handleSubmit} className="space-y-6">
          {}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Reason for Report <span className="text-destructive">*</span>
            </label>
            <Select
              options={reasonOptions}
              value={selectedReason}
              onValueChange={setSelectedReason}
              state={SelectState.DEFAULT}
              disabled={isSubmitting}
              className="w-full"
            />
            {selectedReasonData && (
              <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                <Typography
                  as={TypographyVariant.P}
                  className="text-sm text-info"
                >
                  {selectedReasonData.description}
                </Typography>
              </div>
            )}
          </div>
          {}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Additional Details
            </label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any additional context or details about your report..."
              rows={4}
              maxLength={500}
              showCharCount
              disabled={isSubmitting}
              className="w-full"
            />
            <Typography
              as={TypographyVariant.SMALL}
              className="text-text-muted"
            >
              Your report will be reviewed by our moderation team. We take all
              reports seriously and will investigate accordingly.
            </Typography>
          </div>
          {}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-destructive"
              >
                {error}
              </Typography>
            </div>
          )}
          {}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant={ButtonVariant.OUTLINE}
              size={ButtonSize.LG}
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.DESTRUCTIVE}
              size={ButtonSize.LG}
              disabled={!selectedReason || isSubmitting}
              isLoading={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <FontAwesomeIcon icon={faFlag} className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
        {}
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-5 h-5 text-warning mt-0.5"
            />
            <div className="space-y-2">
              <Typography
                as={TypographyVariant.H5}
                className="font-semibold text-warning"
              >
                Report Guidelines
              </Typography>
              <ul className="space-y-1 text-sm text-text-muted">
                <li>
                  • Only report items that violate our community guidelines
                </li>
                <li>• Provide specific details to help us investigate</li>
                <li>• False reports may result in account restrictions</li>
                <li>• We review all reports within 24-48 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ReportItemModal;
