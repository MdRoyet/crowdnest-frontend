"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Rocket,
  CreditCard,
  CheckCircle2,
  Landmark,
  Palette,
  Gamepad2,
  Heart,
  Zap,
  Leaf,
  GraduationCap,
  Film,
  Music,
} from "lucide-react";

const useCases = [
  {
    title: "Real Estate",
    desc: "Pool resources to invest in premium properties and earn returns together.",
    icon: Landmark,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    meshBg: "mesh-bg-amber",
    stats: "$450K raised",
  },
  {
    title: "Tech & AI",
    desc: "Back cutting-edge technology from neural interfaces to quantum computing.",
    icon: Zap,
    color: "from-cyan-400 to-blue-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    meshBg: "mesh-bg-cyan",
    stats: "320+ campaigns",
  },
  {
    title: "Film & Music",
    desc: "Fund indie films, albums, and music festivals from visionary creators.",
    icon: Film,
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    meshBg: "mesh-bg-rose",
    stats: "$280K raised",
  },
  {
    title: "Gaming",
    desc: "Support indie game studios from pixel-art RPGs to VR experiences.",
    icon: Gamepad2,
    color: "from-violet-400 to-purple-500",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    meshBg: "mesh-bg-violet",
    stats: "180+ games funded",
  },
];

const categories = [
  { name: "Technology", icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10 hover:bg-cyan-500/20", count: 320 },
  { name: "Real Estate", icon: Landmark, color: "text-amber-400", bg: "bg-amber-500/10 hover:bg-amber-500/20", count: 85 },
  { name: "Art & Design", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10 hover:bg-pink-500/20", count: 210 },
  { name: "Film & Music", icon: Music, color: "text-rose-400", bg: "bg-rose-500/10 hover:bg-rose-500/20", count: 145 },
  { name: "Gaming", icon: Gamepad2, color: "text-violet-400", bg: "bg-violet-500/10 hover:bg-violet-500/20", count: 180 },
  { name: "Community", icon: Heart, color: "text-emerald-400", bg: "bg-emerald-500/10 hover:bg-emerald-500/20", count: 290 },
  { name: "Education", icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10 hover:bg-blue-500/20", count: 175 },
  { name: "Sustainability", icon: Leaf, color: "text-green-400", bg: "bg-green-500/10 hover:bg-green-500/20", count: 130 },
];

export default function ExtraSections() {
  const [activeUseCase, setActiveUseCase] = useState(0);

  return (
    <>
      {/* ===== Video Showcase ===== */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-500/8 blur-[150px]" />
          <div className="absolute -bottom-40 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/8 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
              <Play className="size-3.5 fill-current" />
              See it in action
            </div>
            <h2 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
              Every Idea Deserves a{" "}
              <span className="bg-gradient-to-r from-amber-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Spotlight
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              From real estate to indie games — watch how CrowdNest powers the
              next generation of funded projects.
            </p>
          </div>

          {/* Use case tabs + video */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Tabs */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              {useCases.map((uc, i) => {
                const Icon = uc.icon;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveUseCase(i)}
                    className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                      i === activeUseCase
                        ? `border-white/15 ${uc.bg} shadow-lg`
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${uc.bg}`}
                    >
                      <Icon className={`size-5 ${uc.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            i === activeUseCase ? "text-white" : "text-white/70"
                          }`}
                        >
                          {uc.title}
                        </span>
                        <span className="text-xs text-white/30">{uc.stats}</span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          i === activeUseCase ? "text-white/60" : "text-white/35"
                        }`}
                      >
                        {uc.desc}
                      </p>
                    </div>
                    {i === activeUseCase && (
                      <div className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Video player */}
            <div className="lg:col-span-3">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
                <div className={`aspect-video w-full ${useCases[activeUseCase].meshBg}`} />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                {/* Info badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${useCases[activeUseCase].bg} backdrop-blur-sm`}
                    >
                      {(() => {
                        const Icon = useCases[activeUseCase].icon;
                        return <Icon className={`size-5 ${useCases[activeUseCase].text}`} />;
                      })()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {useCases[activeUseCase].title}
                      </div>
                      <div className="text-xs text-white/50">
                        {useCases[activeUseCase].stats}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/explore-campaigns"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/15"
                  >
                    Explore
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
              <Rocket className="size-3.5" />
              Simple process
            </div>
            <h2 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-white/60">
              Three steps to bring your vision to life or support the next big
              thing.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Rocket,
                title: "Launch Your Campaign",
                desc: "Create your campaign page with a compelling story, set your funding goal, and submit for approval.",
                color: "from-fuchsia-400 to-violet-400",
                glow: "bg-fuchsia-500/10",
              },
              {
                step: "02",
                icon: CreditCard,
                title: "Rally Your Supporters",
                desc: "Share your campaign. Supporters purchase credits and back projects they believe in.",
                color: "from-amber-400 to-orange-400",
                glow: "bg-amber-500/10",
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "Get Funded & Build",
                desc: "Hit your goal, withdraw funds, and turn your idea into reality. It's that simple.",
                color: "from-emerald-400 to-teal-400",
                glow: "bg-emerald-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.glow}`}
                    >
                      <Icon
                        className={`size-6 bg-gradient-to-r ${item.color} bg-clip-text`}
                        style={{
                          color: item.step === "01" ? "#e879f9" : item.step === "02" ? "#fbbf24" : "#34d399",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-white/20 uppercase">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {item.desc}
                  </p>
                  {/* Connector line */}
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/10 to-transparent md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Explore Categories ===== */}
      <section className="relative bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
                <Palette className="size-3.5" />
                Browse categories
              </div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Explore by Category
              </h2>
            </div>
            <Link
              href="/explore-campaigns"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href="/explore-campaigns"
                  className={`group flex items-center gap-3 rounded-2xl border border-white/5 p-5 transition-all duration-300 hover:border-white/10 ${cat.bg}`}
                >
                  <Icon className={`size-5 ${cat.color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">
                      {cat.name}
                    </div>
                    <div className="text-xs text-white/40">
                      {cat.count} campaigns
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-white/50" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-fuchsia-500/20 to-transparent" />
          <div className="absolute top-0 left-2/4 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
          <div className="absolute top-0 left-3/4 h-full w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { value: "10,000+", label: "Active Users", color: "from-fuchsia-400 to-violet-400" },
            { value: "$1.2M", label: "Total Funded", color: "from-amber-400 to-orange-400" },
            { value: "2,400+", label: "Campaigns Launched", color: "from-cyan-400 to-blue-400" },
            { value: "98%", label: "Success Rate", color: "from-emerald-400 to-teal-400" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className={`mb-2 text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent sm:text-4xl`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            <Rocket className="size-3.5" />
            Ready to start?
          </div>
          <h2 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Your Idea Is One
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Campaign Away
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/60">
            Whether you&apos;re building the next big thing or supporting
            someone who is — CrowdNest is where it starts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-fuchsia-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-500/30 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/explore-campaigns"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
            >
              Browse Campaigns
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
            {["No credit card required", "Cancel anytime", "Secure payments"].map(
              (badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400/50" />
                  {badge}
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
