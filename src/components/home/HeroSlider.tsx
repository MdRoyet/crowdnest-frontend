"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Palette,
  Landmark,
  Gamepad2,
  Heart,
  Zap,
} from "lucide-react";

const slides = [
  {
    tag: "Real Estate",
    title: "Fund Your Dream Property",
    desc: "Pool resources with others to invest in premium real estate opportunities. Start with as little as $10.",
    cta: "Explore Properties",
    ctaLink: "/explore-campaigns?category=Real Estate",
    accent: "from-amber-400 to-orange-500",
    icon: Landmark,
    bg: "hero-bg-real-estate",
  },
  {
    tag: "Technology",
    title: "Launch Your Next Big Idea",
    desc: "From AI to hardware — get the funding you need to bring cutting-edge technology to market.",
    cta: "Explore Tech",
    ctaLink: "/explore-campaigns?category=Technology",
    accent: "from-cyan-400 to-blue-500",
    icon: Zap,
    bg: "hero-bg-tech",
  },
  {
    tag: "Creative",
    title: "Empower Creative Vision",
    desc: "Support artists, filmmakers, and musicians in bringing their boldest projects to life.",
    cta: "Explore Creative",
    ctaLink: "/explore-campaigns?category=Art & Design",
    accent: "from-fuchsia-400 to-pink-500",
    icon: Palette,
    bg: "hero-bg-creative",
  },
  {
    tag: "Community",
    title: "Build Something Together",
    desc: "From community gardens to local startups — fund the projects that matter to your neighborhood.",
    cta: "Explore Community",
    ctaLink: "/explore-campaigns?category=Community",
    accent: "from-emerald-400 to-teal-500",
    icon: Heart,
    bg: "hero-bg-community",
  },
  {
    tag: "Gaming",
    title: "Level Up Game Development",
    desc: "Back indie studios and game creators. From pixel art to AAA dreams — your support makes it happen.",
    cta: "Explore Games",
    ctaLink: "/explore-campaigns?category=Gaming",
    accent: "from-violet-400 to-purple-500",
    icon: Gamepad2,
    bg: "hero-bg-gaming",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(next, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, next]);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Animated CSS background */}
          <div className={`absolute inset-0 ${slide.bg}`} />

          {/* Top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>
      ))}

      {/* Animated mesh orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-orb absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
        <div className="hero-orb-2 absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="hero-tag mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              {(() => {
                const Icon = slides[current].icon;
                return <Icon className="size-4" />;
              })()}
              <span>{slides[current].tag}</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline */}
            <h1
              key={`title-${current}`}
              className="hero-title mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              {slides[current].title.split(" ").map((word, wi) => {
                const last =
                  wi === slides[current].title.split(" ").length - 1;
                return (
                  <span
                    key={wi}
                    className={
                      last
                        ? `bg-gradient-to-r ${slides[current].accent} bg-clip-text text-transparent`
                        : ""
                    }
                  >
                    {word}{" "}
                  </span>
                );
              })}
            </h1>

            {/* Description */}
            <p
              key={`desc-${current}`}
              className="hero-desc mb-8 max-w-lg text-lg leading-relaxed text-white/70"
            >
              {slides[current].desc}
            </p>

            {/* CTAs */}
            <div className="hero-ctas flex flex-wrap items-center gap-4">
              <Link
                href={slides[current].ctaLink}
                className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${slides[current].accent} px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95`}
              >
                {slides[current].cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
              >
                <Rocket className="size-4" />
                Start a Campaign
              </Link>
            </div>

            {/* Stats row */}
            <div className="hero-stats mt-12 flex items-center gap-8">
              {[
                { value: "10K+", label: "Active Users" },
                { value: "$1.2M", label: "Total Funded" },
                { value: "2,400+", label: "Campaigns" },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-8 bottom-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Bottom bar — dots + play/pause */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`group relative h-2 rounded-full transition-all duration-500 ${
                i === current
                  ? `w-10 bg-gradient-to-r ${s.accent}`
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}: ${s.tag}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <div className="flex gap-0.5">
              <div className="h-3 w-0.5 bg-current" />
              <div className="h-3 w-0.5 bg-current" />
            </div>
          ) : (
            <Play className="ml-0.5 size-3 fill-current" />
          )}
        </button>
      </div>
    </section>
  );
}
