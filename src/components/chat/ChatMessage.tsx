"use client";
import { ChatMessage as ChatMessageType, MessageStatus } from "@/shared/types";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import {
  faCheck,
  faCheckDouble,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
export interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  isLastInGroup?: boolean;
  showTimestamp?: boolean;
  enableEncryption?: boolean;
  className?: string;
}
const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({
    message,
    isOwnMessage,
    isLastInGroup = false,
    showTimestamp = false,
    enableEncryption = false,
    className = "",
  }) => {
    const formatTime = (date: Date) => {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date));
    };
    const getStatusIcon = (status: MessageStatus) => {
      switch (status) {
        case MessageStatus.SENDING:
          return (
            <FontAwesomeIcon
              icon={faClock}
              className="w-3 h-3 text-text-muted animate-pulse"
            />
          );
        case MessageStatus.SENT:
          return (
            <FontAwesomeIcon
              icon={faCheck}
              className="w-3 h-3 text-text-muted"
            />
          );
        case MessageStatus.DELIVERED:
          return (
            <FontAwesomeIcon
              icon={faCheckDouble}
              className="w-3 h-3 text-text-muted"
            />
          );
        case MessageStatus.READ:
          return (
            <FontAwesomeIcon
              icon={faCheckDouble}
              className="w-3 h-3 text-primary"
            />
          );
        case MessageStatus.FAILED:
          return (
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-3 h-3 text-destructive"
            />
          );
        default:
          return null;
      }
    };
    return (
      <div
        className={clsx(
          "flex flex-col",
          isOwnMessage ? "items-end" : "items-start",
          className
        )}
      >
        <div
          className={clsx(
            "max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%]",
            "px-3 sm:px-4 py-2 sm:py-3 rounded-2xl",
            "break-words word-wrap",
            "transition-all duration-200 ease-out",
            "select-text",
            isOwnMessage
              ? [
                  "bg-primary text-primary-foreground rounded-br-md",
                  "shadow-sm hover:shadow-md",
                  "animate-fade-in-left",
                ]
              : [
                  "bg-card border border-border text-text-primary rounded-bl-md",
                  "shadow-sm hover:shadow-md",
                  "animate-fade-in-right",
                ],
            isLastInGroup && "mb-1 sm:mb-2"
          )}
        >
          <Typography
            as={TypographyVariant.P}
            className={clsx(
              "text-sm sm:text-base leading-relaxed",
              "whitespace-pre-wrap",
              isOwnMessage ? "text-primary-foreground" : "text-text-primary"
            )}
          >
            {message.message}
          </Typography>

          <div
            className={clsx(
              "flex items-center gap-1 sm:gap-2 mt-1",
              isOwnMessage ? "justify-end" : "justify-start"
            )}
          >
            <Typography
              as={TypographyVariant.SMALL}
              className={clsx(
                "text-xs",
                isOwnMessage ? "text-primary-foreground/70" : "text-text-muted"
              )}
            >
              {formatTime(message.timestamp)}
            </Typography>

            {isOwnMessage && (
              <div className="flex items-center">
                {getStatusIcon(message.status)}
              </div>
            )}

            {message.isEdited && (
              <Typography
                as={TypographyVariant.SMALL}
                className={clsx(
                  "text-xs italic",
                  isOwnMessage
                    ? "text-primary-foreground/70"
                    : "text-text-muted"
                )}
              >
                edited
              </Typography>
            )}
          </div>
        </div>

        {showTimestamp && (
          <Typography
            as={TypographyVariant.SMALL}
            className="text-xs text-text-muted mt-1 px-2 select-none"
          >
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(message.timestamp))}
          </Typography>
        )}
      </div>
    );
  }
);
ChatMessage.displayName = "ChatMessage";
export default ChatMessage;
