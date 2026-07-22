"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Heart,
  DollarSign,
  Calendar,
  Filter,
} from "lucide-react";

interface Contribution {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  Contribution_amount: number;
  Supporter_name: string;
  creator_name: string;
  current_date: string;
  status: string;
}

export default function MyContributionsPage() {
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

  const totalContributed = contributions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + c.Contribution_amount, 0);

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
        <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>
        <p className="text-sm text-gray-500">Track all your campaign contributions.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Heart className="size-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {contributions.length}
          </div>
          <div className="text-sm text-gray-500">Total Contributions</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="size-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${totalContributed.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Contributed</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="size-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {contributions.filter((c) => c.status === "pending").length}
          </div>
          <div className="text-sm text-gray-500">Pending Approval</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-gray-400" />
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
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
            No contributions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                          {c.campaign_title[0]}
                        </div>
                        <span className="font-medium text-gray-900">
                          {c.campaign_title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.creator_name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${c.Contribution_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(c.current_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
