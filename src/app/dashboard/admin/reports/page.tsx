"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  Calendar,
  User,
  FileText,
} from "lucide-react";

interface Report {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  reporter_name: string;
  reporter_email: string;
  reason: string;
  date: string;
  status: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Report[]>("/reports");
      setReports(data);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResolve = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/reports/${id}/resolve`, {});
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r)),
      );
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/reports/${id}/dismiss`, {});
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "dismissed" } : r)),
      );
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("This will suspend the reported campaign. Continue?")) return;
    setActionLoading(id);
    try {
      await api.delete(`/reports/${id}/suspend-campaign`);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r)),
      );
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
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">
          Review reported campaigns and take action.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No reports found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Reporter</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-4 text-amber-500" />
                        <span className="font-medium text-gray-900">
                          {r.campaign_title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{r.reporter_name}</div>
                      <div className="text-xs text-gray-400">{r.reporter_email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-gray-600 line-clamp-2">{r.reason}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700"
                            : r.status === "dismissed"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSuspend(r._id)}
                            disabled={actionLoading === r._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            <Ban className="size-3.5" />
                            Suspend
                          </button>
                          <button
                            onClick={() => handleResolve(r._id)}
                            disabled={actionLoading === r._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle2 className="size-3.5" />
                            Resolve
                          </button>
                          <button
                            onClick={() => handleDismiss(r._id)}
                            disabled={actionLoading === r._id}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <XCircle className="size-3.5" />
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Processed</span>
                      )}
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
