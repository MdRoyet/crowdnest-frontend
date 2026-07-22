"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Clock,
  Target,
  TrendingUp,
  User,
  Mail,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  creator_email: string;
  deadline: string;
  funding_goal: number;
  amount_raised: number;
  description: string;
  category: string;
  status: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  Technology: "from-cyan-400 to-blue-500",
  "Real Estate": "from-amber-400 to-orange-500",
  "Art & Design": "from-pink-400 to-rose-500",
  "Film & Music": "from-rose-400 to-pink-500",
  Gaming: "from-violet-400 to-purple-500",
  Community: "from-emerald-400 to-teal-500",
  Education: "from-blue-400 to-indigo-500",
  Sustainability: "from-green-400 to-emerald-500",
  Health: "from-red-400 to-rose-500",
  "Food & Agriculture": "from-orange-400 to-amber-500",
};

export default function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Campaign>(`/campaigns/${id}`)
      .then(setCampaign)
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError("Please enter a valid contribution amount.");
      return;
    }

    if (!user) {
      setError("Please log in to contribute.");
      return;
    }

    if (!campaign) return;

    setSubmitting(true);
    try {
      await api.post("/contributions", {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        Contribution_amount: num,
        Supporter_email: user.email,
        Supporter_name: user.name,
        creator_name: campaign.creator_name,
        creator_email: campaign.creator_email,
      });

      // Update local state
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              amount_raised: prev.amount_raised + num,
            }
          : prev,
      );
      setSuccess(true);
      setAmount("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to submit contribution.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="size-8 animate-spin text-fuchsia-400" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            Campaign not found
          </h2>
          <Link
            href="/explore-campaigns"
            className="text-sm text-fuchsia-400 hover:text-fuchsia-300"
          >
            Back to explore
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(
    Math.round((campaign.amount_raised / campaign.funding_goal) * 100),
    100,
  );
  const daysLeft = Math.max(
    Math.ceil(
      (new Date(campaign.deadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
    0,
  );
  const color = categoryColors[campaign.category] || "from-fuchsia-400 to-cyan-400";

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/explore-campaigns"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="size-4" />
            Back to campaigns
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span
                className={`mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${color} px-3 py-1 text-xs font-semibold text-white`}
              >
                {campaign.category}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                {campaign.campaign_title}
              </h1>
              <p className="mt-2 text-sm text-white/40">
                by {campaign.creator_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left — campaign info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white">
                    ${campaign.amount_raised.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/40">
                    raised of ${campaign.funding_goal.toLocaleString()} goal
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {progress}%
                  </div>
                  <div className="text-sm text-white/40">funded</div>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                {
                  icon: Target,
                  label: "Funding Goal",
                  value: `$${campaign.funding_goal.toLocaleString()}`,
                },
                {
                  icon: TrendingUp,
                  label: "Raised",
                  value: `$${campaign.amount_raised.toLocaleString()}`,
                },
                {
                  icon: Clock,
                  label: "Days Left",
                  value: String(daysLeft),
                },
                {
                  icon: Calendar,
                  label: "Deadline",
                  value: new Date(campaign.deadline).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  ),
                },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <Icon className="mb-2 size-4 text-white/30" />
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-xs text-white/40">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                About this campaign
              </h2>
              <p className="leading-relaxed text-white/60">
                {campaign.description ||
                  "This creator hasn't added a detailed description yet."}
              </p>
            </div>

            {/* Creator info */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                Creator
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 text-lg font-bold text-white">
                  {campaign.creator_name[0]}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {campaign.creator_name}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/40">
                    <Mail className="size-3" />
                    {campaign.creator_email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — contribution form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h2 className="mb-2 text-lg font-bold text-white">
                Support this campaign
              </h2>
              <p className="mb-6 text-sm text-white/40">
                Every contribution helps bring this project closer to its goal.
              </p>

              {success && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  Thank you for your contribution!
                </div>
              )}

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="size-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-white/60">
                    Contribution Amount ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="10.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-white placeholder-white/20 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20"
                    />
                  </div>
                </div>

                {/* Quick amounts */}
                <div className="flex gap-2">
                  {[5, 10, 25, 50, 100].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                        amount === String(v)
                          ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-300"
                          : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                      }`}
                    >
                      ${v}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !user}
                  className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-fuchsia-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-all hover:shadow-xl hover:shadow-fuchsia-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Processing...
                      </>
                    ) : !user ? (
                      "Log in to contribute"
                    ) : (
                      "Contribute Now"
                    )}
                  </span>
                </button>

                {!user && (
                  <p className="text-center text-xs text-white/30">
                    <Link
                      href="/login"
                      className="text-fuchsia-400 hover:text-fuchsia-300"
                    >
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/register"
                      className="text-fuchsia-400 hover:text-fuchsia-300"
                    >
                      create an account
                    </Link>{" "}
                    to support this campaign.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
