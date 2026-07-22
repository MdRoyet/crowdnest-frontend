"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import {
  Search,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  Loader2,
  Landmark,
  Palette,
  Gamepad2,
  Heart,
  Zap,
  Leaf,
  GraduationCap,
  Film,
  Apple,
  Stethoscope,
} from "lucide-react";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  deadline: string;
  funding_goal: number;
  amount_raised: number;
  category: string;
  description: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Technology: Zap,
  "Real Estate": Landmark,
  "Art & Design": Palette,
  "Film & Music": Film,
  Gaming: Gamepad2,
  Community: Heart,
  Education: GraduationCap,
  Sustainability: Leaf,
  Health: Stethoscope,
  "Food & Agriculture": Apple,
};

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

const categories = [
  "All",
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

function ExploreCampaignsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "12");

      const data = await api.get<{
        campaigns: Campaign[];
        pages: number;
      }>(`/campaigns?${params.toString()}`);
      setCampaigns(data.campaigns);
      setTotalPages(data.pages);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const getProgress = (raised: number, goal: number) =>
    Math.min(Math.round((raised / goal) * 100), 100);

  const getDaysLeft = (deadline: string) => {
    const diff = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(diff, 0);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
            Explore{" "}
            <span className="bg-gradient-to-r from-amber-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Campaigns
            </span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/60">
            Discover projects that inspire you and help bring them to life.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  category === cat
                    ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-white"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {Icon && <Icon className="size-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-fuchsia-400" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-white/40">No campaigns found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => {
                const progress = getProgress(c.amount_raised, c.funding_goal);
                const daysLeft = getDaysLeft(c.deadline);
                const color = categoryColors[c.category] || "from-fuchsia-400 to-cyan-400";
                return (
                  <Link
                    key={c._id}
                    href={`/campaign-details/${c._id}`}
                    className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-black/20"
                  >
                    {/* Category badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${color} px-3 py-1 text-xs font-semibold text-white`}
                      >
                        {(() => {
                          const Icon = categoryIcons[c.category];
                          return Icon ? <Icon className="size-3" /> : null;
                        })()}
                        {c.category}
                      </span>
                      <span className="text-xs text-white/30">
                        by {c.creator_name}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                      {c.campaign_title}
                    </h3>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-white/50">
                          ${c.amount_raised.toLocaleString()} raised
                        </span>
                        <span className="text-white/50">
                          ${c.funding_goal.toLocaleString()} goal
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Target className="size-3" />
                          {progress}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {daysLeft}d left
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-fuchsia-400 group-hover:text-fuchsia-300">
                        View
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition-all hover:border-white/20 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="px-4 text-sm text-white/40">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition-all hover:border-white/20 hover:text-white disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExploreCampaignsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <Loader2 className="size-8 animate-spin text-fuchsia-400" />
        </div>
      }
    >
      <ExploreCampaignsContent />
    </Suspense>
  );
}
