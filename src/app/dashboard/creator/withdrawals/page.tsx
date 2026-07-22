"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Loader2,
  Wallet,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
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

interface Campaign {
  amount_raised: number;
}

const paymentSystems = ["Stripe", "Bkash", "Rocket", "Nagad", "Bank Transfer"];

export default function WithdrawalsPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [credits, setCredits] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("Stripe");
  const [accountNumber, setAccountNumber] = useState("");

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    try {
      const [w, campaigns] = await Promise.all([
        api.get<Withdrawal[]>(`/withdrawals/creator/${user.email}`),
        api.get<Campaign[]>(`/campaigns/creator/${user.email}`),
      ]);
      setWithdrawals(w);
      const raised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);
      setTotalRaised(raised);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const alreadyWithdrawn = withdrawals
    .filter((w) => w.status === "pending" || w.status === "approved")
    .reduce((sum, w) => sum + w.withdrawal_credit, 0);

  const available = totalRaised - alreadyWithdrawn;
  const dollarAmount = credits ? Math.floor(parseInt(credits) / 20) : 0;
  const canWithdraw = parseInt(credits) >= 200 && parseInt(credits) <= available;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!credits || parseInt(credits) < 200) {
      setError("Minimum withdrawal is 200 credits ($10).");
      return;
    }
    if (parseInt(credits) > available) {
      setError(`Insufficient credits. Available: ${available}`);
      return;
    }
    if (!accountNumber) {
      setError("Account number is required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/withdrawals", {
        creator_email: user?.email,
        creator_name: user?.name,
        withdrawal_credit: parseInt(credits),
        payment_system: paymentSystem,
        account_number: accountNumber,
      });
      setSuccess(true);
      setCredits("");
      setAccountNumber("");
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit request.");
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
        <p className="text-sm text-gray-500">
          Withdraw your raised credits. 20 credits = $1.
        </p>
      </div>

      {/* Earnings overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Wallet className="size-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalRaised.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Raised (credits)</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="size-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {alreadyWithdrawn.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Withdrawn (credits)</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="size-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {available.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Available (credits)</div>
          <div className="mt-1 text-xs text-gray-400">
            = ${Math.floor(available / 20).toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Withdrawal form */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Withdrawal Request</h2>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="size-4" />
            Withdrawal request submitted successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        {available < 200 ? (
          <div className="py-8 text-center">
            <div className="mb-2 text-lg font-semibold text-gray-900">
              Insufficient credit
            </div>
            <p className="text-sm text-gray-500">
              You need at least 200 raised credits ($10) to withdraw.
              Currently available: {available} credits.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Credits input */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Credits to Withdraw
              </label>
              <input
                type="number"
                min="200"
                max={available}
                step="1"
                placeholder={`Min 200, Max ${available}`}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Dollar amount (auto-calculated) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Withdraw Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value={dollarAmount}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 text-sm text-gray-600"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                20 credits = $1 (platform fee)
              </p>
            </div>

            {/* Payment system */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment System
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {paymentSystems.map((ps) => (
                  <option key={ps} value={ps}>
                    {ps}
                  </option>
                ))}
              </select>
            </div>

            {/* Account number */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !canWithdraw}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Withdraw ${dollarAmount}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Withdrawal history */}
      {withdrawals.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Withdrawal History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Credits</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Account</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {w.withdrawal_credit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ${w.withdrawal_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{w.payment_system}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {w.account_number}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(w.withdraw_date).toLocaleDateString()}
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
        </div>
      )}
    </div>
  );
}
