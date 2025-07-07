import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";
export default function ProfileSetupPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <ProfileSetupForm />
    </ProtectedRoute>
  );
}
