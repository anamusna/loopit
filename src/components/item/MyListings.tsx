"use client";
import { useMyListings } from "@/hooks/useItems";
import { Item, ItemStatus } from "@/shared/types";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Alert, { AlertVariant } from "@/tailwind/components/layout/Alert";
import {
  faList,
  faPlus,
  faSearch,
  faTh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import ChatList from "../chat/ChatList";
import DeleteItemModal from "./DeleteItemModal";
import { ItemManagementModal } from "./ItemManagementModal";
import MyItemCard from "./MyItemCard";
export interface MyListingsProps {
  className?: string;
}
type ViewMode = "grid" | "list";
type SectionMode = "items" | "messages";
export const MyListings: React.FC<MyListingsProps> = ({ className = "" }) => {
  const router = useRouter();
  const { unreadCount, user, getUserItems } = useLoopItStore();
  const userItems = getUserItems();
  const {
    filteredItems,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    isLoading,
    error,
    isEmpty,
    handleDeleteItem: handleDeleteItemAction,
    refreshItems,
    getStatusOptions,
    statusCounts,
  } = useMyListings({
    enableAutoRefresh: true,
    refreshInterval: 30000,
    initialItems: userItems,
  });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sectionMode, setSectionMode] = useState<SectionMode>("items");
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [isItemManagementModalOpen, setIsItemManagementModalOpen] =
    useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  const handleDeleteClick = useCallback((item: Item) => {
    setItemToDelete(item);
  }, []);
  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await handleDeleteItemAction(itemToDelete);
      setNotification({
        type: "success",
        message: `"${itemToDelete.title}" has been deleted successfully.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: `Failed to delete "${itemToDelete.title}". Please try again.`,
      });
    } finally {
      setItemToDelete(null);
    }
  }, [itemToDelete, handleDeleteItemAction]);
  const handleDeleteCancel = useCallback(() => {
    setItemToDelete(null);
  }, []);
  const handleEditClick = useCallback((item: Item) => {
    setItemToEdit(item);
    setIsItemManagementModalOpen(true);
  }, []);
  const handleItemClick = useCallback(
    (item: Item) => {
      router.push(`/item/${item.id}`);
    },
    [router]
  );
  const handleItemManagementSuccess = useCallback(
    (item: Item) => {
      const action = itemToEdit ? "updated" : "created";
      setNotification({
        type: "success",
        message: `Item "${item.title}" has been ${action} successfully.`,
      });
      setIsItemManagementModalOpen(false);
      setItemToEdit(null);
      refreshItems();
    },
    [itemToEdit, refreshItems]
  );
  const handleAddItemClick = useCallback(() => {
    setItemToEdit(null);
    setIsItemManagementModalOpen(true);
  }, []);
  if (!user) {
    return (
      <div className="text-center py-8">
        <Typography
          as={TypographyVariant.H2}
          className="text-xl font-bold mb-4"
        >
          Please log in to view your items
        </Typography>
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => router.push("/login")}
        >
          Log In
        </Button>
      </div>
    );
  }
  return (
    <div className={clsx("py-2 sm:py-4 lg:py-6", className)}>
      {}
      <div className="space-y-4 sm:space-y-6">
        {}
        {error && (
          <Alert
            variant={AlertVariant.ERROR}
            message={error}
            className="rounded-lg"
          />
        )}
        {}
        {notification && (
          <Alert
            variant={
              notification.type === "success"
                ? AlertVariant.SUCCESS
                : AlertVariant.ERROR
            }
            message={notification.message}
            onDismiss={() => setNotification(null)}
            className="rounded-lg"
          />
        )}
        {}
        {sectionMode === "items" ? (
          <div className="space-y-4 sm:space-y-6 ">
            {}
            <div className="flex  flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              {}
              <div className="flex-1 w-full ">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4"
                  />
                  <input
                    type="text"
                    placeholder="Search your items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>
              {}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | ItemStatus)
                  }
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                >
                  <option value="all">All ({statusCounts.all || 0})</option>
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} (
                      {(statusCounts as Record<string, number>)[option.value] ||
                        0}
                      )
                    </option>
                  ))}
                </select>
                {}
                <div className="hidden sm:flex bg-secondary/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={clsx(
                      "p-2 rounded transition-colors",
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <FontAwesomeIcon icon={faTh} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={clsx(
                      "p-2 rounded transition-colors",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <FontAwesomeIcon icon={faList} className="w-4 h-4" />
                  </button>
                </div>
                {}
                <Button
                  variant={ButtonVariant.PRIMARY}
                  size={ButtonSize.SM}
                  onClick={handleAddItemClick}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-4 h-4 mr-1 sm:mr-2"
                  />
                  <span className="hidden sm:inline">Add Item</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
            {}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-card rounded-xl border border-border p-3 sm:p-4 space-y-3 sm:space-y-4"
                  >
                    <div className="aspect-video bg-secondary/30 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-secondary/30 rounded w-3/4" />
                      <div className="h-3 bg-secondary/30 rounded w-1/2" />
                      <div className="h-3 bg-secondary/30 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isEmpty ? (
              <div className="text-center py-8 sm:py-12 lg:py-16">
                <div className="max-w-md mx-auto px-4">
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 opacity-30">
                    📦
                  </div>
                  <Typography
                    as={TypographyVariant.H2}
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary"
                  >
                    {searchQuery || statusFilter !== "all"
                      ? "No items match your search"
                      : "No items yet"}
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-muted mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base"
                  >
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "Start by adding your first item to begin sharing with the community."}
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {(searchQuery || statusFilter !== "all") && (
                      <Button
                        variant={ButtonVariant.OUTLINE}
                        onClick={clearFilters}
                        size={ButtonSize.SM}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      onClick={handleAddItemClick}
                      size={ButtonSize.SM}
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={clsx(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
                    : "space-y-3 sm:space-y-4"
                )}
              >
                {filteredItems.map((item) => (
                  <MyItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onItemClick={handleItemClick}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border">
              <Typography
                as={TypographyVariant.H3}
                className="text-lg font-semibold text-text-primary"
              >
                Recent Conversations
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-sm text-text-muted mt-1"
              >
                Messages from your swap requests
              </Typography>
            </div>
            <ChatList className="max-h-[600px] overflow-y-auto" />
          </div>
        )}
      </div>
      {}
      <DeleteItemModal
        isOpen={!!itemToDelete}
        item={itemToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={false}
      />
      {}
      <ItemManagementModal
        isOpen={isItemManagementModalOpen}
        onClose={() => {
          setIsItemManagementModalOpen(false);
          setItemToEdit(null);
        }}
        item={itemToEdit}
        mode={itemToEdit ? "edit" : "add"}
        onItemUpdate={handleItemManagementSuccess}
      />
    </div>
  );
};
