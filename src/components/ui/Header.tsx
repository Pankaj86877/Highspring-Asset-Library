import Link from "next/link";
import { Search, Settings, LogOut, User as UserIcon } from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchRequests } from "@/lib/requests";
import { NotificationBell } from "./NotificationBell";

export async function Header() {
  const session = await getSession();

  const handleLogout = async () => {
    "use server";
    await logout();
    redirect("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Highspring <span className="text-blue-600">Asset Library</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {session && session.role !== "Requester" && (
            <NotificationBell newRequests={(await fetchRequests()).filter(r => r.status === "New")} />
          )}
          {session && (
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mr-2 border-r border-slate-200 dark:border-slate-800 pr-4">
              <UserIcon className="w-4 h-4" />
              {session.name} ({session.role})
            </div>
          )}
          {session?.role === "Admin" && (
            <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </Link>
          )}
          <form action={handleLogout}>
            <button 
              type="submit"
              className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 p-1.5 px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
