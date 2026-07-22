"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  Loader2,
  CheckCircle2,
  Clock,
  Wallet,
  CreditCard,
  Calendar,
  User,
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

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Withdrawal[]>("/withdrawals/pending");
      setWithdrawals(data);
    } catch {
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/withdrawals/${id}/approve`, {});
      setWithdrawals((prev) => prev.filter((w) => w._id !== id));
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-sm text-gray-500">
          Process creator withdrawal requests.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {withdrawals.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No pending withdrawal requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Credits</th>
                  <th className="px-6 py-3">Amount ($)</th>
                  <th className="px-6 py-3">Payment System</th>
                  <th className="px-6 py-3">Account</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {w.creator_name?.[0] || "C"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {w.creator_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {w.creator_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {w.withdrawal_credit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ${w.withdrawal_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        <CreditCard className="size-3" />
                        {w.payment_system}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {w.account_number}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleApprove(w._id)}
                        disabled={actionLoading === w._id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {actionLoading === w._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        Payment Success
                      </button>
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
