"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Users,
  Megaphone,
  Wallet,
  DollarSign,
  TrendingUp,
  Loader2,
  BarChart3,
} from "lucide-react";

interface AdminStats {
  totalSupporters: number;
  totalCreators: number;
  totalAdmins: number;
  totalUsers: number;
  totalCredits: number;
}

interface PaymentStats {
  totalPayments: number;
  totalRevenue: number;
}

export default function AdminHomePage() {
  const [userStats, setUserStats] = useState<AdminStats | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<AdminStats>("/users/stats"),
      api.get<PaymentStats>("/payments/stats"),
    ])
      .then(([u, p]) => {
        setUserStats(u);
        setPaymentStats(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Platform overview and management.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: userStats?.totalUsers ?? 0,
            icon: Users,
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Supporters",
            value: userStats?.totalSupporters ?? 0,
            icon: Users,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Creators",
            value: userStats?.totalCreators ?? 0,
            icon: Megaphone,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Total Credits in Circulation",
            value: (userStats?.totalCredits ?? 0).toLocaleString(),
            icon: Wallet,
            color: "bg-purple-50 text-purple-600",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
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

      {/* Payment stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${paymentStats?.totalRevenue?.toLocaleString() ?? 0}
              </div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {paymentStats?.totalPayments ?? 0}
              </div>
              <div className="text-sm text-gray-500">Payments Processed</div>
            </div>
          </div>
        </div>
      </div>

      {/* User breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">User Breakdown</h2>
        <div className="space-y-4">
          {[
            { label: "Supporters", count: userStats?.totalSupporters ?? 0, total: userStats?.totalUsers ?? 1, color: "bg-emerald-500" },
            { label: "Creators", count: userStats?.totalCreators ?? 0, total: userStats?.totalUsers ?? 1, color: "bg-indigo-500" },
            { label: "Admins", count: userStats?.totalAdmins ?? 0, total: userStats?.totalUsers ?? 1, color: "bg-amber-500" },
          ].map((item) => {
            const percent = Math.round((item.count / item.total) * 100);
            return (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-500">
                    {item.count} ({percent}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
