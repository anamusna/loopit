"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { MyRequests } from "@/components/MyRequests";
export default function RequestsPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <main className="flex-1">
        <MyRequests />
      </main>
    </ProtectedRoute>
  );
}
