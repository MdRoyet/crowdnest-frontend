"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Clock,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Filter,
  CreditCard,
  DollarSign,
} from "lucide-react";

interface Payment {
  _id: string;
  supporter_email: string;
  credits_purchased: number;
  amount_paid: number;
  payment_date: string;
  status: string;
}

export default function SupporterPaymentHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "failed" | "refunded">("all");

  useEffect(() => {
    if (!user?.email) return;
    api
      .get<Payment[]>(`/payments/supporter/${user.email}`)
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email]);

  const filtered = payments.filter(
    (p) => filter === "all" || p.status === filter,
  );

  const totalSpent = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.amount_paid, 0);

  const totalCredits = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.credits_purchased, 0);

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
        <p className="text-sm text-gray-500">View all your credit purchases.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CreditCard className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalCredits.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Credits Purchased</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock className="size-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {payments.length}
              </div>
              <div className="text-xs text-gray-500">Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-gray-400" />
        {(["all", "completed", "failed", "refunded"] as const).map((f) => (
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
            No payment records found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <ArrowUpRight className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Purchased {p.credits_purchased.toLocaleString()} credits
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(p.payment_date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ${p.amount_paid}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "refunded"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.status === "completed" ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <Clock className="size-3" />
                    )}
                    {p.status}
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
