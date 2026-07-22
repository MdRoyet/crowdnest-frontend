"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Creator",
    quote:
      "CrowdNest helped me fund my dream project in just 3 days. The community here is incredible!",
    rating: 5,
  },
  {
    name: "Mike T.",
    role: "Supporter",
    quote:
      "The credit system makes supporting creators so easy. I love being part of someone's journey.",
    rating: 5,
  },
  {
    name: "Emma L.",
    role: "Creator",
    quote:
      "A fantastic platform with a great community. My campaign exceeded its goal by 200%!",
    rating: 5,
  },
  {
    name: "David K.",
    role: "Supporter",
    quote:
      "I've discovered amazing creators here that I never would have found elsewhere.",
    rating: 5,
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950">
      <Navbar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Left panel — testimonial + animated bg */}
          <div className="relative hidden flex-1 lg:flex">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="mesh-bg absolute inset-0" />
              <div className="mesh-overlay absolute inset-0" />
              {/* Floating particles */}
              <div className="particle particle-1" />
              <div className="particle particle-2" />
              <div className="particle particle-3" />
              <div className="particle particle-4" />
              <div className="particle particle-5" />
            </div>

            {/* Testimonial card */}
            <div className="relative z-10 flex flex-col justify-center p-10">
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Quote className="size-5 text-white" />
                  </div>
                  <span className="text-sm font-medium tracking-wide text-white/70 uppercase">
                    Trusted by creators
                  </span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-white">
                  Join 10,000+
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">
                    creators & supporters
                  </span>
                </h2>
              </div>

              {/* Rotating testimonials */}
              <div className="relative h-44">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className={`testimonial-card absolute inset-0 transition-all duration-700 ${
                      i === active
                        ? "translate-y-0 opacity-100"
                        : i < active
                          ? "-translate-y-4 opacity-0"
                          : "translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                      <div className="mb-3 flex gap-1">
                        {Array.from({ length: t.rating }).map((_, s) => (
                          <Star
                            key={s}
                            className="size-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="mb-4 text-base leading-relaxed text-white/90">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 text-sm font-bold text-white">
                          {t.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {t.name}
                          </div>
                          <div className="text-xs text-white/50">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="mt-6 flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active
                        ? "w-8 bg-gradient-to-r from-amber-400 to-fuchsia-400"
                        : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: "Campaigns Funded", value: "2,400+" },
                  { label: "Total Raised", value: "$1.2M" },
                  { label: "Happy Users", value: "10K+" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm"
                  >
                    <div className="text-lg font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full max-w-md lg:mx-0 lg:flex-shrink-0">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
