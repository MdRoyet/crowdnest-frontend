"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Loader2,
  X,
  MessageCircle,
  DollarSign,
  User,
  FileText,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  amount_raised: number;
  funding_goal: number;
  status: string;
  deadline: string;
}

interface Contribution {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  Supporter_name: string;
  Supporter_email: string;
  Contribution_amount: number;
  message: string;
  status: string;
  current_date: string;
}

export default function MyCampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Contribution | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    try {
      const [c, contrib] = await Promise.all([
        api.get<Campaign[]>(`/campaigns/creator/${user.email}`),
        api.get<Contribution[]>(`/contributions/pending/${user.email}`),
      ]);
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

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/contributions/${id}/approve`, {});
      setContributions((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/contributions/${id}/reject`, {});
      setContributions((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <p className="text-sm text-gray-500">
          Manage your campaigns and review contributions.
        </p>
      </div>

      {/* Campaigns list */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Campaigns</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {campaigns.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              No campaigns yet. Create your first campaign!
            </div>
          ) : (
            campaigns.map((c) => {
              const progress = Math.min(
                Math.round((c.amount_raised / c.funding_goal) * 100),
                100,
              );
              return (
                <div key={c._id} className="flex items-center justify-between px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">{c.campaign_title}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />
                        ${c.amount_raised.toLocaleString()} / ${c.funding_goal.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{progress}% funded</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        c.status === "funded" ? "text-emerald-600" : c.status === "approved" ? "text-blue-600" : "text-gray-400"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Contributions to review */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Contributions to Review
            {contributions.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                {contributions.length}
              </span>
            )}
          </h2>
        </div>

        {contributions.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">
            No pending contributions. All caught up!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Supporter</th>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contributions.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {c.Supporter_name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {c.Supporter_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {c.Supporter_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {c.campaign_title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                      ${c.Contribution_amount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {new Date(c.current_date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(c)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          <Eye className="size-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(c._id)}
                          disabled={actionLoading === c._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {actionLoading === c._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="size-3.5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          disabled={actionLoading === c._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading === c._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Contribution Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {selected.Supporter_name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {selected.Supporter_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selected.Supporter_email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Campaign</div>
                  <div className="mt-1 font-medium text-gray-900">
                    {selected.campaign_title}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="mt-1 font-bold text-emerald-600">
                    ${selected.Contribution_amount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Date</div>
                <div className="mt-1 text-sm text-gray-700">
                  {new Date(selected.current_date).toLocaleString()}
                </div>
              </div>

              {selected.message && (
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                    <MessageCircle className="size-3" />
                    Message
                  </div>
                  <div className="text-sm text-gray-700">
                    {selected.message}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleApprove(selected._id);
                    setSelected(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  <CheckCircle2 className="size-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selected._id);
                    setSelected(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <XCircle className="size-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
