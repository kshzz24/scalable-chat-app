import { useCallback, useState } from "react";
import {
  MessageCircle,
  Users,
  Phone,
  Video,
  Send,
  Bell,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { logout } from "@/api/routes";
import SendInviteComponent from "@/pages/home/_components/SendInviteComponent";
import NotificationsModal from "@/pages/home/_components/NotificationsModal";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}
const NavItem = ({ icon: Icon, label, active = false }: NavItemProps) => {
  const location = useLocation();

  const routes: { [key: string]: string } = {
    Chat: "/chat",
    "Group Chat": "/group",
    Call: "/calls",
    "Video Call": "/video",
  };

  const route = routes[label];

  // Auto-detect active state based on current route if not explicitly provided
  const isActive = active || location.pathname === route;

  return (
    <Link
      to={route}
      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group no-underline ${
        isActive
          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-lg hover:shadow-gray-700/20"
      }`}
    >
      <Icon
        className={`w-5 h-5 transition-all duration-300 ${
          isActive ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
        }`}
      />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const HomeLayout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState<boolean>(false);

  const handleLogOut = useCallback(async () => {
    try {
      await logout(); // call backend
      clearUser(); // clear Zustand state
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  const handleSendInvite = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const handleNotification = useCallback(() => {
    setIsNotificationModalOpen(true);
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  const handleCloseNotificationModal = useCallback(() => {
    setIsNotificationModalOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Bar - Full Width */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
        {/* App Name */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Chatify
        </h1>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSendInvite}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-gray-800/50 border-gray-600 text-gray-200!  cursor-pointer hover:bg-gray-700/70 hover:border-gray-500"
          >
            <Send className="w-4 h-4" />
            Send Invite
          </Button>
          <Button
            onClick={handleNotification}
            variant="outline"
            size="sm"
            className="relative bg-gray-800/50 border-gray-600 cursor-pointer text-gray-200! hover:bg-gray-700/70 hover:border-gray-500"
          >
            <Bell className="w-4 h-4" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
              3
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={handleLogOut}
            size="sm"
            className="flex items-center gap-2 bg-gray-800/50 border-red-600/50 cursor-pointer text-red-400! hover:bg-red-900/30 hover:border-red-500"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Left Sidebar */}
      <div className="w-64 z-10 bg-gray-900/70 backdrop-blur-xl border-r border-gray-700/50 flex flex-col mt-[65px] h-full fixed">
        {/* Sidebar Navigation */}
        <div className="flex-1 p-6">
          <nav className="space-y-3">
            <NavItem icon={MessageCircle} label="Chat" />
            <NavItem icon={Users} label="Group Chat" />
            <NavItem icon={Phone} label="Call" />
            <NavItem icon={Video} label="Video Call" />
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className="absolute top-[65px] left-[256px]"
        style={{ height: "calc(100% - 65px )", width: "calc( 100% - 256px )" }}
      >
        <Outlet />
      </main>
      <SendInviteComponent
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
      />
      <NotificationsModal
        isOpen={isNotificationModalOpen}
        onClose={handleCloseNotificationModal}
      />
    </div>
  );
};

export default HomeLayout;
