"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { CreativeRequest } from "@/lib/types";

export function NotificationBell({ newRequests }: { newRequests: CreativeRequest[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (newRequests.length === 0) {
    return (
      <div className="relative p-2 text-slate-400">
        <Bell className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
          {newRequests.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
              {newRequests.length} New
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {newRequests.map((req) => (
              <Link
                key={req.id}
                href={`/requests?id=${req.id}`}
                onClick={() => setIsOpen(false)}
                className="block p-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-0"
              >
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-900 dark:text-white leading-tight">
                      <span className="font-semibold">{req.requesterName}</span> requested a <span className="font-semibold">{req.title}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <Link 
              href="/requests" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-1"
            >
              View all requests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
