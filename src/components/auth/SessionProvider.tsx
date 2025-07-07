"use client";
import { useLoopItStore } from "@/store";
import { useEffect } from "react";
interface SessionProviderProps {
  children: React.ReactNode;
}
const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { restoreSession, isLoading } = useLoopItStore();
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await restoreSession();
      } catch (error) {
        console.log("No valid session found, user needs to log in");
      }
    };
    initializeSession();
  }, [restoreSession]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Loading...</h2>
          <p className="text-sm text-text-muted">Restoring your session</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
export default SessionProvider;
