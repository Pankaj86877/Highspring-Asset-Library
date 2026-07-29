"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBox } from "@/components/ui/SearchBox";
import { ResultCard } from "@/components/ui/ResultCard";
import { AddressModule } from "@/components/ui/AddressModule";
import { searchResources } from "@/lib/search";
import { SearchResource, ResourceCategory } from "@/lib/types";
import { Loader2, SlidersHorizontal, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: ResourceCategory[] = [
  "All",
  "Addresses",
  "Images",
  "Videos",
  "Documents",
  "Google Drive",
  "HR",
  "Marketing",
  "Policies",
  "Contacts",
  "Events",
  "Links"
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as ResourceCategory) || "All";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>(initialCategory);
  const [results, setResults] = useState<SearchResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when URL params change (e.g. from the header search box)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const data = await searchResources(query, activeCategory);
      setResults(data);
      setIsLoading(false);
    };
    fetchResults();
  }, [query, activeCategory]);

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-8 gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </div>
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg text-left whitespace-nowrap transition-colors",
                activeCategory === category 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Results Area */}
      <main className="flex-1 space-y-6">
        {activeCategory === "Addresses" ? (
          <AddressModule />
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <SearchBox initialQuery={query} />
            </div>

            <div className="space-y-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                  </div>
                ) : (
                  <span>Found {results.length} results {query && <span>for <span className="font-semibold text-slate-900 dark:text-white">"{query}"</span></span>}</span>
                )}
              </div>

              {!isLoading && results.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    We couldn't find any resources matching your search. Try adjusting your keywords or category filter.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {results.map((resource) => (
                  <ResultCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
