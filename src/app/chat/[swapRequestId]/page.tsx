import ChatContainer from "@/components/chat/ChatContainer";
import Header from "@/components/Header";
import React from "react";
export async function generateStaticParams() {
  const { defaultSwapRequests } = await import("@/data/swapRequests");
  return defaultSwapRequests.map((request: { id: string }) => ({
    swapRequestId: request.id,
  }));
}
const ChatPageClient = ({ swapRequestId }: { swapRequestId: string }) => {
  return (
    <div className="min-h-screen max-h-screen bg-background flex flex-col overflow-hidden">
      <Header className="flex-shrink-0" />
      <main className="flex-1 flex flex-col min-h-0 relative">
        <ChatContainer
          swapRequestId={swapRequestId}
          className="flex-1 flex flex-col min-h-0"
          enableRealTime={true}
          updateInterval={3000}
        />
      </main>
    </div>
  );
};
export default function ChatPage({
  params,
}: {
  params: Promise<{ swapRequestId: string }>;
}) {
  const { swapRequestId } = React.use(params);
  return <ChatPageClient swapRequestId={swapRequestId} />;
}
