"use client"

import { Heart, Bookmark, MessageCircle, Share2, Mail, FileText, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Idea } from "./idea-card"

interface IdeaDetailPanelProps {
  idea: Idea | null
  onClose?: () => void
  onLike?: () => void
  onSave?: () => void
}

export function IdeaDetailPanel({ idea, onClose, onLike, onSave }: IdeaDetailPanelProps) {
  if (!idea) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">Select an idea</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Click on any idea from the feed to view its full details here
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Idea Details</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Founder info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
              {idea.avatar}
            </div>
            {idea.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                ✓
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{idea.founder}</span>
              {idea.isVerified && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Verified Investor
                </span>
              )}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">{idea.country}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {idea.industry}
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {idea.stage}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-foreground">{idea.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Posted {idea.createdAt}</p>

        {/* Sections */}
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
              The Problem
            </h3>
            <p className="mt-2 text-foreground/90 leading-relaxed">{idea.problem}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Our Solution
            </h3>
            <p className="mt-2 text-foreground/90 leading-relaxed">{idea.solution}</p>
          </div>

          {idea.market && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Target Market
              </h3>
              <p className="mt-2 text-foreground/90 leading-relaxed">{idea.market}</p>
            </div>
          )}

          {idea.impact && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Impact
              </h3>
              <p className="mt-2 text-foreground/90 leading-relaxed">{idea.impact}</p>
            </div>
          )}

          {idea.traction && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Traction
              </h3>
              <p className="mt-2 text-foreground/90 leading-relaxed">{idea.traction}</p>
            </div>
          )}
        </div>

        {/* Engagement stats */}
        <div className="mt-8 flex items-center gap-6 rounded-lg bg-muted/50 p-4">
          <button
            type="button"
            onClick={onLike}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              idea.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("h-5 w-5", idea.isLiked && "fill-current")} />
            {idea.likes} Likes
          </button>
          <button
            type="button"
            onClick={onSave}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              idea.isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Bookmark className={cn("h-5 w-5", idea.isSaved && "fill-current")} />
            {idea.saves} Saves
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            {idea.comments} Comments
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-border p-4 space-y-3">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Mail className="mr-2 h-4 w-4" />
          Contact Founder
        </Button>
        <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary bg-transparent">
          <FileText className="mr-2 h-4 w-4" />
          Request Pitch Deck
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={cn(
              "flex-1",
              idea.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("mr-2 h-4 w-4", idea.isLiked && "fill-current")} />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className={cn(
              "flex-1",
              idea.isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Bookmark className={cn("mr-2 h-4 w-4", idea.isSaved && "fill-current")} />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
