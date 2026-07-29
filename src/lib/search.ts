import Fuse from "fuse.js";
import { SearchResource } from "./types";
import { mockResources } from "./mockData";

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'keywords', weight: 0.3 },
    { name: 'description', weight: 0.1 },
    { name: 'tags', weight: 0.1 },
    { name: 'category', weight: 0.1 }
  ],
  includeMatches: true,
  threshold: 0.4, // Lower threshold = closer match required. 0.4 allows for typos.
  ignoreLocation: true, // Fuzzy search anywhere in the string
  useExtendedSearch: true,
};

let fuse: Fuse<SearchResource> | null = null;

// Mock function to simulate fetching resources from Google Sheets or API
export async function fetchResources(): Promise<SearchResource[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockResources;
}

export async function searchResources(query: string, category: string = "All"): Promise<SearchResource[]> {
  const allResources = await fetchResources();
  
  let filtered = allResources;
  if (category !== "All") {
    filtered = allResources.filter(r => r.category === category);
  }

  if (!query.trim()) {
    return filtered;
  }

  // Initialize fuse if not done yet or if data changed (for now, just re-init with filtered data)
  fuse = new Fuse(filtered, fuseOptions);
  
  const results = fuse.search(query);
  return results.map(result => result.item);
}
