"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";

interface Contribution {
  _id: string;
  campaign_title: string;
  Contribution_amount: number;
  current_date: string;
  status: string;
}

export default function SupporterPaymentHistoryPage() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (!user?.email) return;
    api
      .get<Contribution[]>(`/contributions/supporter/${user.email}`)
      .then(setContributions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email]);

  const filtered = contributions.filter(
    (c) => filter === "all" || c.status === filter,
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-sm text-gray-500">View all your credit transactions.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${contributions
                  .filter((c) => c.status === "approved")
                  .reduce((s, c) => s + c.Contribution_amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${contributions
                  .filter((c) => c.status === "pending")
                  .reduce((s, c) => s + c.Contribution_amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ArrowDownRight className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${contributions
                  .filter((c) => c.status === "rejected")
                  .reduce((s, c) => s + c.Contribution_amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Refunded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-gray-400" />
        {(["all", "approved", "pending", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f
                ? "bg-indigo-50 text-indigo-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      c.status === "approved"
                        ? "bg-emerald-100 text-emerald-600"
                        : c.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {c.status === "approved" ? (
                      <ArrowUpRight className="size-4" />
                    ) : c.status === "rejected" ? (
                      <XCircle className="size-4" />
                    ) : (
                      <Clock className="size-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {c.campaign_title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(c.current_date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      c.status === "approved"
                        ? "text-gray-900"
                        : c.status === "rejected"
                          ? "text-red-600"
                          : "text-amber-600"
                    }`}
                  >
                    {c.status === "rejected" ? "+" : "-"}${c.Contribution_amount.toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      c.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : c.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {c.status === "approved" ? "spent" : c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
