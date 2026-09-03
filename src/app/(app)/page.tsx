"use client";

import { SearchBox } from "@/components/ui/SearchBox";
import { Folder, MapPin, Image as ImageIcon, Video, FileText, Link as LinkIcon, Users, Building, ShieldCheck, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getNewRequestsCount } from "@/lib/requests";

const CATEGORIES = [
  { name: "Address", icon: MapPin, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
  { name: "Google Drive", icon: Folder, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Documents", icon: FileText, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { name: "Links", icon: LinkIcon, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-500/10" },
  { name: "Employee", icon: Users, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
  { name: "Requests", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
];

export default function Home() {
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  useEffect(() => {
    getNewRequestsCount().then(setNewRequestsCount).catch(console.error);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-12 sm:py-24">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enterprise<span className="text-blue-600">Search</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find company resources instantly. Try searching for "Reception Videos", "Haldwani Office", or "Marketing Logos".
          </p>
        </div>

        <div className="w-full">
          <SearchBox size="lg" autoFocus={true} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 w-full max-w-4xl"
      >
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.name === "Requests" ? "/requests" : `/search?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className={`relative p-4 rounded-full ${category.bg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${category.color}`} />
                  {category.name === "Requests" && newRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                      {newRequestsCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {category.name} {category.name === "Requests" && newRequestsCount > 0 ? `(${newRequestsCount})` : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
