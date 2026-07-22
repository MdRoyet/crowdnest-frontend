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
  Pencil,
  Trash2,
  Save,
  AlertCircle,
  Target,
  Calendar,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_story: string;
  reward_info: string;
  amount_raised: number;
  funding_goal: number;
  status: string;
  deadline: string;
  category: string;
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
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [editForm, setEditForm] = useState({ campaign_title: "", campaign_story: "", reward_info: "" });
  const [saving, setSaving] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign? All approved contributions will be refunded.")) return;
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

  const startEdit = (c: Campaign) => {
    setEditing(c);
    setEditForm({
      campaign_title: c.campaign_title,
      campaign_story: c.campaign_story || "",
      reward_info: c.reward_info || "",
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.put(`/campaigns/${editing._id}`, editForm);
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === editing._id
            ? { ...c, ...editForm }
            : c,
        ),
      );
      setEditing(null);
    } catch {
      // silent
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <p className="text-sm text-gray-500">
          Manage your campaigns and review contributions.
        </p>
      </div>

      {/* Campaigns list */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Your Campaigns</h2>
        </div>
        <div className="divide-y divide-gray-50">
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
              const daysLeft = Math.max(
                Math.ceil(
                  (new Date(c.deadline).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
                ),
                0,
              );
              return (
                <div key={c._id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {c.campaign_title}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            c.status === "funded"
                              ? "bg-emerald-50 text-emerald-700"
                              : c.status === "approved"
                                ? "bg-blue-50 text-blue-700"
                                : c.status === "pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3" />
                          ${c.amount_raised.toLocaleString()} / ${c.funding_goal.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="size-3" />
                          {progress}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {daysLeft}d left
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <Pencil className="size-3.5" />
                        Update
                      </button>
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
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Contributions to review */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
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
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Campaign</h3>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={editForm.campaign_title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, campaign_title: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Campaign Story
                </label>
                <textarea
                  rows={4}
                  value={editForm.campaign_story}
                  onChange={(e) =>
                    setEditForm({ ...editForm, campaign_story: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Reward Info
                </label>
                <textarea
                  rows={3}
                  value={editForm.reward_info}
                  onChange={(e) =>
                    setEditForm({ ...editForm, reward_info: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contribution detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Contribution Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
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
