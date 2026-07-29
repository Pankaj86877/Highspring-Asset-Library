"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchResources } from "@/lib/search";
import { SearchResource } from "@/lib/types";

interface SearchBoxProps {
  initialQuery?: string;
  autoFocus?: boolean;
  size?: "lg" | "default";
}

export function SearchBox({ initialQuery = "", autoFocus = false, size = "default" }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResource[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        const results = await searchResources(query);
        setSuggestions(results.slice(0, 5)); // show top 5 suggestions
        setIsSearching(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (resource: SearchResource) => {
    setShowSuggestions(false);
    setQuery(resource.title);
    router.push(`/search?q=${encodeURIComponent(resource.title)}`);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors",
          size === "lg" ? "left-5" : ""
        )}>
          <Search className={cn("w-5 h-5", size === "lg" ? "w-6 h-6" : "")} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // delay to allow clicks
          placeholder='Search resources (e.g. "Reception Videos"...)'
          className={cn(
            "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm",
            size === "lg" ? "py-4 pl-14 pr-12 text-lg" : "py-3 pl-12 pr-10 text-base"
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
          {!query && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50">
          <ul className="py-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{suggestion.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{suggestion.description}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
