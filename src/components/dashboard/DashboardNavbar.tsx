"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Search,
  Bell,
  MessageSquare,
  Wallet,
  ChevronDown,
  LogOut,
  User,
  Settings,
  CheckCircle2,
  Megaphone,
  DollarSign,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface Notification {
  _id: string;
  message: string;
  toEmail: string;
  actionRoute: string;
  time: string;
  read: boolean;
}

const pageTitles: Record<string, string> = {
  home: "Dashboard",
  "my-campaigns": "My Campaigns",
  "add-campaign": "Create Campaign",
  "payment-history": "Payment History",
  withdrawals: "Withdraw Funds",
  "explore-campaigns": "Explore Campaigns",
  "my-contributions": "My Contributions",
  "purchase-credit": "Purchase Credits",
  "manage-users": "Manage Users",
  "manage-campaigns": "Manage Campaigns",
  "campaign-approvals": "Campaign Approvals",
  "withdrawal-requests": "Withdrawal Requests",
  reports: "Reports",
};

function getNotificationIcon(message: string) {
  if (message.includes("approved") && message.includes("contribution"))
    return { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" };
  if (message.includes("rejected") && message.includes("contribution"))
    return { icon: AlertTriangle, color: "text-red-500 bg-red-50" };
  if (message.includes("campaign") && message.includes("approved"))
    return { icon: Megaphone, color: "text-blue-500 bg-blue-50" };
  if (message.includes("campaign") && message.includes("rejected"))
    return { icon: Megaphone, color: "text-red-500 bg-red-50" };
  if (message.includes("withdrawal"))
    return { icon: DollarSign, color: "text-emerald-500 bg-emerald-50" };
  if (message.includes("contribution") || message.includes("New"))
    return { icon: Bell, color: "text-indigo-500 bg-indigo-50" };
  return { icon: Bell, color: "text-gray-500 bg-gray-50" };
}

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const segment = pathname.split("/").pop() || "home";
  const title = pageTitles[segment] || "Dashboard";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await api.get<Notification[]>(
        `/notifications/${user.email}`,
      );
      setNotifications(data);
    } catch {
      // silent
    }
  }, [user?.email]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch {
      // silent
    }
  };

  const handleNotificationClick = (n: Notification) => {
    handleMarkAsRead(n._id);
    setNotifOpen(false);
    if (n.actionRoute) {
      router.push(n.actionRoute);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Left — page title */}
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-600">
          <Search className="size-4" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 md:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification popup */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 20).map((n) => {
                    const { icon: Icon, color } = getNotificationIcon(n.message);
                    const timeAgo = getTimeAgo(n.time);
                    return (
                      <button
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          !n.read ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs leading-relaxed ${
                              !n.read ? "font-medium text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {n.message}
                          </p>
                          <span className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="size-3" />
                            {timeAgo}
                          </span>
                        </div>
                        {!n.read && (
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2">
                  <button
                    onClick={() => {
                      // Mark all as read
                      notifications
                        .filter((n) => !n.read)
                        .forEach((n) => handleMarkAsRead(n._id));
                      setNotifOpen(false);
                    }}
                    className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <MessageSquare className="size-5" />
        </button>

        {/* Wallet */}
        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 sm:flex">
          <Wallet className="size-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-900">
            {user?.credits ?? 0}
          </span>
          <span className="text-xs text-gray-400">credits</span>
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {user?.name?.[0] || "U"}
            </div>
            <ChevronDown className="size-4 text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              <div className="border-b border-gray-100 px-3 py-2">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                <User className="size-4" />
                My Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                <Settings className="size-4" />
                Settings
              </button>
              <div className="my-1 h-px bg-gray-100" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
