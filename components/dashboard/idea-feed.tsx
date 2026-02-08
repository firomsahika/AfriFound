"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdeaCard } from "./idea-card";
import { IdeaDetail } from "./idea-detail";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { INDUSTRIES, AFRICAN_COUNTRIES, STAGES } from "@/lib/types";
import type { Idea, IdeaFilters } from "@/lib/types";

interface IdeaFeedProps {
  currentUserId?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function IdeaFeed({ currentUserId }: IdeaFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IdeaFilters>({
    search: searchParams.get("search") || "",
    industry: searchParams.get("industry") || "",
    country: searchParams.get("country") || "",
    stage: (searchParams.get("stage") as IdeaFilters["stage"]) || undefined,
    sort: (searchParams.get("sort") as IdeaFilters["sort"]) || "recent",
  });

  // Build query string
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.set("search", filters.search);
  if (filters.industry) queryParams.set("industry", filters.industry);
  if (filters.country) queryParams.set("country", filters.country);
  if (filters.stage) queryParams.set("stage", filters.stage);
  if (filters.sort) queryParams.set("sort", filters.sort);

  const { data, error, isLoading } = useSWR(
    `/api/ideas?${queryParams.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const ideas: Idea[] = data?.items || [];

  // Fetch selected idea details
  const { data: ideaDetail } = useSWR(
    selectedIdea ? `/api/ideas/${selectedIdea.id}` : null,
    fetcher
  );

  const updateFilters = (newFilters: Partial<IdeaFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      industry: "",
      country: "",
      stage: undefined,
      sort: "recent",
    });
  };

  const hasActiveFilters = filters.industry || filters.country || filters.stage;

  return (
    <div className="flex h-full">
      {/* Main Feed */}
      <div className="flex-1 overflow-auto">
        {/* Search & Filters */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="bg-secondary/30 pl-9"
              />
            </div>

            <Select
              value={filters.sort}
              onValueChange={(value) =>
                updateFilters({ sort: value as IdeaFilters["sort"] })
              }
            >
              <SelectTrigger className="w-32 bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilters(true)}
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {filters.industry && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {filters.industry}
                  <button onClick={() => updateFilters({ industry: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.country && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {filters.country}
                  <button onClick={() => updateFilters({ country: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.stage && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {STAGES.find((s) => s.value === filters.stage)?.label}
                  <button onClick={() => updateFilters({ stage: undefined })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Ideas List */}
        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Failed to load ideas</p>
              <Button
                variant="link"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try again
              </Button>
            </div>
          ) : ideas.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No ideas found</p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onSelect={setSelectedIdea}
                isSelected={selectedIdea?.id === idea.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Detail Panel - Desktop */}
      <div
        className={`hidden w-[450px] border-l border-border lg:block ${
          selectedIdea ? "animate-in slide-in-from-right" : "hidden"
        }`}
      >
        {selectedIdea && (
          <IdeaDetail
            idea={ideaDetail || selectedIdea}
            onClose={() => setSelectedIdea(null)}
            currentUserId={currentUserId}
          />
        )}
      </div>

      {/* Detail Panel - Mobile (Sheet) */}
      <Sheet open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
        <SheetContent side="bottom" className="h-[90vh] p-0 lg:hidden">
          {selectedIdea && (
            <IdeaDetail
              idea={ideaDetail || selectedIdea}
              onClose={() => setSelectedIdea(null)}
              currentUserId={currentUserId}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent>
          <div className="space-y-6 py-6">
            <h2 className="text-lg font-semibold">Filters</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Select
                  value={filters.industry || "all"}
                  onValueChange={(value) =>
                    updateFilters({ industry: value === "all" ? "" : value })
                  }
                >
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select
                  value={filters.country || "all"}
                  onValueChange={(value) =>
                    updateFilters({ country: value === "all" ? "" : value })
                  }
                >
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {AFRICAN_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stage</label>
                <Select
                  value={filters.stage || "all"}
                  onValueChange={(value) =>
                    updateFilters({
                      stage:
                        value === "all"
                          ? undefined
                          : (value as IdeaFilters["stage"]),
                    })
                  }
                >
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue placeholder="All stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button className="flex-1" onClick={() => setShowFilters(false)}>
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
