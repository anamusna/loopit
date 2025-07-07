import type { ProfileSetupFormData } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useCallback, useState } from "react";
export const useProfile = () => {
  const store = useLoopItStore();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const clearProfileError = useCallback(() => {
    setProfileError(null);
  }, []);
  const setupProfile = useCallback(
    async (data: ProfileSetupFormData) => {
      console.log("Setting up profile for existing user:", data);
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (store.user) {
          console.log("Updating existing user profile with:", {
            ...store.user,
            name: data.name,
            location: data.location,
            bio: data.bio || undefined,
            avatar: data.profilePhoto || undefined,
          });
        }
        console.log("Profile setup completed successfully");
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Profile setup failed";
        setProfileError(errorMessage);
        throw error;
      } finally {
        setIsProfileLoading(false);
      }
    },
    [store.user]
  );
  const updateProfile = useCallback(
    async (data: ProfileSetupFormData) => {
      console.log("Updating profile for user:", data);
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (store.user) {
          console.log("Updating user profile with:", {
            ...store.user,
            name: data.name,
            location: data.location,
            bio: data.bio || undefined,
            avatar: data.profilePhoto || undefined,
          });
        }
        console.log("Profile updated successfully");
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Profile update failed";
        setProfileError(errorMessage);
        throw error;
      } finally {
        setIsProfileLoading(false);
      }
    },
    [store.user]
  );
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: isProfileLoading,
    error: profileError,
    clearError: clearProfileError,
    setupProfile,
    updateProfile,
  };
};
