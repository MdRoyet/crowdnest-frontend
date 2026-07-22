"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Eye,
  X,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_story: string;
  creator_name: string;
  creator_email: string;
  funding_goal: number;
  category: string;
  deadline: string;
  status: string;
  reward_info: string;
}

export default function CampaignApprovalsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Campaign | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Campaign[]>("/campaigns/pending");
      setCampaigns(data);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/campaigns/${id}/approve`, {});
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/campaigns/${id}/reject`, {});
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
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
        <h1 className="text-2xl font-bold text-gray-900">Campaign Approvals</h1>
        <p className="text-sm text-gray-500">
          Review and approve new campaign submissions.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No pending campaigns. All caught up!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Goal</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map((c) => (
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
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${c.funding_goal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(c.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(c)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <Eye className="size-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(c._id)}
                          disabled={actionLoading === c._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
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
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Campaign Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Title</div>
                <div className="mt-1 font-semibold text-gray-900">
                  {selected.campaign_title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="size-3" /> Creator
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {selected.creator_name}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <DollarSign className="size-3" /> Goal
                  </div>
                  <div className="mt-1 text-sm font-bold text-gray-900">
                    ${selected.funding_goal.toLocaleString()}
                  </div>
                </div>
              </div>

              {selected.campaign_story && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Story</div>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                    {selected.campaign_story}
                  </p>
                </div>
              )}

              {selected.reward_info && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Reward Info</div>
                  <p className="mt-1 text-sm text-gray-700">
                    {selected.reward_info}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleApprove(selected._id);
                    setSelected(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="size-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selected._id);
                    setSelected(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700"
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
