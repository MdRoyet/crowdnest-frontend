"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const GITHUB_REPO = "https://github.com/MdRoyet/crowdnest-frontend";

function NestLogo() {
  return (
    <svg
      viewBox="0 0 180 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="nestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="birdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* Nest bowl */}
      <path
        d="M6 24c0 0 4-8 14-8s14 8 14 8"
        stroke="url(#nestGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Nest twigs */}
      <path
        d="M8 26c2-1 5-1 8 0s6 1 8 0s5-1 7 0"
        stroke="url(#nestGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Bird silhouette */}
      <circle cx="17" cy="16" r="3" fill="url(#birdGrad)" />
      <path
        d="M14 15c-2-2 0-5 3-4"
        stroke="url(#birdGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Text */}
      <text
        x="42"
        y="25"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="url(#logoGrad)"
      >
        Crowd
      </text>
      <text
        x="107"
        y="25"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="url(#birdGrad)"
      >
        Nest
      </text>
      {/* Accent dots */}
      <circle cx="168" cy="10" r="2" fill="#e879f9" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="174" cy="14" r="1.5" fill="#22d3ee" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardHref = user
    ? `/dashboard/${user.role === "admin" ? "admin" : user.role === "creator" ? "creator" : "supporter"}/home`
    : "/dashboard/supporter/home";

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isAuthPage
          ? scrolled
            ? "bg-slate-950/80 shadow-lg shadow-black/20 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent backdrop-blur-sm border-b border-transparent"
          : scrolled
            ? "bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl border-b border-white/20"
            : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <NestLogo />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Link href="/explore-campaigns">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full ${
                isAuthPage
                  ? "text-slate-300 hover:text-violet-400 hover:bg-white/10"
                  : "text-slate-600 hover:text-violet-600 hover:bg-violet-50"
              }`}
            >
              Explore Campaigns
            </Button>
          </Link>

          {hydrated && user ? (
            <>
              <Link href={dashboardHref}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${
                    isAuthPage
                      ? "text-slate-300 hover:text-fuchsia-400 hover:bg-white/10"
                      : "text-slate-600 hover:text-fuchsia-600 hover:bg-fuchsia-50"
                  }`}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Button>
              </Link>

              {/* Credits pill */}
              <span
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isAuthPage
                    ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                    : "border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 text-cyan-700"
                }`}
              >
                <span className={`inline-block size-1.5 animate-pulse rounded-full ${isAuthPage ? "bg-cyan-400" : "bg-cyan-400"}`} />
                {user.credits} Credits
              </span>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="ml-1 rounded-full p-0.5 ring-2 ring-transparent transition-all hover:ring-violet-300 focus:outline-none focus:ring-violet-400" />
                  }
                >
                  <Avatar size="sm">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-fuchsia-400 to-violet-500 text-white text-xs font-bold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-600"
                              : user.role === "creator"
                                ? "bg-fuchsia-50 text-fuchsia-600"
                                : "bg-cyan-50 text-cyan-600"
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-cyan-50 to-violet-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700">
                            {user.credits} Credits
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={
                      <Link href={dashboardHref} onClick={() => setMobileOpen(false)} />
                    }
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} variant="destructive">
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${
                    isAuthPage
                      ? "text-slate-300 hover:text-violet-400 hover:bg-white/10"
                      : "text-slate-600 hover:text-violet-600 hover:bg-violet-50"
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-md shadow-fuchsia-500/20 transition-all hover:shadow-lg hover:shadow-fuchsia-500/30 hover:scale-105"
                >
                  Register
                </Button>
              </Link>
            </>
          )}

          <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${
                isAuthPage
                  ? "border-white/20 text-slate-400 hover:border-violet-400/50 hover:text-violet-400 hover:bg-white/10"
                  : "border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50"
              }`}
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Join as Developer
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`relative z-50 rounded-xl p-2 transition-colors md:hidden ${
            isAuthPage
              ? "text-slate-400 hover:bg-white/10 hover:text-violet-400"
              : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`absolute inset-x-0 top-full z-40 border-t px-4 py-4 shadow-xl backdrop-blur-xl md:hidden ${
          isAuthPage
            ? "border-white/10 bg-slate-950/95"
            : "border-white/20 bg-white/95"
        }`}>
          <div className="space-y-1">
            <Link
              href="/explore-campaigns"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isAuthPage
                  ? "text-slate-300 hover:bg-white/10 hover:text-violet-400"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
              }`}
            >
              Explore Campaigns
            </Link>

            {hydrated && user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isAuthPage
                      ? "text-slate-300 hover:bg-white/10 hover:text-fuchsia-400"
                      : "text-slate-600 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                  }`}
                >
                  Dashboard
                </Link>

                <div className={`mx-4 my-2 flex items-center gap-3 rounded-xl px-4 py-3 ${
                  isAuthPage
                    ? "bg-white/5 border border-white/10"
                    : "bg-gradient-to-r from-cyan-50 to-violet-50"
                }`}>
                  <Avatar size="sm">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-fuchsia-400 to-violet-500 text-white text-xs font-bold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {user.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`inline-flex w-fit items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : user.role === "creator"
                            ? "bg-fuchsia-100 text-fuchsia-600"
                            : "bg-cyan-100 text-cyan-600"
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                        isAuthPage
                          ? "bg-white/10 text-cyan-300"
                          : "bg-white text-cyan-600 shadow-sm"
                      }`}>
                        {user.credits} Credits
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isAuthPage
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-red-500 hover:bg-red-50"
                  }`}
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button
                    variant="ghost"
                    className={`w-full rounded-xl ${
                      isAuthPage ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-md">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isAuthPage
                  ? "text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Join as Developer
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
