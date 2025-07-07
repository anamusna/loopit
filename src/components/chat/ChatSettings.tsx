"use client";
import { CHAT_CONFIG, CHAT_SOUNDS } from "@/constants/chatConfig";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Toggle from "@/tailwind/components/forms/Toggle";
import Card, { CardBody, CardHeader } from "@/tailwind/components/layout/Card";
import {
  faBell,
  faCog,
  faLock,
  faVolumeOff,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
export interface ChatSettingsData {
  soundEnabled: boolean;
  desktopNotifications: boolean;
  messagePreview: boolean;
  typingIndicators: boolean;
  readReceipts: boolean;
  encryptionEnabled: boolean;
  autoArchiveRead: boolean;
  muteAllChats: boolean;
  notificationSound: string;
}
const defaultChatSettings: ChatSettingsData = {
  soundEnabled: CHAT_CONFIG.SOUND_ENABLED_DEFAULT,
  desktopNotifications: CHAT_CONFIG.DESKTOP_NOTIFICATIONS,
  messagePreview: true,
  typingIndicators: true,
  readReceipts: true,
  encryptionEnabled: CHAT_CONFIG.ENCRYPTION_ENABLED,
  autoArchiveRead: false,
  muteAllChats: false,
  notificationSound: CHAT_SOUNDS.NEW_MESSAGE,
};
export interface ChatSettingsProps {
  className?: string;
  onClose?: () => void;
}
const ChatSettings: React.FC<ChatSettingsProps> = ({
  className = "",
  onClose,
}) => {
  const [settings, setSettings] = useLocalStorage<ChatSettingsData>(
    "CHAT_SETTINGS",
    defaultChatSettings
  );
  const [hasChanges, setHasChanges] = useState(false);
  const handleSettingChange = useCallback(
    (key: keyof ChatSettingsData, value: boolean | string) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setHasChanges(true);
    },
    [setSettings]
  );
  const handleSave = useCallback(() => {
    setHasChanges(false);
    onClose?.();
  }, [onClose]);
  const handleReset = useCallback(() => {
    setSettings(defaultChatSettings);
    setHasChanges(true);
  }, [setSettings]);
  const testNotificationSound = useCallback(() => {
    if (settings.soundEnabled) {
      const audio = new Audio(settings.notificationSound);
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.warn("Could not play notification sound:", error);
      });
    }
  }, [settings.soundEnabled, settings.notificationSound]);
  const settingsGroups = [
    {
      title: "Notifications",
      icon: faBell,
      settings: [
        {
          key: "soundEnabled" as const,
          label: "Sound Notifications",
          description: "Play sounds when messages arrive",
          type: "toggle" as const,
        },
        {
          key: "desktopNotifications" as const,
          label: "Desktop Notifications",
          description: "Show browser notifications for new messages",
          type: "toggle" as const,
        },
        {
          key: "messagePreview" as const,
          label: "Message Preview",
          description: "Show message content in notifications",
          type: "toggle" as const,
        },
        {
          key: "muteAllChats" as const,
          label: "Mute All Chats",
          description: "Disable notifications for all conversations",
          type: "toggle" as const,
        },
      ],
    },
    {
      title: "Chat Features",
      icon: faCog,
      settings: [
        {
          key: "typingIndicators" as const,
          label: "Typing Indicators",
          description: "Show when others are typing",
          type: "toggle" as const,
        },
        {
          key: "readReceipts" as const,
          label: "Read Receipts",
          description: "Let others know when you've read their messages",
          type: "toggle" as const,
        },
        {
          key: "autoArchiveRead" as const,
          label: "Auto-archive Read Chats",
          description: "Automatically archive conversations after reading",
          type: "toggle" as const,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: faLock,
      settings: [
        {
          key: "encryptionEnabled" as const,
          label: "Message Encryption",
          description: "Encrypt messages for added security (experimental)",
          type: "toggle" as const,
        },
      ],
    },
  ];
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-primary" />
          <Typography as={TypographyVariant.H3} className="font-bold">
            Chat Settings
          </Typography>
        </div>
        {onClose && (
          <Button
            variant={ButtonVariant.GHOST}
            size={ButtonSize.SM}
            onClick={onClose}
            className="p-2"
          >
            ✕
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={group.icon}
                  className="w-5 h-5 text-primary"
                />
                <Typography as={TypographyVariant.H4} className="font-semibold">
                  {group.title}
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {group.settings.map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30"
                >
                  <div className="flex-1">
                    <Typography
                      as={TypographyVariant.P}
                      className="font-medium text-text-primary"
                    >
                      {setting.label}
                    </Typography>
                    <Typography
                      as={TypographyVariant.SMALL}
                      className="text-text-muted"
                    >
                      {setting.description}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.key === "soundEnabled" && (
                      <Button
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.SM}
                        onClick={testNotificationSound}
                        disabled={!settings.soundEnabled}
                        className="p-2"
                        title="Test sound"
                      >
                        <FontAwesomeIcon
                          icon={
                            settings.soundEnabled ? faVolumeUp : faVolumeOff
                          }
                          className="w-4 h-4"
                        />
                      </Button>
                    )}
                    <Toggle
                      checked={settings[setting.key] as boolean}
                      onChange={(e) =>
                        handleSettingChange(setting.key, e.target.checked)
                      }
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      {settings.soundEnabled && (
        <Card>
          <CardHeader>
            <Typography as={TypographyVariant.H4} className="font-semibold">
              Notification Sound
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(CHAT_SOUNDS).map(([name, path]) => (
                <button
                  key={name}
                  onClick={() => handleSettingChange("notificationSound", path)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    settings.notificationSound === path
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-border-hover"
                  }`}
                >
                  <Typography
                    as={TypographyVariant.P}
                    className="font-medium capitalize"
                  >
                    {name.toLowerCase().replace("_", " ")}
                  </Typography>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant={ButtonVariant.OUTLINE}
          size={ButtonSize.LG}
          onClick={handleReset}
          className="flex-1 sm:flex-none"
        >
          Reset to Defaults
        </Button>
        <Button
          variant={ButtonVariant.PRIMARY}
          size={ButtonSize.LG}
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex-1 sm:flex-none"
        >
          {hasChanges ? "Save Changes" : "Saved"}
        </Button>
      </div>

      <Card className="bg-info/5 border-info/20">
        <CardBody>
          <Typography as={TypographyVariant.H5} className="font-semibold mb-2">
            Privacy Notice
          </Typography>
          <Typography
            as={TypographyVariant.P}
            className="text-sm text-text-muted"
          >
            Your chat settings are stored locally on your device. Message
            encryption is experimental and may not be available in all browsers.
            Desktop notifications require browser permission.
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
};
export default ChatSettings;
