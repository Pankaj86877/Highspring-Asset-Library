"use client";

import { useState, useMemo, useEffect } from "react";
import Fuse, { FuseResultMatch } from "fuse.js";
import { addresses } from "@/lib/addressData";
import { Building2, MapPin, Globe, Fingerprint, Mailbox, Map, Copy, Check, Search, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AddressRecord {
  GSTIN: string;
  State: string;
  City: string;
  Language: string;
  Address: string;
}

const fuse = new Fuse(addresses as AddressRecord[], {
  keys: ["City", "State", "Language", "GSTIN", "Address"],
  includeMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: true,
});

// Helper to highlight matching text
function HighlightedText({ text, matches, keyName }: { text: string; matches?: readonly FuseResultMatch[]; keyName: string }) {
  if (!matches) return <>{text}</>;

  const match = matches.find((m: FuseResultMatch) => m.key === keyName);
  if (!match || !match.indices || match.indices.length === 0) return <>{text}</>;

  const indices = match.indices;
  let result = [];
  let lastIndex = 0;

  indices.forEach(([start, end]: [number, number], i: number) => {
    if (start > lastIndex) {
      result.push(<span key={`t-${i}`}>{text.substring(lastIndex, start)}</span>);
    }
    result.push(
      <mark key={`m-${i}`} className="bg-yellow-200 dark:bg-yellow-900 text-inherit rounded-sm px-0.5">
        {text.substring(start, end + 1)}
      </mark>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    result.push(<span key={`t-end`}>{text.substring(lastIndex)}</span>);
  }

  return <>{result}</>;
}

export function AddressModule() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ item: AddressRecord; matches?: readonly FuseResultMatch[] }[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(addresses.map(a => ({ item: a as AddressRecord })));
    } else {
      const searchResults = fuse.search(query);
      setResults(searchResults);
    }
  }, [query]);

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by City, State, GSTIN, Language, or Address..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((result, idx) => (
            <AddressCard 
              key={result.item.GSTIN + idx} 
              record={result.item} 
              matches={result.matches} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No office location found.</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Try searching for a different city or state. For example: "Haldwani", "Delhi", or "Pune".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddressCard({ record, matches }: { record: AddressRecord; matches?: readonly FuseResultMatch[] }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedGSTIN, setCopiedGSTIN] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(record.Address)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(record.Address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyGSTIN = () => {
    navigator.clipboard.writeText(record.GSTIN);
    setCopiedGSTIN(true);
    setTimeout(() => setCopiedGSTIN(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Building2 className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="font-medium">City:</span>
            <span className="text-slate-600 dark:text-slate-300">
              <HighlightedText text={record.City} matches={matches} keyName="City" />
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-medium">State:</span>
            <span className="text-slate-600 dark:text-slate-300">
              <HighlightedText text={record.State} matches={matches} keyName="State" />
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="font-medium">Language:</span>
            <span className="text-slate-600 dark:text-slate-300">
              <HighlightedText text={record.Language} matches={matches} keyName="Language" />
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Fingerprint className="w-5 h-5 text-purple-500 shrink-0" />
            <span className="font-medium">GSTIN:</span>
            <span className="text-slate-600 dark:text-slate-300 font-mono">
              <HighlightedText text={record.GSTIN} matches={matches} keyName="GSTIN" />
            </span>
          </div>
          <div className="flex items-start gap-2 text-slate-900 dark:text-white">
            <Mailbox className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <span className="font-medium">Address:</span>
            <span className="text-slate-600 dark:text-slate-300 flex-1">
              <HighlightedText text={record.Address} matches={matches} keyName="Address" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors"
        >
          <Map className="w-4 h-4" />
          Open in Google Maps
        </a>
        <button 
          onClick={copyAddress}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copiedAddress ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          Copy Address
        </button>
        <button 
          onClick={copyGSTIN}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copiedGSTIN ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          Copy GSTIN
        </button>
      </div>
    </div>
  );
}
