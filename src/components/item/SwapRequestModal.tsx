"use client";
import { Item, ItemCategory, ItemCondition, OfferedItem } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import Textarea from "@/tailwind/components/forms/Textarea";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faBolt,
  faCheckCircle,
  faChevronDown,
  faExchangeAlt,
  faGift,
  faMapMarkerAlt,
  faMinus,
  faPlus,
  faStar,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import OfferedItemForm from "./OfferedItemForm";
export interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onSubmit: (
    itemId: string,
    message: string,
    offeredItem?: OfferedItem
  ) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}
const SwapRequestModalPresentation: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string | null;
  includeOfferedItem: boolean;
  onToggleOfferedItem: () => void;
  offeredItem: OfferedItem;
  onOfferedItemChange: (offeredItem: OfferedItem) => void;
}> = React.memo(
  ({
    isOpen,
    onClose,
    item,
    message,
    onMessageChange,
    onSubmit,
    isSubmitting,
    error,
    includeOfferedItem,
    onToggleOfferedItem,
    offeredItem,
    onOfferedItemChange,
  }) => {
    const isOfferedItemValid = useMemo(() => {
      if (!includeOfferedItem) return true;
      return (
        offeredItem.title.trim() !== "" &&
        offeredItem.category !== ("" as ItemCategory) &&
        offeredItem.condition !== ("" as ItemCondition) &&
        offeredItem.description.trim() !== "" &&
        offeredItem.location.trim() !== "" &&
        offeredItem.images.length > 0
      );
    }, [includeOfferedItem, offeredItem]);
    const isFormValid = useMemo(() => {
      return message.trim() !== "" && isOfferedItemValid;
    }, [message, isOfferedItemValid]);
    if (!item) return null;
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={ModalSize.XL}
        title="Request Swap"
        subtitle="Send a swap request to the item owner"
        icon={<FontAwesomeIcon icon={faExchangeAlt} className="w-5 h-5" />}
      >
        <div className="space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {}
          <div
            className="group animate-elegant-fade-up opacity-0"
            style={{ animationDelay: "50ms" }}
          >
            <div className="relative bg-gradient-to-r from-gray-50/80 to-gray-100/40 dark:from-gray-800/40 dark:to-gray-900/60 border border-gray-200/40 dark:border-gray-700/40 rounded-2xl p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-gray-500/5">
              {}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-gentle-sway">
                <FontAwesomeIcon icon={faGift} className="w-3 h-3 mr-1" />
                Available
              </div>
              <div className="flex gap-3 items-center">
                {}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200/60 to-gray-300/60 dark:from-gray-700/60 dark:to-gray-800/60 transition-transform duration-300 group-hover:scale-105">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        📷
                      </div>
                    )}
                  </div>
                </div>
                {}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                      <span className="truncate max-w-20 sm:max-w-none">
                        {item.ownerName}
                      </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="w-3 h-3"
                      />
                      <span className="truncate max-w-24 sm:max-w-none">
                        {item.location}
                      </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {}
          {error && (
            <div
              className="animate-elegant-fade-up opacity-0"
              style={{ animationDelay: "100ms" }}
            >
              <Alert
                variant={AlertVariant.ERROR}
                message={error}
                className="rounded-xl border-0 shadow-lg"
              />
            </div>
          )}
          {}
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            {}
            <div
              className="animate-elegant-fade-up opacity-0"
              style={{ animationDelay: "150ms" }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Your Message
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800"></div>
                </div>
                <div className="relative">
                  <Textarea
                    label=""
                    placeholder="Hi! I'm interested in your item. I think it would be perfect for..."
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      onMessageChange(e.target.value)
                    }
                    rows={3}
                    maxLength={500}
                    showCharCount
                    className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 focus:border-blue-400 dark:focus:border-blue-500 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm resize-none transition-all duration-200 text-sm"
                    required
                  />
                </div>
                {}
                <div className="flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/40 dark:border-blue-800/40 rounded-lg p-2.5">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
                  />
                  <span className="text-xs text-blue-800 dark:text-blue-200">
                    Personal messages boost success by 75%
                  </span>
                </div>
              </div>
            </div>
            {}
            <div
              className="animate-elegant-fade-up opacity-0"
              style={{ animationDelay: "200ms" }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Offer Something in Return
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-800"></div>
                </div>
                {}
                <button
                  type="button"
                  onClick={onToggleOfferedItem}
                  className={clsx(
                    "w-full group relative overflow-hidden rounded-xl border transition-all duration-300",
                    "hover:scale-[1.01] active:scale-[0.99]",
                    includeOfferedItem
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200/60 dark:border-purple-700/60 shadow-lg shadow-purple-500/10"
                      : "bg-white/80 dark:bg-gray-900/80 border-gray-200/60 dark:border-gray-700/60 hover:border-purple-300/60 dark:hover:border-purple-600/60 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                  )}
                >
                  <div className="flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                          includeOfferedItem
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-purple-500/20 group-hover:to-pink-500/20"
                        )}
                      >
                        <FontAwesomeIcon
                          icon={includeOfferedItem ? faMinus : faPlus}
                          className={clsx(
                            "w-3 h-3 transition-all duration-300",
                            includeOfferedItem
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                          )}
                        />
                      </div>
                      <div className="text-left">
                        <div
                          className={clsx(
                            "text-sm font-medium transition-colors duration-300",
                            includeOfferedItem
                              ? "text-purple-700 dark:text-purple-300"
                              : "text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                          )}
                        >
                          {includeOfferedItem
                            ? "Remove Offered Item"
                            : "Add Offered Item"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {includeOfferedItem
                            ? "Click to remove your offer"
                            : "Boost your chances with a trade offer"}
                        </div>
                      </div>
                    </div>
                    {}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={clsx(
                        "w-3 h-3 transition-all duration-300",
                        includeOfferedItem
                          ? "rotate-180 text-purple-600 dark:text-purple-400"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400"
                      )}
                    />
                  </div>
                  {}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                {}
                <div
                  className={clsx(
                    "relative overflow-hidden transition-all duration-500 ease-out",
                    includeOfferedItem
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  {includeOfferedItem && (
                    <div
                      className="pt-4 animate-elegant-fade-up opacity-0"
                      style={{ animationDelay: "50ms" }}
                    >
                      {}
                      <div className="relative">
                        {}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent rounded-xl blur-sm" />
                        <div className="relative bg-gradient-to-br from-purple-50/60 to-pink-50/60 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-purple-200/40 dark:border-purple-800/40 rounded-xl p-3 sm:p-4 shadow-lg shadow-purple-500/5">
                          <OfferedItemForm
                            offeredItem={offeredItem}
                            onOfferedItemChange={onOfferedItemChange}
                            isDisabled={isSubmitting}
                            className="space-y-3 sm:space-y-4"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {}
            <div
              className="animate-elegant-fade-up opacity-0 pt-4 border-t border-gray-200/40 dark:border-gray-700/40"
              style={{ animationDelay: "250ms" }}
            >
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <Button
                  type="button"
                  variant={ButtonVariant.OUTLINE}
                  size={ButtonSize.MD}
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="sm:flex-1 rounded-xl border hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.MD}
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !isFormValid}
                  className="sm:flex-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faBolt} className="w-3 h-3" />
                      Send Request
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
          {}
          <div
            className="animate-elegant-fade-up opacity-0 bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/40 dark:border-emerald-800/40 rounded-xl p-3"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="w-2.5 h-2.5 text-white"
                  />
                </div>
              </div>
              <div className="text-xs text-emerald-800 dark:text-emerald-200">
                <div className="font-medium mb-1">What happens next?</div>
                <div className="text-emerald-700 dark:text-emerald-300">
                  The owner will be notified and can accept, decline, or
                  negotiate within 24 hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
);
SwapRequestModalPresentation.displayName = "SwapRequestModalPresentation";
export const SwapRequestModal: React.FC<SwapRequestModalProps> = React.memo(
  ({ isOpen, onClose, item, onSubmit, isSubmitting = false, error = null }) => {
    const [message, setMessage] = useState("");
    const [includeOfferedItem, setIncludeOfferedItem] = useState(false);
    const [offeredItem, setOfferedItem] = useState<OfferedItem>({
      title: "",
      description: "",
      category: "" as ItemCategory,
      condition: "" as ItemCondition,
      images: [],
      location: "",
      tags: [],
    });

    // Reset state when modal opens and item is available
    React.useEffect(() => {
      if (isOpen && item) {
        setMessage("");
        setIncludeOfferedItem(false);
        setOfferedItem({
          title: "",
          description: "",
          category: "" as ItemCategory,
          condition: "" as ItemCondition,
          images: [],
          location: "",
          tags: [],
        });
      }
    }, [isOpen, item]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;
        try {
          const finalOfferedItem = includeOfferedItem ? offeredItem : undefined;
          await onSubmit(item.id, message.trim(), finalOfferedItem);
        } catch (error) {
          console.error("Failed to submit swap request:", error);
        }
      },
      [item, message, includeOfferedItem, offeredItem, onSubmit]
    );

    const handleToggleOfferedItem = useCallback(() => {
      setIncludeOfferedItem((prev) => !prev);
    }, []);

    const handleOfferedItemChange = useCallback(
      (newOfferedItem: OfferedItem) => {
        setOfferedItem(newOfferedItem);
      },
      []
    );

    // Don't render if no item is selected
    if (!item) return null;

    return (
      <SwapRequestModalPresentation
        isOpen={isOpen}
        onClose={onClose}
        item={item}
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        includeOfferedItem={includeOfferedItem}
        onToggleOfferedItem={handleToggleOfferedItem}
        offeredItem={offeredItem}
        onOfferedItemChange={handleOfferedItemChange}
      />
    );
  }
);
SwapRequestModal.displayName = "SwapRequestModal";
export default SwapRequestModal;
