"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  Loader2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Target,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  category: string;
  funding_goal: number;
  amount_raised: number;
  status: string;
  deadline: string;
}

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected" | "funded">("all");

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all campaigns (not just approved) by getting approved + creator-specific
      // We'll use the public endpoint and note this is admin view
      const data = await api.get<{ campaigns: Campaign[] }>("/campaigns?limit=100");
      setCampaigns(data.campaigns);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the campaign and refund all approved contributors.")) return;
    setActionLoading(id);
    try {
      await api.delete(`/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = campaigns.filter(
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Campaigns</h1>
        <p className="text-sm text-gray-500">
          View and manage all campaigns on the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "approved", "pending", "rejected", "funded"] as const).map((f) => (
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

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Creator</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Goal</th>
                <th className="px-6 py-3">Raised</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const progress = Math.min(
                  Math.round((c.amount_raised / c.funding_goal) * 100),
                  100,
                );
                return (
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
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ${c.funding_goal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          c.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : c.status === "funded"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        {c.status === "approved" ? (
                          <CheckCircle2 className="size-3" />
                        ) : c.status === "pending" ? (
                          <Clock className="size-3" />
                        ) : (
                          <XCircle className="size-3" />
                        )}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id)}
                        disabled={actionLoading === c._id}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {actionLoading === c._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
