"use client";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import React from "react";
import ChatList from "../chat/ChatList";
export const DashboardMessages: React.FC = () => {
  const router = useRouter();
  const { unreadCount } = useLoopItStore();
  const handleViewAllMessages = () => {
    router.push("/messages");
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <ChatList className="max-h-[400px] sm:max-h-[500px] overflow-y-auto" />
      </div>
    </div>
  );
};
