"use client";

import { Users, FileText, Search, Database } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Resources", value: "248", icon: Database, color: "text-blue-600" },
    { name: "Total Searches (30d)", value: "1,204", icon: Search, color: "text-emerald-600" },
    { name: "Categories", value: "12", icon: FileText, color: "text-purple-600" },
    { name: "Active Users", value: "54", icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome to the Enterprise Search Portal admin area.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Searches</h3>
          <div className="space-y-4">
            {["leadership visit 2026", "marketing logo", "haldwani office", "hr policy", "reception video"].map((term, i) => (
              <div key={term} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{term}</span>
                <span className="text-xs text-slate-400">{i + 1} min ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Popular Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {["office", "logo", "brand", "hr", "video", "presentation", "guidelines"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
