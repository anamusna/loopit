import { Permission } from "@/shared/types";
import { useLoopItStore } from "@/store";
import { useCallback } from "react";
export const usePermissions = () => {
  const {
    user,
    userPermissions,
    permissionChecker,
    hasPermission,
    canPerformAction,
    refreshPermissions,
  } = useLoopItStore();
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(permission);
    },
    [hasPermission]
  );
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissionChecker
        ? permissionChecker.hasAnyPermission(permissions)
        : false;
    },
    [permissionChecker]
  );
  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return permissionChecker
        ? permissionChecker.hasAllPermissions(permissions)
        : false;
    },
    [permissionChecker]
  );
  const canAccess = useCallback(
    (resource: string, action: string): boolean => {
      return canPerformAction(resource, action);
    },
    [canPerformAction]
  );
  const isAuthenticated = !!user;
  const isAdmin = useCallback((): boolean => {
    console.log("isAdmin", checkPermission(Permission.ACCESS_ADMIN_PANEL));
    return checkPermission(Permission.ACCESS_ADMIN_PANEL);
  }, [checkPermission]);
  const isModerator = useCallback((): boolean => {
    return checkPermission(Permission.MODERATE_CONTENT);
  }, [checkPermission]);
  const hasPremiumAccess = useCallback((): boolean => {
    return checkPermission(Permission.ACCESS_PREMIUM_FEATURES);
  }, [checkPermission]);
  const permissions = {
    canCreateItem: () => checkPermission(Permission.CREATE_ITEM),
    canEditOwnItem: () => checkPermission(Permission.EDIT_OWN_ITEM),
    canEditAnyItem: () => checkPermission(Permission.EDIT_ANY_ITEM),
    canDeleteOwnItem: () => checkPermission(Permission.DELETE_OWN_ITEM),
    canDeleteAnyItem: () => checkPermission(Permission.DELETE_ANY_ITEM),
    canBoostItem: () => checkPermission(Permission.BOOST_ITEM),
    canSendSwapRequest: () => checkPermission(Permission.SEND_SWAP_REQUEST),
    canAcceptSwapRequest: () => checkPermission(Permission.ACCEPT_SWAP_REQUEST),
    canSendMessage: () => checkPermission(Permission.SEND_MESSAGE),
    canDeleteOwnMessage: () => checkPermission(Permission.DELETE_OWN_MESSAGE),
    canDeleteAnyMessage: () => checkPermission(Permission.DELETE_ANY_MESSAGE),
    canCreatePost: () => checkPermission(Permission.CREATE_COMMUNITY_POST),
    canEditOwnPost: () => checkPermission(Permission.EDIT_OWN_POST),
    canDeleteOwnPost: () => checkPermission(Permission.DELETE_OWN_POST),
    canDeleteAnyPost: () => checkPermission(Permission.DELETE_ANY_POST),
    canReplyToPost: () => checkPermission(Permission.REPLY_TO_POST),
    canUpvoteDownvote: () => checkPermission(Permission.UPVOTE_DOWNVOTE),
    canCreateEvent: () => checkPermission(Permission.CREATE_EVENT),
    canEditOwnEvent: () => checkPermission(Permission.EDIT_OWN_EVENT),
    canDeleteOwnEvent: () => checkPermission(Permission.DELETE_OWN_EVENT),
    canDeleteAnyEvent: () => checkPermission(Permission.DELETE_ANY_EVENT),
    canJoinEvent: () => checkPermission(Permission.JOIN_EVENT),
    canModerateContent: () => checkPermission(Permission.MODERATE_CONTENT),
    canViewReports: () => checkPermission(Permission.VIEW_REPORTS),
    canSuspendUser: () => checkPermission(Permission.SUSPEND_USER),
    canBanUser: () => checkPermission(Permission.BAN_USER),
    canAccessAdminPanel: () => checkPermission(Permission.ACCESS_ADMIN_PANEL),
    canManageSettings: () => checkPermission(Permission.MANAGE_SETTINGS),
    canViewSystemAnalytics: () =>
      checkPermission(Permission.VIEW_SYSTEM_ANALYTICS),
    canManageSubscriptions: () =>
      checkPermission(Permission.MANAGE_SUBSCRIPTIONS),
    canViewAnalytics: () => checkPermission(Permission.VIEW_ANALYTICS),
    canAccessPremiumFeatures: () =>
      checkPermission(Permission.ACCESS_PREMIUM_FEATURES),
    canBoostListings: () => checkPermission(Permission.BOOST_LISTINGS),
    canUseAdvancedSearch: () => checkPermission(Permission.ADVANCED_SEARCH),
  };
  return {
    user,
    userPermissions,
    isAuthenticated,
    isAdmin,
    isModerator,
    hasPremiumAccess,
    checkPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    permissions,
    refreshPermissions,
  };
};
export default usePermissions;
