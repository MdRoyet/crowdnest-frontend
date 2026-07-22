"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Creator",
    quote: "CrowdNest helped me fund my dream project in just 3 days. The community here is incredible!",
    rating: 5,
    raised: "$12,000",
  },
  {
    name: "Mike T.",
    role: "Supporter",
    quote: "The credit system makes supporting creators so easy. I love being part of someone's journey.",
    rating: 5,
    backed: "15 backed",
  },
  {
    name: "Emma L.",
    role: "Creator",
    quote: "A fantastic platform with a great community. My campaign exceeded its goal by 200%!",
    rating: 5,
    raised: "$28,000",
  },
  {
    name: "David K.",
    role: "Supporter",
    quote: "I've discovered amazing creators here that I never would have found elsewhere. Truly special.",
    rating: 5,
    backed: "23 backed",
  },
  {
    name: "Priya S.",
    role: "Creator",
    quote: "From zero to fully funded in a week. CrowdNest's credit system is a game-changer for creators.",
    rating: 5,
    raised: "$8,500",
  },
  {
    name: "James R.",
    role: "Supporter",
    quote: "I started with $10 in credits and now I've backed 12 projects. It's addictive in the best way.",
    rating: 5,
    backed: "12 backed",
  },
  {
    name: "Olivia W.",
    role: "Creator",
    quote: "The platform's design is beautiful and the support team is responsive. Best crowdfunding experience.",
    rating: 5,
    raised: "$15,200",
  },
  {
    name: "Carlos M.",
    role: "Supporter",
    quote: "Being able to see exactly where my credits go and track project progress is amazing transparency.",
    rating: 5,
    backed: "18 backed",
  },
  {
    name: "Nina P.",
    role: "Creator",
    quote: "I launched my tech startup here and raised my goal in 48 hours. The community really shows up.",
    rating: 5,
    raised: "$35,000",
  },
];

const CARDS_PER_VIEW = 3;
const AUTOPLAY_MS = 4000;

export default function TestimonialSlider() {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(testimonials.length - CARDS_PER_VIEW, 0);

  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mounted, next]);

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTOPLAY_MS);
  };

  const handleNext = () => {
    next();
    resetAutoplay();
  };

  const handlePrev = () => {
    prev();
    resetAutoplay();
  };

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 h-[350px] w-[350px] rounded-full bg-fuchsia-500/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
              <Quote className="size-3.5" />
              What people say
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Loved by{" "}
              <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
                10,000+
              </span>{" "}
              Users
            </h2>
            <p className="mt-2 max-w-lg text-base text-white/50">
              Join the community of creators and supporters who are building the
              future together.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
              aria-label="Next reviews"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Slider — overflow hidden, 3 cards visible */}
        <div className="overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${index * (100 / CARDS_PER_VIEW + 1.5)}%)`,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-[calc(33.333%-14px)] shrink-0"
              >
                <div className="group flex h-full flex-col rounded-3xl border border-white/5 bg-white/[0.03] p-7 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06]">
                  {/* Quote icon + stars */}
                  <div className="mb-5 flex items-center justify-between">
                    <Quote className="size-6 text-white/10" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star
                          key={s}
                          className="size-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="mb-6 flex-1 text-[15px] leading-relaxed text-white/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 text-sm font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-white/40">{t.role}</div>
                    </div>
                    {t.raised && (
                      <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        {t.raised}
                      </div>
                    )}
                    {t.backed && (
                      <div className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
                        {t.backed}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                resetAutoplay();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-gradient-to-r from-amber-400 to-fuchsia-400"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
