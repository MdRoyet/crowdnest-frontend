"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  MessageSquare,
  Wallet,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const pageTitles: Record<string, string> = {
  home: "Dashboard",
  "my-campaigns": "My Campaigns",
  "add-campaign": "Create Campaign",
  "payment-history": "Payment History",
  withdrawals: "Withdraw Funds",
  "explore-campaigns": "Explore Campaigns",
  "my-contributions": "My Contributions",
  "purchase-credit": "Purchase Credits",
};

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const segment = pathname.split("/").pop() || "home";
  const title = pageTitles[segment] || "Dashboard";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <Bell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Messages */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <MessageSquare className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
            5
          </span>
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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
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
