"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const roleHome: Record<string, string> = {
  admin: "/dashboard/admin/home",
  creator: "/dashboard/creator/home",
  supporter: "/dashboard/supporter/home",
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;

    // Check if user is accessing a dashboard route for a different role
    const segment = pathname.split("/dashboard/")[1]?.split("/")[0];
    if (segment && segment in roleHome && segment !== user.role && user.role !== "admin") {
      router.replace(roleHome[user.role]);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!user) return null;

  // Block rendering if user is on wrong role's dashboard (until redirect completes)
  const segment = pathname.split("/dashboard/")[1]?.split("/")[0];
  if (segment && segment in roleHome && segment !== user.role && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return <>{children}</>;
}
