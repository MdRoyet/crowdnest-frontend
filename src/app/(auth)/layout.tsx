"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Navbar />

      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="auth-orb-1 absolute -top-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="auth-orb-2 absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="auth-orb-3 absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
