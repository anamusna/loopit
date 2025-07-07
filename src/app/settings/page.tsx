import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileEdit from "@/components/profile/ProfileEdit";
export default function SettingsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto py-6 sm:py-8 lg:py-12">
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4">
                  Settings
                </h1>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto sm:mx-0">
                  Manage your account settings and profile information
                </p>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-8">
              <ProfileEdit />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
