"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { usePermissions } from "@/hooks/usePermissions";
import { useLoopItStore } from "@/store";
import Button, {
  ButtonSize,
  ButtonVariant,
} from "@/tailwind/components/elements/Button";
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "@/tailwind/components/elements/LoadingSpinner";
import {
  Typography,
  TypographyVariant,
} from "@/tailwind/components/elements/Typography";
import Card, { CardBody } from "@/tailwind/components/layout/Card";
import {
  faCalendarAlt,
  faChartBar,
  faChartLine,
  faCog,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
interface ActionCard {
  title: string;
  description: string;
  icon: any;
  color: string;
  onClick: () => void;
}
const AdminDashboardContent = () => {
  const router = useRouter();
  const { permissions, isAdmin } = usePermissions();
  const {
    user,
    metrics,
    pendingItems,
    recentUsers,
    adminLoading,
    loadAdminDashboard,
    handleItemAction,
    handleUserAction,
  } = useLoopItStore();
  useEffect(() => {
    loadAdminDashboard();
  }, [loadAdminDashboard]);
  const actionCards: ActionCard[] = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: faUserShield,
      color: "from-blue-500 to-blue-600",
      onClick: () => router.push("/admin/users"),
    },
    {
      title: "Analytics",
      description: "View detailed platform analytics",
      icon: faChartBar,
      color: "from-purple-500 to-purple-600",
      onClick: () => router.push("/admin/analytics"),
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: faCog,
      color: "from-green-500 to-green-600",
      onClick: () => router.push("/admin/settings"),
    },
    {
      title: "Event Management",
      description: "Manage community events",
      icon: faCalendarAlt,
      color: "from-amber-500 to-amber-600",
      onClick: () => router.push("/admin/events"),
    },
  ];
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={LoadingSpinnerSize.XL} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="bg-card/90 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Typography
                as={TypographyVariant.H1}
                className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3"
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="h-6 w-6 text-primary"
                />
                Admin Dashboard
              </Typography>
              <Typography
                as={TypographyVariant.P}
                className="text-text-secondary mt-1"
              >
                Welcome back, {user?.name}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={() => router.push("/admin/settings")}
              >
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card
              key={metric.label}
              className="bg-card/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <CardBody className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-text-secondary text-sm"
                    >
                      {metric.label}
                    </Typography>
                    <Typography
                      as={TypographyVariant.H3}
                      className="text-2xl font-bold text-text-primary mt-1"
                    >
                      {metric.value}
                    </Typography>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}
                  >
                    <FontAwesomeIcon
                      icon={metric.icon}
                      className={`h-5 w-5 ${metric.color}`}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span
                    className={
                      metric.change >= 0 ? "text-success" : "text-destructive"
                    }
                  >
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                  <span className="text-text-secondary">vs last week</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionCards.map((card, index) => (
            <button
              key={index}
              onClick={card.onClick}
              className="group text-left"
            >
              <Card className="h-full bg-card/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-primary/20">
                <CardBody className="p-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={card.icon}
                      className="h-6 w-6 text-white"
                    />
                  </div>
                  <Typography
                    as={TypographyVariant.H3}
                    className="text-lg font-semibold text-text-primary"
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    as={TypographyVariant.P}
                    className="text-text-secondary text-sm mt-1"
                  >
                    {card.description}
                  </Typography>
                </CardBody>
              </Card>
            </button>
          ))}
        </div>

        <Card className="bg-card/90 backdrop-blur-md">
          <CardBody className="p-4">
            <Typography
              as={TypographyVariant.H2}
              className="text-xl font-semibold text-text-primary mb-4"
            >
              Pending Items
            </Typography>
            <div className="space-y-3">
              {pendingItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                >
                  <div>
                    <Typography
                      as={TypographyVariant.P}
                      className="font-medium text-text-primary"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-sm text-text-secondary"
                    >
                      Status: {item.status}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={ButtonVariant.SUCCESS}
                      size={ButtonSize.XS}
                      onClick={() => handleItemAction(item.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant={ButtonVariant.DESTRUCTIVE}
                      size={ButtonSize.XS}
                      onClick={() => handleItemAction(item.id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="bg-card/90 backdrop-blur-md">
          <CardBody className="p-4">
            <Typography
              as={TypographyVariant.H2}
              className="text-xl font-semibold text-text-primary mb-4"
            >
              Recent Users
            </Typography>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                >
                  <div>
                    <Typography
                      as={TypographyVariant.P}
                      className="font-medium text-text-primary"
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      as={TypographyVariant.P}
                      className="text-sm text-text-secondary"
                    >
                      {user.email}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={ButtonVariant.WARNING}
                      size={ButtonSize.XS}
                      onClick={() => handleUserAction(user.id, "warn")}
                    >
                      Warn
                    </Button>
                    <Button
                      variant={ButtonVariant.DESTRUCTIVE}
                      size={ButtonSize.XS}
                      onClick={() => handleUserAction(user.id, "suspend")}
                    >
                      Suspend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
const AdminDashboard = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};
export default AdminDashboard;
