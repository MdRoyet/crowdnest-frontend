"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Megaphone,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Heart,
  MessageSquare,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  Target,
  Zap,
  Gift,
  Send,
  MoreHorizontal,
  ChevronRight,
  Loader2,
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
  campaign_title: string;
  Supporter_name: string;
  Contribution_amount: number;
  current_date: string;
  status: string;
}

// Mock chart data
const chartData = [
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 12400 },
  { month: "Mar", value: 9800 },
  { month: "Apr", value: 18500 },
  { month: "May", value: 15200 },
  { month: "Jun", value: 22100 },
  { month: "Jul", value: 19800 },
  { month: "Aug", value: 28400 },
  { month: "Sep", value: 24600 },
  { month: "Oct", value: 32100 },
  { month: "Nov", value: 28900 },
  { month: "Dec", value: 35200 },
];

const recentDonations = [
  { name: "John Smith", amount: 150, campaign: "Solar Village", time: "5 min ago", avatar: "J" },
  { name: "Emily Chen", amount: 75, campaign: "Solar Village", time: "12 min ago", avatar: "E" },
  { name: "Mike Ross", amount: 200, campaign: "Eco Bottle", time: "1 hour ago", avatar: "M" },
  { name: "Sarah Lee", amount: 50, campaign: "Community Garden", time: "2 hours ago", avatar: "S" },
  { name: "David Kim", amount: 100, campaign: "Solar Village", time: "3 hours ago", avatar: "D" },
];

const milestones = [
  { label: "Reach 75% funding", done: true },
  { label: "Reach 1,000 backers", done: false },
  { label: "Launch stretch goal", done: false },
  { label: "Send first update", done: true },
];

const messages = [
  { from: "Alex", text: "Love this project! When will the rewards ship?", unread: true },
  { from: "Priya", text: "Can you share more details on the tech specs?", unread: true },
  { from: "Jordan", text: "Just backed at the VIP tier!", unread: false },
];

const notifications = [
  { text: "New donation received: $150 from John Smith", time: "5m ago", type: "donation" },
  { text: "Campaign 'Solar Village' shared on Twitter", time: "1h ago", type: "share" },
  { text: "Milestone reached: 75% funding goal!", time: "3h ago", type: "milestone" },
  { text: "Withdrawal of $5,000 approved", time: "1d ago", type: "withdrawal" },
];

const rewardTiers = [
  { name: "Early Bird", price: 25, claimed: 180, total: 200, color: "bg-emerald-500" },
  { name: "Standard", price: 50, claimed: 320, total: 500, color: "bg-blue-500" },
  { name: "VIP", price: 150, claimed: 45, total: 100, color: "bg-purple-500" },
  { name: "Limited Edition", price: 500, claimed: 8, total: 10, color: "bg-amber-500" },
];

