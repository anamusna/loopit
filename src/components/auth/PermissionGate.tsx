"use client";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/shared/types";
import React from "react";
export interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  resource?: string;
  action?: string;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  roles?: string[];
  requireAuth?: boolean;
  requirePremium?: boolean;
  className?: string;
}
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  resource,
  action,
  fallback = null,
  loading = null,
  requireAuth = false,
  requirePremium = false,
  className = "",
}) => {
  const {
    isAuthenticated,
    checkPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    hasPremiumAccess,
    user,
  } = usePermissions();
  if (!user && requireAuth && loading) {
    return <>{loading}</>;
  }
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }
  if (requirePremium && !hasPremiumAccess()) {
    return <>{fallback}</>;
  }
  if (permission && !checkPermission(permission)) {
    return <>{fallback}</>;
  }
  if (permissions && permissions.length > 0) {
    const hasPermissions = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    if (!hasPermissions) {
      return <>{fallback}</>;
    }
  }
  if (resource && action && !canAccess(resource, action)) {
    return <>{fallback}</>;
  }
  return <div className={className}>{children}</div>;
};
export const AdminGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate
    permission={Permission.ACCESS_ADMIN_PANEL}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);
export const ModeratorGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate permission={Permission.MODERATE_CONTENT} fallback={fallback}>
    {children}
  </PermissionGate>
);
export const PremiumGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requirePremium fallback={fallback}>
    {children}
  </PermissionGate>
);
export const AuthGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}> = ({ children, fallback, loading }) => (
  <PermissionGate requireAuth fallback={fallback} loading={loading}>
    {children}
  </PermissionGate>
);
export default PermissionGate;
