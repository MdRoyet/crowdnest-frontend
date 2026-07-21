"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const supporterLinks = [
  { href: "/dashboard/supporter/home", label: "Home" },
  { href: "/dashboard/supporter/explore-campaigns", label: "Explore Campaigns" },
  { href: "/dashboard/supporter/my-contributions", label: "My Contributions" },
  { href: "/dashboard/supporter/purchase-credit", label: "Purchase Credits" },
  { href: "/dashboard/supporter/payment-history", label: "Payment History" },
];

const creatorLinks = [
  { href: "/dashboard/creator/home", label: "Home" },
  { href: "/dashboard/creator/my-campaigns", label: "My Campaigns" },
  { href: "/dashboard/creator/add-campaign", label: "Add Campaign" },
  { href: "/dashboard/creator/withdrawals", label: "Withdrawals" },
  { href: "/dashboard/creator/payment-history", label: "Payment History" },
];

const adminLinks = [
  { href: "/dashboard/admin/home", label: "Home" },
  { href: "/dashboard/admin/manage-users", label: "Manage Users" },
  { href: "/dashboard/admin/manage-campaigns", label: "Manage Campaigns" },
  { href: "/dashboard/admin/campaign-approvals", label: "Campaign Approvals" },
  { href: "/dashboard/admin/withdrawal-requests", label: "Withdrawal Requests" },
  { href: "/dashboard/admin/reports", label: "Reports" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "creator"
        ? creatorLinks
        : supporterLinks;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6 px-2">CrowdNest</h2>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded text-sm ${
              pathname === link.href
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
