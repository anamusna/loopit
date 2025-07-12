"use client";
import Header from "@/components/Header";
import ChatContainer from "@/components/chat/ChatContainer";
import { useLoopItStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ swapRequestId: string }>;
}

export default function Page({ params }: PageProps) {
  const [swapRequestId, setSwapRequestId] = useState<string>("");
  const router = useRouter();
  const { isAuthenticated } = useLoopItStore();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSwapRequestId(resolvedParams.swapRequestId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!swapRequestId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col min-h-0 relative">
        <ChatContainer swapRequestId={swapRequestId} className="flex-1" />
      </main>
    </div>
  );
}
