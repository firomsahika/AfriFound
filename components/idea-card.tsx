"use client"

import { Heart, Bookmark, MessageCircle, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Idea {
  id: string
  title: string
  founder: string
  avatar: string
  country: string
  industry: string
  stage: string
  problem: string
  solution: string
  impact?: string
  market?: string
  traction?: string
  likes: number
  saves: number
  comments: number
  createdAt: string
  isLiked?: boolean
  isSaved?: boolean
  isVerified?: boolean
}

interface IdeaCardProps {
  idea: Idea
  isSelected?: boolean
  onClick?: () => void
  onLike?: () => void
  onSave?: () => void
}

export function IdeaCard({ idea, isSelected, onClick, onLike, onSave }: IdeaCardProps) {
  return (
    <article
      className={cn(
        "cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-card/80",
        isSelected && "border-primary bg-card/80 ring-1 ring-primary/20"
      )}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {idea.avatar}
            </div>
            {idea.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                ✓
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{idea.founder}</span>
              {idea.isVerified && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{idea.country}</span>
              <span>·</span>
              <span>{idea.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {idea.industry}
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {idea.stage}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-semibold text-foreground">{idea.title}</h3>

      {/* Problem & Solution */}
      <div className="mt-3 space-y-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Problem
          </span>
          <p className="mt-1 text-sm text-foreground/80 line-clamp-2">{idea.problem}</p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Solution
          </span>
          <p className="mt-1 text-sm text-foreground/80 line-clamp-2">{idea.solution}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onLike?.()
            }}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              idea.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("h-4 w-4", idea.isLiked && "fill-current")} />
            {idea.likes}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSave?.()
            }}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              idea.isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Bookmark className={cn("h-4 w-4", idea.isSaved && "fill-current")} />
            {idea.saves}
          </button>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {idea.comments}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}
