"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChatList from "@/components/chat/ChatList";
export default function MessagesPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <main className="flex-1">
        <ChatList />
      </main>
    </ProtectedRoute>
  );
}
