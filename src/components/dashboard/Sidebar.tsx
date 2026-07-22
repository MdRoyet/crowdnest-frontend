"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Heart,
  Wallet,
  BarChart3,
  Users,
  MessageSquare,
  Star,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Compass,
  CreditCard,
  Clock,
} from "lucide-react";
import { useState } from "react";

const creatorLinks = [
  { href: "/dashboard/creator/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/creator/my-campaigns", label: "My Campaigns", icon: Megaphone },
  { href: "/dashboard/creator/add-campaign", label: "Create Campaign", icon: PlusCircle },
  { href: "/dashboard/creator/payment-history", label: "Donations", icon: Heart },
  { href: "/dashboard/creator/withdrawals", label: "Withdraw Funds", icon: Wallet },
];

const supporterLinks = [
  { href: "/dashboard/supporter/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/supporter/explore-campaigns", label: "Explore Campaigns", icon: Compass },
  { href: "/dashboard/supporter/my-contributions", label: "My Contributions", icon: Heart },
  { href: "/dashboard/supporter/purchase-credit", label: "Purchase Credits", icon: CreditCard },
  { href: "/dashboard/supporter/payment-history", label: "Payment History", icon: Clock },
];

const secondaryLinks = [
  { label: "Analytics", icon: BarChart3 },
  { label: "Community", icon: Users },
  { label: "Messages", icon: MessageSquare },
  { label: "Reviews", icon: Star },
  { label: "Notifications", icon: Bell },
];

const bottomLinks = [
  { label: "Settings", icon: Settings },
  { label: "Help Center", icon: HelpCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              C
            </div>
            <span className="text-lg font-bold text-gray-900">CrowdNest</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            C
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {(user?.role === "creator" ? creatorLinks : supporterLinks).map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-100" />

        {/* Secondary nav */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Tools
            </div>
          )}
          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
                title={collapsed ? link.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 px-3 py-3">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.label}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
              title={collapsed ? link.label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </button>
          );
        })}

        {/* User profile */}
        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {user?.name?.[0] || "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-gray-900">
                {user?.name}
              </div>
              <div className="truncate text-xs text-gray-400">{user?.email}</div>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
