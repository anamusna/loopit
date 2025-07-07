"use client";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  faFile,
  faImage,
  faPaperPlane,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
export interface FileUpload {
  id?: string;
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}
export interface MessageInputProps {
  onSendMessage: (message: string, attachments?: FileUpload[]) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  isSending?: boolean;
  enableFileUploads?: boolean;
  enableEncryption?: boolean;
  connectionStatus?: "connected" | "connecting" | "disconnected" | "error";
  placeholder?: string;
  className?: string;
}
const MessageInput: React.FC<MessageInputProps> = React.memo(
  ({
    onSendMessage,
    onTypingStart,
    onTypingStop,
    disabled = false,
    isSending = false,
    enableFileUploads = true,
    enableEncryption = false,
    connectionStatus,
    placeholder = "Type a message...",
    className = "",
  }) => {
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<FileUpload[]>([]);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const attachmentMenuRef = useRef<HTMLDivElement>(null);
    const MAX_MESSAGE_LENGTH = 1000;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const TYPING_TIMEOUT = 2000;
    const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
    ];
    const ALLOWED_IMAGE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const adjustTextareaHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = `${newHeight}px`;
      }
    }, []);
    const handleMessageChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);
        adjustTextareaHeight();
        if (!disabled) {
          if (!isTyping && value.trim()) {
            setIsTyping(true);
            onTypingStart?.();
          }
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onTypingStop?.();
          }, TYPING_TIMEOUT);
        }
      },
      [disabled, onTypingStart, onTypingStop, adjustTextareaHeight, isTyping]
    );
    const handleSendMessage = useCallback(() => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage && attachments.length === 0) return;
      if (disabled || isSending) return;
      if (isTyping) {
        setIsTyping(false);
        onTypingStop?.();
      }
      onSendMessage(
        trimmedMessage,
        attachments.length > 0 ? attachments : undefined
      );
      setMessage("");
      setAttachments([]);
      adjustTextareaHeight();
      textareaRef.current?.focus();
    }, [
      message,
      attachments,
      disabled,
      isSending,
      isTyping,
      onSendMessage,
      onTypingStop,
      adjustTextareaHeight,
    ]);
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      },
      [handleSendMessage]
    );
    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
          if (file.size > MAX_FILE_SIZE) {
            console.warn(
              `File ${file.name} is too large. Max size is ${
                MAX_FILE_SIZE / 1024 / 1024
              }MB`
            );
            return;
          }
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            console.warn(`File type ${file.type} is not allowed`);
            return;
          }
          const fileUpload: FileUpload = {
            id: `file_${Date.now()}_${Math.random()}`,
            file,
            progress: 0,
            status: "pending",
            isUploading: false,
            uploadProgress: 0,
          };
          if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setAttachments((prev) =>
                prev.map((attachment) =>
                  attachment.id === fileUpload.id
                    ? { ...attachment, preview: e.target?.result as string }
                    : attachment
                )
              );
            };
            reader.readAsDataURL(file);
          }
          setAttachments((prev) => [...prev, fileUpload]);
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setShowAttachmentMenu(false);
      },
      []
    );
    const removeAttachment = useCallback((id: string) => {
      setAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== id)
      );
    }, []);
    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);
    useEffect(() => {
      if (!disabled) {
        textareaRef.current?.focus();
      }
    }, [disabled]);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          attachmentMenuRef.current &&
          !attachmentMenuRef.current.contains(event.target as Node)
        ) {
          setShowAttachmentMenu(false);
        }
      };
      if (showAttachmentMenu) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [showAttachmentMenu]);
    const canSend =
      (message.trim() || attachments.length > 0) && !disabled && !isSending;
    return (
      <div className={clsx("bg-card border-t border-border p-4", className)}>
        {attachments.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative group bg-background border border-border rounded-lg p-2 max-w-xs"
              >
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-secondary/20 rounded flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faFile}
                      className="w-6 h-6 text-text-muted"
                    />
                  </div>
                )}
                <div className="text-xs mt-1 truncate">
                  {attachment.file.name}
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id || "")}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="relative" ref={attachmentMenuRef}>
            <Button
              variant={ButtonVariant.GHOST}
              size={ButtonSize.SM}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              disabled={disabled}
              className="p-2 rounded-full hover:bg-primary/10"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            </Button>
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[150px]">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 hover:bg-secondary/20 rounded text-left"
                >
                  <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 hover:bg-secondary/20 rounded text-left"
                >
                  <FontAwesomeIcon icon={faFile} className="w-4 h-4" />
                  <span className="text-sm">File</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              className={clsx(
                "w-full px-4 py-3 bg-background border border-border rounded-2xl",
                "resize-none text-sm leading-relaxed",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
              style={{ minHeight: "44px" }}
            />

            {message.length > MAX_MESSAGE_LENGTH * 0.8 && (
              <div className="absolute bottom-1 right-2 text-xs text-text-muted">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </div>
            )}
          </div>

          <Button
            variant={canSend ? ButtonVariant.PRIMARY : ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={handleSendMessage}
            disabled={!canSend}
            isLoading={isSending}
            className={clsx(
              "p-3 rounded-full transition-all duration-200",
              canSend
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
                : "text-text-muted"
            )}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }
);
MessageInput.displayName = "MessageInput";
export default MessageInput;
