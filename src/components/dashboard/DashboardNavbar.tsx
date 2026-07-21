"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <span className="text-sm text-gray-500">
        {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : "Dashboard"}
      </span>
      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
