"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  ExternalLink,
  FileText,
  Users,
  MapPin,
  Building2,
  Send,
  X,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, toggleSave, addComment } from "@/lib/actions/ideas";
import { getOrCreateConversation } from "@/lib/actions/messages";
import type { Idea, Comment } from "@/lib/types";

interface IdeaDetailProps {
  idea: Idea & { comments?: Comment[] };
  onClose?: () => void;
  currentUserId?: string;
}

export function IdeaDetail({ idea, onClose, currentUserId }: IdeaDetailProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(idea.isLiked || false);
  const [isSaved, setIsSaved] = useState(idea.isSaved || false);
  const [likeCount, setLikeCount] = useState(idea._count?.likes || 0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(idea.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    await toggleLike(idea.id);
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    await toggleSave(idea.id);
  };

  const handleComment = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await addComment(idea.id, comment);

    if (result.success && result.data) {
      setComments([result.data as Comment, ...comments]);
      setComment("");
    }

    setIsSubmitting(false);
  };

  const handleContactFounder = async () => {
    if (isContacting || idea.user.id === currentUserId) return;

    setIsContacting(true);
    const result = await getOrCreateConversation(idea.user.id);

    if (result.success && result.conversationId) {
      router.push(`/dashboard/messages?conversation=${result.conversationId}`);
    }

    setIsContacting(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: idea.title,
        text: idea.tagline,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const stageLabels: Record<string, string> = {
    IDEA: "Idea Stage",
    MVP: "MVP",
    EARLY_TRACTION: "Early Traction",
    GROWTH: "Growth",
    SCALING: "Scaling",
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Idea Details</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
          {/* Founder Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={idea.user.avatar || undefined} alt={idea.user.name} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {idea.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{idea.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {idea.user.role?.charAt(0) + idea.user.role?.slice(1).toLowerCase()}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
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

            {/* Social Links */}
            <div className="flex items-center gap-1">
              {idea.user.linkedin && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={idea.user.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {idea.user.twitter && (
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`https://twitter.com/${idea.user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {idea.user.website && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={idea.user.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Title & Stage */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{idea.industry}</Badge>
              <Badge variant="outline">{stageLabels[idea.stage]}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{idea.title}</h1>
            <p className="mt-2 text-muted-foreground">{idea.tagline}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-border/50">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Problem & Solution */}
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary/30 p-4">
              <h3 className="mb-2 font-semibold text-foreground">The Problem</h3>
              <p className="text-sm text-muted-foreground">{idea.problem}</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Our Solution</h3>
              <p className="text-sm text-muted-foreground">{idea.solution}</p>
            </div>
          </div>

          {/* Description */}
          {idea.description && (
            <div>
              <h3 className="mb-2 font-semibold text-foreground">About</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {idea.description}
              </p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-secondary/30 p-3 text-center">
              <Users className="mx-auto mb-1 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground">{idea.teamSize}</p>
              <p className="text-xs text-muted-foreground">Team Size</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3 text-center">
              <Heart className="mx-auto mb-1 h-5 w-5 text-red-500" />
              <p className="text-lg font-bold text-foreground">{likeCount}</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3 text-center">
              <MessageCircle className="mx-auto mb-1 h-5 w-5 text-blue-500" />
              <p className="text-lg font-bold text-foreground">{comments.length}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </div>

          {/* Funding */}
          {idea.fundingGoal && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Investment Opportunity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Seeking</p>
                  <p className="text-xl font-bold text-primary">
                    ${(idea.fundingGoal / 1000).toFixed(0)}K
                  </p>
                </div>
                {idea.equity && (
                  <div>
                    <p className="text-sm text-muted-foreground">Equity Offered</p>
                    <p className="text-xl font-bold text-foreground">{idea.equity}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            {idea.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={idea.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
            {idea.pitchDeck && (
              <Button variant="outline" size="sm" asChild>
                <a href={idea.pitchDeck} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Pitch Deck
                </a>
              </Button>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t border-border pt-6">
            <h3 className="mb-4 font-semibold text-foreground">
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            {currentUserId && (
              <div className="mb-4 flex gap-2">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-20 resize-none bg-secondary/30"
                />
                <Button
                  onClick={handleComment}
                  disabled={!comment.trim() || isSubmitting}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.user.avatar || undefined} alt={c.user.name} />
                    <AvatarFallback className="bg-primary/20 text-xs text-primary">
                      {c.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{c.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Bar */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(isLiked && "text-red-500")}
              onClick={handleLike}
            >
              <Heart className={cn("mr-1.5 h-4 w-4", isLiked && "fill-current")} />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(isSaved && "text-primary")}
              onClick={handleSave}
            >
              <Bookmark className={cn("mr-1.5 h-4 w-4", isSaved && "fill-current")} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="mr-1.5 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {idea.user.id !== currentUserId && (
          <Button
            className="w-full"
            onClick={handleContactFounder}
            disabled={isContacting}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {isContacting ? "Starting conversation..." : "Contact Founder"}
          </Button>
        )}
      </div>
    </div>
  );
}
