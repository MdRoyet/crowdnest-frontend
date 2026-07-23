"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";
import {
  TrendingUp,
  Megaphone,
  Wallet,
  ArrowRight,
  Clock,
  Plus,
  Loader2,
  Target,
  Eye,
  DollarSign,
  Users,
  CheckCircle2,
  Timer,
} from "lucide-react";

interface Stats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRaised: number;
}

interface Campaign {
  _id: string;
  campaign_title: string;
  amount_raised: number;
  funding_goal: number;
  status: string;
  deadline: string;
  category: string;
}

interface Contribution {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  Supporter_name: string;
  Supporter_email: string;
  Contribution_amount: number;
  current_date: string;
  status: string;
}

export default function CreatorHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    try {
      const [s, c, contrib] = await Promise.all([
        api.get<Stats>(`/campaigns/creator/${user.email}/stats`),
        api.get<Campaign[]>(`/campaigns/creator/${user.email}`),
        api.get<Contribution[]>(`/contributions/creator/${user.email}`),
      ]);
      setStats(s);
      setCampaigns(c);
      setContributions(contrib);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const totalRaised = stats?.totalRaised ?? 0;
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "approved" && new Date(c.deadline) > new Date(),
  );
  const approvedContributions = contributions.filter((c) => c.status === "approved");
  const pendingContributions = contributions.filter((c) => c.status === "pending");
  const totalBackers = new Set(approvedContributions.map((c) => c.Supporter_email)).size;
  const totalGoal = campaigns.reduce((sum, c) => sum + c.funding_goal, 0);
  const goalPercent = totalGoal > 0 ? Math.min(Math.round((totalRaised / totalGoal) * 100), 100) : 0;

  // Recent contributions (last 5)
  const recentContributions = contributions.slice(0, 5);

  // Calculate monthly data from contributions for chart
  const monthlyData = getMonthlyData(contributions);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "Creator"} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s how your campaigns are performing today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Raised",
            value: `$${totalRaised.toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Total Backers",
            value: String(totalBackers),
            icon: Users,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Active Campaigns",
            value: String(activeCampaigns.length),
            icon: Megaphone,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Pending Contributions",
            value: String(pendingContributions.length),
            icon: Clock,
            color: "bg-purple-50 text-purple-600",
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

      {/* Chart + Goal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fundraising Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Fundraising Overview</h2>
            <p className="text-sm text-gray-500">Contribution growth over time</p>
          </div>

          {monthlyData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-gray-400">
              No contribution data yet
            </div>
          ) : (
            <div className="relative h-48">
              <div className="flex items-end gap-1.5 h-full">
                {monthlyData.map((d, i) => {
                  const max = Math.max(...monthlyData.map((x) => x.value));
                  const height = max > 0 ? (d.value / max) * 100 : 0;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className="w-full relative" style={{ height: "100%" }}>
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-300 opacity-80 transition-all duration-500 hover:opacity-100"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Funding Goal Widget */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-gray-900">Overall Goal</h2>
          <p className="mb-6 text-sm text-gray-500">Across all campaigns</p>

          {/* Circular progress */}
          <div className="relative mx-auto mb-6 h-40 w-40">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="#4F46E5" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${goalPercent * 3.14} ${314}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{goalPercent}%</span>
              <span className="text-xs text-gray-400">of goal</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Goal</span>
              <span className="text-sm font-semibold text-gray-900">
                ${totalGoal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Raised</span>
              <span className="text-sm font-semibold text-indigo-600">
                ${totalRaised.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Campaign Performance</h2>
          <Link
            href="/dashboard/creator/my-campaigns"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Goal</th>
                <th className="px-6 py-3">Raised</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Days Left</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No campaigns yet.{" "}
                    <Link href="/dashboard/creator/add-campaign" className="text-indigo-600">
                      Create your first campaign
                    </Link>
                  </td>
                </tr>
              ) : (
                campaigns.slice(0, 5).map((c) => {
                  const progress = Math.min(
                    Math.round((c.amount_raised / c.funding_goal) * 100),
                    100,
                  );
                  const daysLeft = Math.max(
                    Math.ceil(
                      (new Date(c.deadline).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24),
                    ),
                    0,
                  );
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                            {c.campaign_title[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {c.campaign_title}
                            </div>
                            <div className="text-xs text-gray-400">{c.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        ${c.funding_goal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${c.amount_raised.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500">
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {daysLeft}d
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            c.status === "funded"
                              ? "bg-emerald-50 text-emerald-700"
                              : c.status === "approved"
                                ? "bg-blue-50 text-blue-700"
                                : c.status === "pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions + Recent Contributions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Launch Campaign", icon: Plus, href: "/dashboard/creator/add-campaign", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
              { label: "My Campaigns", icon: Megaphone, href: "/dashboard/creator/my-campaigns", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
              { label: "Withdraw Funds", icon: Wallet, href: "/dashboard/creator/withdrawals", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
              { label: "Payment History", icon: DollarSign, href: "/dashboard/creator/payment-history", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
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

        {/* Recent Contributions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Contributions</h2>
            <Link
              href="/dashboard/creator/my-campaigns"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentContributions.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No contributions yet.
              </div>
            ) : (
              recentContributions.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {c.Supporter_name?.[0] || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {c.Supporter_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {c.campaign_title} • {getTimeAgo(c.current_date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      +${c.Contribution_amount.toLocaleString()}
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        c.status === "approved"
                          ? "text-emerald-600"
                          : c.status === "rejected"
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getMonthlyData(contributions: Contribution[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const data: { month: string; value: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIdx = d.getMonth();
    const monthName = months[monthIdx];
    const year = d.getFullYear();
    const month = d.getMonth();

    const value = contributions
      .filter((c) => {
        const cd = new Date(c.current_date);
        return c.status === "approved" && cd.getFullYear() === year && cd.getMonth() === month;
      })
      .reduce((sum, c) => sum + c.Contribution_amount, 0);

    data.push({ month: monthName, value });
  }

  return data;
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
