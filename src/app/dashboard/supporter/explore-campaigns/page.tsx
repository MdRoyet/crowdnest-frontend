"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Search,
  ArrowRight,
  Clock,
  Target,
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

export default function SupporterExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
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
      const data = await api.get<{ campaigns: Campaign[]; pages: number }>(
        `/campaigns?${params.toString()}`,
      );
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Campaigns</h1>
        <p className="text-sm text-gray-500">Discover projects that inspire you.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  category === cat
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {Icon && <Icon className="size-3" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-indigo-500" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No campaigns found.</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const progress = getProgress(c.amount_raised, c.funding_goal);
              const daysLeft = getDaysLeft(c.deadline);
              const color = categoryColors[c.category] || "from-fuchsia-400 to-cyan-400";
              return (
                <Link
                  key={c._id}
                  href={`/campaign-details/${c._id}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${color} px-2.5 py-0.5 text-[10px] font-semibold text-white`}>
                      {(() => {
                        const Icon = categoryIcons[c.category];
                        return Icon ? <Icon className="size-2.5" /> : null;
                      })()}
                      {c.category}
                    </span>
                    <span className="text-[11px] text-gray-400">by {c.creator_name}</span>
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900 group-hover:text-indigo-600">
                    {c.campaign_title}
                  </h3>
                  <div className="mb-2">
                    <div className="mb-1 flex justify-between text-[11px] text-gray-400">
                      <span>${c.amount_raised.toLocaleString()} raised</span>
                      <span>${c.funding_goal.toLocaleString()} goal</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Target className="size-3" />{progress}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />{daysLeft}d left
                    </span>
                    <span className="flex items-center gap-0.5 text-indigo-600 font-medium">
                      View <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-30"
              >
                Previous
              </button>
              <span className="px-3 text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