export default function CreatorHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [chartFilter, setChartFilter] = useState("1 Year");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    Promise.all([
      api.get<Stats>(`/campaigns/creator/${user.email}/stats`),
      api.get<Campaign[]>(`/campaigns/creator/${user.email}`),
      api.get<Contribution[]>(`/contributions/pending/${user.email}`),
    ])
      .then(([s, c, contrib]) => {
        setStats(s);
        setCampaigns(c);
        setContributions(contrib);
      })
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

  const totalRaised = stats?.totalRaised ?? 148420;
  const totalBackers = 3284;
  const goalPercent = Math.min(Math.round((totalRaised / 200000) * 100), 100);

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
            change: "+18%",
            icon: TrendingUp,
            color: "bg-indigo-50 text-indigo-600",
            trend: "up",
          },
          {
            label: "Total Backers",
            value: totalBackers.toLocaleString(),
            change: "+7%",
            icon: Users,
            color: "bg-emerald-50 text-emerald-600",
            trend: "up",
          },
          {
            label: "Active Campaigns",
            value: String(stats?.activeCampaigns ?? 4),
            change: "",
            icon: Megaphone,
            color: "bg-amber-50 text-amber-600",
            trend: "neutral",
          },
          {
            label: "Pending Withdrawals",
            value: "$12,300",
            change: "",
            icon: Wallet,
            color: "bg-purple-50 text-purple-600",
            trend: "neutral",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon className="size-5" />
                </div>
                {card.change && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    <ArrowUpRight className="size-3" />
                    {card.change}
                  </span>
                )}
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Fundraising Overview</h2>
              <p className="text-sm text-gray-500">Donation growth over time</p>
            </div>
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
              {["7 Days", "30 Days", "90 Days", "1 Year"].map((f) => (
                <button
                  key={f}
                  onClick={() => setChartFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    chartFilter === f
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Simple area chart (CSS-based) */}
          <div className="relative h-48">
            <div className="flex items-end gap-1.5 h-full">
              {chartData.map((d, i) => {
                const max = Math.max(...chartData.map((x) => x.value));
                const height = (d.value / max) * 100;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full relative" style={{ height: `${height}%` }}>
                      <div
                        className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-300 opacity-80 transition-all duration-500 hover:opacity-100"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Funding Goal Widget */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-gray-900">Funding Goal</h2>
          <p className="mb-6 text-sm text-gray-500">Overall progress across campaigns</p>

          {/* Circular progress */}
          <div className="relative mx-auto mb-6 h-40 w-40">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="50"
                fill="none" stroke="#e5e7eb" strokeWidth="10"
              />
              <circle
                cx="60" cy="60" r="50"
                fill="none" stroke="#4F46E5" strokeWidth="10"
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
              <span className="text-sm text-gray-500">Goal</span>
              <span className="text-sm font-semibold text-gray-900">$200,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Raised</span>
              <span className="text-sm font-semibold text-indigo-600">
                ${totalRaised.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Milestones */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Milestones</h3>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      m.done
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {m.done ? "✓" : ""}
                  </div>
                  <span
                    className={`text-xs ${
                      m.done ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
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
            View All <ChevronRight className="size-4" />
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
                <th className="px-6 py-3">Backers</th>
                <th className="px-6 py-3">Days Left</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.slice(0, 5).map((c) => {
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
                      {Math.floor(Math.random() * 800 + 100)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{daysLeft}d</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          c.status === "funded"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.status === "approved"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No campaigns yet.{" "}
                    <Link href="/dashboard/creator/add-campaign" className="text-indigo-600">
                      Create your first campaign
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions + Recent Donations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Launch Campaign", icon: Plus, href: "/dashboard/creator/add-campaign", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
              { label: "Post Update", icon: Send, href: "#", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
              { label: "Withdraw Funds", icon: Wallet, href: "/dashboard/creator/withdrawals", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
              { label: "Create Reward", icon: Gift, href: "#", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
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

        {/* Recent Donations */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Donations</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentDonations.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {d.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">{d.name}</div>
                  <div className="text-xs text-gray-400">
                    donated to {d.campaign}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600">
                    +${d.amount}
                  </div>
                  <div className="text-xs text-gray-400">{d.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Analytics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Avg Donation", value: "$85", icon: Target, color: "bg-indigo-50 text-indigo-600" },
            { label: "Conversion Rate", value: "3.2%", icon: Zap, color: "bg-emerald-50 text-emerald-600" },
            { label: "Visitors", value: "12.4K", icon: Eye, color: "bg-amber-50 text-amber-600" },
            { label: "Returning Backers", value: "42%", icon: Users, color: "bg-purple-50 text-purple-600" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="text-xl font-bold text-gray-900">{card.value}</div>
                <div className="mt-1 text-sm text-gray-500">{card.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward Tiers + Messages */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reward Tiers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Reward Tiers</h2>
          <div className="space-y-3">
            {rewardTiers.map((tier) => {
              const remaining = tier.total - tier.claimed;
              const percent = Math.round((tier.claimed / tier.total) * 100);
              return (
                <div key={tier.name} className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${tier.color}`} />
                      <span className="text-sm font-semibold text-gray-900">
                        {tier.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      ${tier.price}
                    </span>
                  </div>
                  <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${tier.color} transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{tier.claimed} claimed</span>
                    <span>{remaining} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages + Notifications */}
        <div className="space-y-6">
          {/* Messages */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
              <span className="flex h-5 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-bold text-white">
                2
              </span>
            </div>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl p-3 ${
                    m.unread ? "bg-indigo-50/50" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {m.from[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {m.from}
                      </span>
                      {m.unread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {m.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Notifications</h2>
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-2">
                  <div
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      n.type === "donation"
                        ? "bg-emerald-500"
                        : n.type === "milestone"
                          ? "bg-amber-500"
                          : "bg-indigo-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
