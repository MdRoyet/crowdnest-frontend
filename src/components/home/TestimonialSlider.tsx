"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-creative";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Creator",
    quote: "CrowdNest helped me fund my dream project in just 3 days. The community here is incredible!",
    rating: 5,
    campaign: "Solar Water Pump",
    raised: "$12,000",
  },
  {
    name: "Mike T.",
    role: "Supporter",
    quote: "The credit system makes supporting creators so easy. I love being part of someone's journey.",
    rating: 5,
    campaigns: "15 backed",
  },
  {
    name: "Emma L.",
    role: "Creator",
    quote: "A fantastic platform with a great community. My campaign exceeded its goal by 200%!",
    rating: 5,
    campaign: "Indie Film Project",
    raised: "$28,000",
  },
  {
    name: "David K.",
    role: "Supporter",
    quote: "I've discovered amazing creators here that I never would have found elsewhere. Truly special.",
    rating: 5,
    campaigns: "23 backed",
  },
  {
    name: "Priya S.",
    role: "Creator",
    quote: "From zero to fully funded in a week. CrowdNest's credit system is a game-changer for creators.",
    rating: 5,
    campaign: "Community Garden",
    raised: "$8,500",
  },
  {
    name: "James R.",
    role: "Supporter",
    quote: "I started with $10 in credits and now I've backed 12 projects. It's addictive in the best way.",
    rating: 5,
    campaigns: "12 backed",
  },
  {
    name: "Olivia W.",
    role: "Creator",
    quote: "The platform's design is beautiful and the support team is responsive. Best crowdfunding experience.",
    rating: 5,
    campaign: "VR Art Gallery",
    raised: "$15,200",
  },
  {
    name: "Carlos M.",
    role: "Supporter",
    quote: "Being able to see exactly where my credits go and track project progress is amazing transparency.",
    rating: 5,
    campaigns: "18 backed",
  },
  {
    name: "Nina P.",
    role: "Creator",
    quote: "I launched my tech startup here and raised my goal in 48 hours. The community really shows up.",
    rating: 5,
    campaign: "Smart Home Hub",
    raised: "$35,000",
  },
  {
    name: "Alex F.",
    role: "Supporter",
    quote: "CrowdNest feels personal. You're not just donating — you're investing in someone's dream. Love it.",
    rating: 5,
    campaigns: "9 backed",
  },
];

export default function TestimonialSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            <Quote className="size-3.5" />
            What people say
          </div>
          <h2 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            Users
          </h2>
          <p className="mx-auto max-w-xl text-lg text-white/60">
            Join the community of creators and supporters who are building the
            future together.
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, EffectCreative]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          effect="creative"
          creativeEffect={{
            prev: { translate: ["-20%", 0, -1], opacity: 0 },
            next: { translate: ["20%", 0, 0], opacity: 0 },
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-4"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="group rounded-3xl border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06] h-full">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-sm leading-relaxed text-white/70">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 text-sm font-bold text-white">
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
                  {t.campaigns && (
                    <div className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
                      {t.campaigns}
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
