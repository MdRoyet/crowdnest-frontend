"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Flame,
  Loader2,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  deadline: string;
  funding_goal: number;
  amount_raised: number;
  category: string;
}

const categoryGradients: Record<string, string> = {
  Technology: "from-cyan-500 to-blue-600",
  "Real Estate": "from-amber-500 to-orange-600",
  "Art & Design": "from-pink-500 to-rose-600",
  "Film & Music": "from-rose-500 to-pink-600",
  Gaming: "from-violet-500 to-purple-600",
  Community: "from-emerald-500 to-teal-600",
  Education: "from-blue-500 to-indigo-600",
  Sustainability: "from-green-500 to-emerald-600",
  Health: "from-red-500 to-rose-600",
  "Food & Agriculture": "from-orange-500 to-amber-600",
};

export default function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ campaigns: Campaign[] }>("/campaigns?limit=6")
      .then((data) => {
        // Sort by amount_raised descending to get top funded
        const sorted = [...data.campaigns].sort(
          (a, b) => b.amount_raised - a.amount_raised,
        );
        setCampaigns(sorted.slice(0, 6));
      })
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const getProgress = (raised: number, goal: number) =>
    Math.min(Math.round((raised / goal) * 100), 100);

  const getDaysLeft = (deadline: string) => {
    const diff = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(diff, 0);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-500/5 blur-[120px]" />
        <div className="absolute -bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
              <Flame className="size-3.5 text-orange-400" />
              Trending now
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Top Featured{" "}
              <span className="bg-gradient-to-r from-amber-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Campaigns
              </span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/50">
              The most backed campaigns on CrowdNest right now. Jump in before
              they close.
            </p>
          </div>
          <Link
            href="/explore-campaigns"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            View All Campaigns
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Campaign grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-fuchsia-400" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c, i) => {
              const progress = getProgress(c.amount_raised, c.funding_goal);
              const daysLeft = getDaysLeft(c.deadline);
              const gradient =
                categoryGradients[c.category] || "from-fuchsia-500 to-cyan-500";
              const isTop = i === 0;

              return (
                <Link
                  key={c._id}
                  href={`/campaign-details/${c._id}`}
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20 ${
                    isTop ? "sm:col-span-2 sm:row-span-2" : ""
                  }`}
                >
                  {/* Gradient accent top bar */}
                  <div
                    className={`h-1 w-full bg-gradient-to-r ${gradient}`}
                  />

                  <div className={`p-5 ${isTop ? "p-8" : ""}`}>
                    {/* Category + rank badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold text-white`}
                      >
                        {c.category}
                      </span>
                      {isTop && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                          <Flame className="size-3" />
                          #1 Most Funded
                        </span>
                      )}
                      {!isTop && (
                        <span className="text-xs text-white/20">
                          #{i + 1}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className={`mb-2 font-bold text-white group-hover:text-fuchsia-300 transition-colors ${
                        isTop ? "text-2xl" : "text-base"
                      }`}
                    >
                      {c.campaign_title}
                    </h3>

                    <p
                      className={`mb-4 text-sm text-white/40 ${
                        isTop ? "" : "line-clamp-1"
                      }`}
                    >
                      by {c.creator_name}
                    </p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          ${c.amount_raised.toLocaleString()}
                        </span>
                        <span className="text-white/40">
                          of ${c.funding_goal.toLocaleString()}
                        </span>
                      </div>
                      <div
                        className={`h-2 overflow-hidden rounded-full bg-white/5 ${
                          isTop ? "h-3" : ""
                        }`}
                      >
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Target className="size-3" />
                        {progress}% funded
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {daysLeft}d left
                      </span>
                      {isTop && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <TrendingUp className="size-3" />
                          Trending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
