"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Loader2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  DollarSign,
  Filter,
} from "lucide-react";

interface Withdrawal {
  _id: string;
  creator_email: string;
  creator_name: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string;
  withdraw_date: string;
  status: string;
}

export default function CreatorPaymentHistoryPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (!user?.email) return;
    api
      .get<Withdrawal[]>(`/withdrawals/creator/${user.email}`)
      .then(setWithdrawals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email]);

  const filtered = withdrawals.filter(
    (w) => filter === "all" || w.status === filter,
  );

  const totalApproved = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.withdrawal_amount, 0);

  const totalPending = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.withdrawal_amount, 0);

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
        <p className="text-sm text-gray-500">
          View all your withdrawal transactions.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalApproved.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Approved</div>
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
                ${totalPending.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {withdrawals.length}
              </div>
              <div className="text-xs text-gray-500">Total Transactions</div>
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

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No withdrawal records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Credits</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment System</th>
                  <th className="px-6 py-3">Account</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {w.withdrawal_credit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${w.withdrawal_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{w.payment_system}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {w.account_number}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          w.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : w.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {w.status === "approved" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
