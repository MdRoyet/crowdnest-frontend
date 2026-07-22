"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";
import {
  Heart,
  TrendingUp,
  Wallet,
  Megaphone,
  Compass,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  Gift,
  Target,
  Zap,
} from "lucide-react";

interface Contribution {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  Contribution_amount: number;
  Supporter_name: string;
  current_date: string;
  status: string;
}

const recommendedCampaigns = [
  { title: "Solar Water Pump", category: "Sustainability", raised: "$8,500", goal: "$12,000", progress: 71, color: "bg-emerald-500" },
  { title: "Indie Game Studio", category: "Gaming", raised: "$22,000", goal: "$30,000", progress: 73, color: "bg-violet-500" },
  { title: "Community Library", category: "Education", raised: "$5,200", goal: "$8,000", progress: 65, color: "bg-blue-500" },
];

export default function SupporterHomePage() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    api
      .get<Contribution[]>(`/contributions/supporter/${user.email}`)
      .then(setContributions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const totalContributed = contributions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + c.Contribution_amount, 0);
  const pendingAmount = contributions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.Contribution_amount, 0);
  const approvedCount = contributions.filter((c) => c.status === "approved").length;
  const pendingCount = contributions.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "Supporter"} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover amazing projects and support the creators you believe in.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Contributed",
            value: `$${totalContributed.toLocaleString()}`,
            icon: Heart,
            color: "bg-rose-50 text-rose-600",
          },
          {
            label: "Projects Backed",
            value: String(approvedCount),
            icon: Megaphone,
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Available Credits",
            value: `$${(user?.credits ?? 0).toLocaleString()}`,
            icon: Wallet,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Pending",
            value: `$${pendingAmount.toLocaleString()}`,
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="mt-1 text-sm text-gray-500">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Explore", icon: Compass, href: "/dashboard/supporter/explore-campaigns", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
              { label: "Buy Credits", icon: Gift, href: "/dashboard/supporter/purchase-credit", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
              { label: "My Backs", icon: Heart, href: "/dashboard/supporter/my-contributions", color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
              { label: "History", icon: Clock, href: "/dashboard/supporter/payment-history", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all ${action.color}`}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <Link
              href="/dashboard/supporter/my-contributions"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {contributions.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No activity yet.{" "}
                <Link href="/dashboard/supporter/explore-campaigns" className="text-indigo-600">
                  Explore campaigns
                </Link>
              </div>
            ) : (
              contributions.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {c.Supporter_name?.[0] || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {c.campaign_title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(c.current_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ${c.Contribution_amount.toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : c.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {c.status === "approved" ? (
                        <CheckCircle2 className="size-3" />
                      ) : c.status === "rejected" ? (
                        <XCircle className="size-3" />
                      ) : (
                        <Clock className="size-3" />
                      )}
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Campaigns */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
          <Link
            href="/dashboard/supporter/explore-campaigns"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View All
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCampaigns.map((c) => (
            <Link
              key={c.title}
              href="/dashboard/supporter/explore-campaigns"
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {c.category}
                </span>
                <Star className="size-4 text-amber-400" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900 group-hover:text-indigo-600">
                {c.title}
              </h3>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${c.color} transition-all`}
                  style={{ width: `${c.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold text-gray-900">{c.raised} raised</span>
                <span>{c.progress}% of {c.goal}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
