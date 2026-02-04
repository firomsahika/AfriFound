"use client"

import { useState } from "react"
import { Plus, MoreVertical, Eye, Edit, Trash2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MyIdea {
  id: string
  title: string
  industry: string
  stage: string
  views: number
  likes: number
  saves: number
  status: "published" | "draft"
  createdAt: string
}

const myIdeas: MyIdea[] = [
  {
    id: "1",
    title: "AgroConnect - Farm to Table Marketplace",
    industry: "AgriTech",
    stage: "Seed",
    views: 1234,
    likes: 234,
    saves: 89,
    status: "published",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    title: "EduBridge - Online Learning Platform",
    industry: "EdTech",
    stage: "Pre-seed",
    views: 856,
    likes: 145,
    saves: 67,
    status: "published",
    createdAt: "1 week ago",
  },
  {
    id: "3",
    title: "HealthConnect - Telemedicine Solution",
    industry: "HealthTech",
    stage: "Idea",
    views: 0,
    likes: 0,
    saves: 0,
    status: "draft",
    createdAt: "3 days ago",
  },
]

export default function MyIdeasPage() {
  const [ideas] = useState<MyIdea[]>(myIdeas)

  const publishedIdeas = ideas.filter(idea => idea.status === "published")
  const draftIdeas = ideas.filter(idea => idea.status === "draft")

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Ideas</h1>
          <p className="mt-1 text-muted-foreground">Manage and track your startup ideas</p>
        </div>
        <Link href="/dashboard/post">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Post New Idea
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Ideas", value: ideas.length },
          { label: "Total Views", value: ideas.reduce((sum, i) => sum + i.views, 0).toLocaleString() },
          { label: "Total Likes", value: ideas.reduce((sum, i) => sum + i.likes, 0) },
          { label: "Total Saves", value: ideas.reduce((sum, i) => sum + i.saves, 0) },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Published Ideas */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Published ({publishedIdeas.length})</h2>
        <div className="mt-4 space-y-4">
          {publishedIdeas.map(idea => (
            <div
              key={idea.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-foreground truncate">{idea.title}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {idea.stage}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {idea.views.toLocaleString()} views
                  </span>
                  <span>{idea.likes} likes</span>
                  <span>{idea.saves} saves</span>
                  <span>Posted {idea.createdAt}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem className="text-foreground">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-foreground">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-foreground">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      {/* Drafts */}
      {draftIdeas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Drafts ({draftIdeas.length})</h2>
          <div className="mt-4 space-y-4">
            {draftIdeas.map(idea => (
              <div
                key={idea.id}
                className="flex items-center justify-between rounded-xl border border-border border-dashed bg-card/50 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground truncate">{idea.title}</h3>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      Draft
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Last edited {idea.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary bg-transparent">
                    Continue Editing
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
