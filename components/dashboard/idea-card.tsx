"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bookmark, MessageCircle, Eye, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, toggleSave } from "@/lib/actions/ideas";
import type { Idea } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea;
  onSelect?: (idea: Idea) => void;
  isSelected?: boolean;
}

export function IdeaCard({ idea, onSelect, isSelected }: IdeaCardProps) {
  const [isLiked, setIsLiked] = useState(idea.isLiked || false);
  const [isSaved, setIsSaved] = useState(idea.isSaved || false);
  const [likeCount, setLikeCount] = useState(idea._count?.likes || 0);
  const [saveCount, setSaveCount] = useState(idea._count?.saves || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    const prevLiked = isLiked;
    const prevCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    const result = await toggleLike(idea.id);

    if (!result.success) {
      // Revert on error
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }

    setIsLikeLoading(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaveLoading) return;

    setIsSaveLoading(true);
    const prevSaved = isSaved;
    const prevCount = saveCount;

    // Optimistic update
    setIsSaved(!isSaved);
    setSaveCount(isSaved ? saveCount - 1 : saveCount + 1);

    const result = await toggleSave(idea.id);

    if (!result.success) {
      // Revert on error
      setIsSaved(prevSaved);
      setSaveCount(prevCount);
    }

    setIsSaveLoading(false);
  };

  const stageColors: Record<string, string> = {
    IDEA: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MVP: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    EARLY_TRACTION: "bg-green-500/10 text-green-400 border-green-500/20",
    GROWTH: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    SCALING: "bg-primary/10 text-primary border-primary/20",
  };

  const stageLabels: Record<string, string> = {
    IDEA: "Idea",
    MVP: "MVP",
    EARLY_TRACTION: "Traction",
    GROWTH: "Growth",
    SCALING: "Scaling",
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:bg-card",
        isSelected && "border-primary bg-card"
      )}
      onClick={() => onSelect?.(idea)}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={idea.user.avatar || undefined} alt={idea.user.name} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {idea.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{idea.user.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {idea.user.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {idea.user.company}
                  </span>
                )}
                {idea.user.country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {idea.user.country}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={stageColors[idea.stage]}>
            {stageLabels[idea.stage]}
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-4 space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
            {idea.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {idea.tagline}
          </p>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-secondary/50">
            {idea.industry}
          </Badge>
          {idea.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="border-border/50">
              {tag}
            </Badge>
          ))}
          {idea.tags.length > 2 && (
            <Badge variant="outline" className="border-border/50">
              +{idea.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {idea.views}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              {idea._count?.comments || 0}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 text-muted-foreground hover:text-foreground",
                isLiked && "text-red-500 hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              {likeCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 text-muted-foreground hover:text-foreground",
                isSaved && "text-primary hover:text-primary"
              )}
              onClick={handleSave}
              disabled={isSaveLoading}
            >
              <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
              {saveCount}
            </Button>
          </div>
        </div>

        {/* Funding Info */}
        {idea.fundingGoal && (
          <div className="mt-4 rounded-lg bg-secondary/30 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Seeking</span>
              <span className="font-semibold text-primary">
                ${(idea.fundingGoal / 1000).toFixed(0)}K
                {idea.equity && ` for ${idea.equity}%`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
