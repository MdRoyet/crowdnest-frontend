"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const categories = [
  "Technology",
  "Real Estate",
  "Art & Design",
  "Film & Music",
  "Gaming",
  "Community",
  "Education",
  "Sustainability",
  "Health",
  "Food & Agriculture",
];

export default function AddCampaignPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    campaign_image_url: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.campaign_title || !form.funding_goal || !form.deadline) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/campaigns", {
        campaign_title: form.campaign_title,
        campaign_story: form.campaign_story,
        category: form.category,
        funding_goal: parseFloat(form.funding_goal),
        minimum_contribution: parseFloat(form.minimum_contribution) || 1,
        deadline: form.deadline,
        reward_info: form.reward_info,
        campaign_image_url: form.campaign_image_url,
        creator_name: user?.name || "Unknown",
        creator_email: user?.email,
        creator_id: user?._id,
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/creator/my-campaigns"), 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create campaign.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle2 className="mb-4 size-12 text-emerald-500" />
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Campaign Created!
        </h2>
        <p className="text-sm text-gray-500">
          Redirecting to your campaigns...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/creator/home"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Campaign</h1>
        <p className="text-sm text-gray-500">
          Fill in the details to launch your campaign.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campaign Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Campaign Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Help us build a solar-powered water pump"
            value={form.campaign_title}
            onChange={(e) => update("campaign_title", e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Campaign Story */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Campaign Story
          </label>
          <textarea
            rows={5}
            placeholder="Tell people why this campaign matters and how their support will make a difference..."
            value={form.campaign_story}
            onChange={(e) => update("campaign_story", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Category + Funding Goal */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Funding Goal (credits) *
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5000"
              value={form.funding_goal}
              onChange={(e) => update("funding_goal", e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Min Contribution + Deadline */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Minimum Contribution (credits)
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5"
              value={form.minimum_contribution}
              onChange={(e) => update("minimum_contribution", e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Deadline *
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Reward Info */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Reward Info
          </label>
          <textarea
            rows={3}
            placeholder="What will supporters receive for backing your campaign? e.g. Early access, thank you card, exclusive updates..."
            value={form.reward_info}
            onChange={(e) => update("reward_info", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Campaign Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.campaign_image_url}
            onChange={(e) => update("campaign_image_url", e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating Campaign...
            </>
          ) : (
            "Create Campaign"
          )}
        </button>
      </form>
    </div>
  );
}
