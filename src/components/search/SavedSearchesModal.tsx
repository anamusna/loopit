"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SearchFilters } from "@/shared/types";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Input from "@/tailwind/components/forms/Input";
import Modal, { ModalSize } from "@/tailwind/components/layout/Modal";
import {
  faBookmark,
  faEdit,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
  lastUsed?: Date;
}
export interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSearch: (filters: SearchFilters) => void;
}
const SavedSearchesModal: React.FC<SavedSearchesModalProps> = ({
  isOpen,
  onClose,
  onLoadSearch,
}) => {
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>(
    "SAVED_SEARCHES",
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleLoadSearch = useCallback(
    (search: SavedSearch) => {
      onLoadSearch(search.filters);
      setSavedSearches((prev) =>
        prev.map((s) =>
          s.id === search.id ? { ...s, lastUsed: new Date() } : s
        )
      );
      onClose();
    },
    [onLoadSearch, onClose, setSavedSearches]
  );
  const handleDeleteSearch = useCallback(
    (id: string) => {
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    },
    [setSavedSearches]
  );
  const handleStartEdit = useCallback((search: SavedSearch) => {
    setEditingId(search.id);
    setEditName(search.name);
    setError(null);
  }, []);
  const handleSaveEdit = useCallback(() => {
    if (!editingId || !editName.trim()) {
      setError("Please enter a name for your saved search");
      return;
    }
    setSavedSearches((prev) =>
      prev.map((s) =>
        s.id === editingId ? { ...s, name: editName.trim() } : s
      )
    );
    setEditingId(null);
    setEditName("");
    setError(null);
  }, [editingId, editName, setSavedSearches]);
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName("");
    setError(null);
  }, []);
  const formatFilters = useCallback((filters: SearchFilters) => {
    const parts: string[] = [];
    if (filters.query) parts.push(`"${filters.query}"`);
    if (filters.category) parts.push(filters.category);
    if (filters.condition) parts.push(filters.condition);
    if (filters.location) parts.push(`📍 ${filters.location}`);
    if (filters.radius) parts.push(`${filters.radius}km`);
    if (filters.priceRange) {
      parts.push(`$${filters.priceRange.min}-$${filters.priceRange.max}`);
    }
    return parts.length > 0 ? parts.join(" • ") : "All items";
  }, []);
  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={ModalSize.LG}
      title="Saved Searches"
      className="max-w-4xl mx-auto"
    >
      <div className="space-y-6">
        {}
        <div className="flex items-center justify-between">
          <div>
            <Typography
              as={TypographyVariant.H4}
              className="font-semibold text-text-primary"
            >
              Your Saved Searches
            </Typography>
            <Typography
              as={TypographyVariant.P}
              className="text-sm text-text-muted mt-1"
            >
              Quickly access your favorite search combinations
            </Typography>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
            <span>{savedSearches.length} saved</span>
          </div>
        </div>
        {}
        {savedSearches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faBookmark}
                className="w-8 h-8 text-text-muted"
              />
            </div>
            <Typography
              as={TypographyVariant.H5}
              className="font-semibold text-text-primary mb-2"
            >
              No saved searches yet
            </Typography>
            <Typography as={TypographyVariant.P} className="text-text-muted">
              Save your favorite search combinations to quickly find items later
            </Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="bg-background border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                {editingId === search.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter search name..."
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        variant={ButtonVariant.PRIMARY}
                        size={ButtonSize.SM}
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                      <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                    {error && (
                      <Typography
                        as={TypographyVariant.SMALL}
                        className="text-destructive"
                      >
                        {error}
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Typography
                          as={TypographyVariant.H5}
                          className="font-semibold text-text-primary truncate"
                        >
                          {search.name}
                        </Typography>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <FontAwesomeIcon
                            icon={faSearch}
                            className="w-3 h-3"
                          />
                          <span>
                            {search.lastUsed
                              ? `Used ${formatDate(search.lastUsed)}`
                              : `Created ${formatDate(search.createdAt)}`}
                          </span>
                        </div>
                      </div>
                      <Typography
                        as={TypographyVariant.P}
                        className="text-sm text-text-muted line-clamp-2"
                      >
                        {formatFilters(search.filters)}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant={ButtonVariant.PRIMARY}
                        size={ButtonSize.SM}
                        onClick={() => handleLoadSearch(search)}
                        className="flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faSearch} className="w-3 h-3" />
                        Search
                      </Button>
                      <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={() => handleStartEdit(search)}
                        className="flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant={ButtonVariant.DESTRUCTIVE}
                        size={ButtonSize.SM}
                        onClick={() => handleDeleteSearch(search.id)}
                        className="flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Typography as={TypographyVariant.SMALL} className="text-text-muted">
            Saved searches are stored locally in your browser
          </Typography>
          <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.LG}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default SavedSearchesModal;
