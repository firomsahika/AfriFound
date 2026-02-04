"use client"

import { TrendingUp, Eye, Heart, Bookmark, MessageCircle, Users, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Total Views",
    value: "2,090",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
  },
  {
    label: "Total Likes",
    value: "379",
    change: "+8.2%",
    trend: "up",
    icon: Heart,
  },
  {
    label: "Total Saves",
    value: "156",
    change: "+15.3%",
    trend: "up",
    icon: Bookmark,
  },
  {
    label: "Investor Contacts",
    value: "24",
    change: "-2.1%",
    trend: "down",
    icon: Users,
  },
]

const topIdeas = [
  {
    id: "1",
    title: "AgroConnect - Farm to Table Marketplace",
    views: 1234,
    likes: 234,
    saves: 89,
    conversionRate: "7.2%",
  },
  {
    id: "2",
    title: "EduBridge - Online Learning Platform",
    views: 856,
    likes: 145,
    saves: 67,
    conversionRate: "7.8%",
  },
]

const recentActivity = [
  { type: "like", user: "David Mensah", idea: "AgroConnect", time: "2 minutes ago" },
  { type: "save", user: "Sarah Kimani", idea: "AgroConnect", time: "15 minutes ago" },
  { type: "contact", user: "Michael Obi", idea: "EduBridge", time: "1 hour ago" },
  { type: "like", user: "Fatima Ben Ali", idea: "EduBridge", time: "2 hours ago" },
  { type: "view", user: "Anonymous", idea: "AgroConnect", time: "3 hours ago" },
]

const weeklyData = [
  { day: "Mon", views: 120, likes: 15 },
  { day: "Tue", views: 180, likes: 22 },
  { day: "Wed", views: 150, likes: 18 },
  { day: "Thu", views: 220, likes: 28 },
  { day: "Fri", views: 280, likes: 35 },
  { day: "Sat", views: 190, likes: 20 },
  { day: "Sun", views: 160, likes: 17 },
]

export default function AnalyticsPage() {
  const maxViews = Math.max(...weeklyData.map(d => d.views))

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Track the performance of your ideas</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              )}>
                {stat.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Weekly Performance</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary/40" />
                <span className="text-muted-foreground">Likes</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-end gap-2 h-48">
            {weeklyData.map(data => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/40 transition-all"
                    style={{ height: `${(data.likes / maxViews) * 150}px` }}
                  />
                  <div
                    className="w-full rounded-t bg-primary transition-all"
                    style={{ height: `${(data.views / maxViews) * 150}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top performing ideas */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground">Top Performing Ideas</h2>
          <div className="mt-4 space-y-4">
            {topIdeas.map((idea, index) => (
              <div
                key={idea.id}
                className="flex items-center gap-4 rounded-lg bg-muted/50 p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{idea.title}</p>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {idea.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {idea.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" />
                      {idea.saves}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">{idea.conversionRate}</p>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                activity.type === "like" && "bg-red-500/10 text-red-500",
                activity.type === "save" && "bg-primary/10 text-primary",
                activity.type === "contact" && "bg-green-500/10 text-green-500",
                activity.type === "view" && "bg-blue-500/10 text-blue-500"
              )}>
                {activity.type === "like" && <Heart className="h-4 w-4" />}
                {activity.type === "save" && <Bookmark className="h-4 w-4" />}
                {activity.type === "contact" && <MessageCircle className="h-4 w-4" />}
                {activity.type === "view" && <Eye className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>
                  {activity.type === "like" && " liked "}
                  {activity.type === "save" && " saved "}
                  {activity.type === "contact" && " requested to contact you about "}
                  {activity.type === "view" && " viewed "}
                  <span className="font-medium">{activity.idea}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
