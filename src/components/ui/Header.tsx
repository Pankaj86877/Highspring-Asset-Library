"use client";

import Link from "next/link";
import { Search, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the authentication cookie
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
    router.push("/login");
    router.refresh(); // Refresh to ensure layout updates
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Highspring <span className="text-blue-600">Asset Library</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 p-1.5 px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900/50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
