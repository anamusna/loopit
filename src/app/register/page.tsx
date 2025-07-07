import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RegisterForm from "@/components/auth/RegisterForm";
export default function RegisterPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <RegisterForm />
    </ProtectedRoute>
  );
}
