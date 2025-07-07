import { Item, OfferedItem } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
export interface UseSwapRequestReturn {
  isModalOpen: boolean;
  selectedItem: Item | null;
  isSubmitting: boolean;
  error: string | null;
  openSwapRequestModal: (item: Item) => void;
  closeSwapRequestModal: () => void;
  submitSwapRequest: (
    itemId: string,
    message: string,
    offeredItem?: OfferedItem
  ) => Promise<void>;
  clearError: () => void;
}
export function useSwapRequest(): UseSwapRequestReturn {
  const router = useRouter();
  const { user, isAuthenticated, sendSwapRequest, setError } = useLoopItStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const canRequestSwap = useCallback(
    (item: Item): boolean => {
      if (!isAuthenticated || !user) return false;
      if (item.ownerId === user.id) return false; 
      if (item.status !== "available") return false; 
      return true;
    },
    [isAuthenticated, user]
  );
  const openSwapRequestModal = useCallback(
    (item: Item) => {
      if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        router.push(`/login?returnUrl=${returnUrl}`);
        return;
      }
      if (!canRequestSwap(item)) {
        setLocalError("You cannot request a swap for this item.");
        return;
      }
      setSelectedItem(item);
      setIsModalOpen(true);
      setLocalError(null);
    },
    [isAuthenticated, router, canRequestSwap]
  );
  const closeSwapRequestModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setLocalError(null);
  }, []);
  const submitSwapRequest = useCallback(
    async (itemId: string, message: string, offeredItem?: OfferedItem) => {
      if (!user || !selectedItem) {
        setLocalError("You must be logged in to send a swap request.");
        return;
      }
      if (selectedItem.ownerId === user.id) {
        setLocalError("You cannot request a swap for your own item.");
        return;
      }
      setIsSubmitting(true);
      setLocalError(null);
      try {
        await sendSwapRequest(
          {
            fromUserId: user.id,
            toUserId: selectedItem.ownerId,
            itemId: selectedItem.id,
            message: message || "",
          },
          offeredItem
        );
        closeSwapRequestModal();
        setError(
          "Swap request sent successfully! The item owner will be notified."
        );
        setTimeout(() => {
          setError(null);
        }, 3000);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to send swap request";
        setLocalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, selectedItem, sendSwapRequest, closeSwapRequestModal, setError]
  );
  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);
  return {
    isModalOpen,
    selectedItem,
    isSubmitting,
    error,
    openSwapRequestModal,
    closeSwapRequestModal,
    submitSwapRequest,
    clearError,
  };
}
