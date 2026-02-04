"use client"

import { useState } from "react"
import { Bookmark, Trash2 } from "lucide-react"
import { IdeaCard, type Idea } from "@/components/idea-card"
import { IdeaDetailPanel } from "@/components/idea-detail-panel"
import { Button } from "@/components/ui/button"

const savedIdeas: Idea[] = [
  {
    id: "3",
    title: "PayLocal",
    founder: "Fatima Ben Ali",
    avatar: "FB",
    country: "Morocco",
    industry: "FinTech",
    stage: "Series A",
    problem: "Cross-border payments in Africa are slow, expensive (avg 8.5% fees), and unreliable. Traditional banking infrastructure fails to serve the continent's growing digital economy.",
    solution: "Blockchain-based instant settlement network for African currencies. Real-time FX, 0.5% fees, and integration with mobile money platforms.",
    market: "Africa's remittance market is $96B annually, with intra-Africa trade growing 15% YoY.",
    impact: "Save African businesses and families over $5B annually in remittance fees.",
    traction: "$2M monthly transaction volume, licensed in 5 countries, 50K active users.",
    likes: 312,
    saves: 156,
    comments: 67,
    createdAt: "1 day ago",
    isLiked: false,
    isSaved: true,
    isVerified: false,
  },
  {
    id: "6",
    title: "LogiFleet",
    founder: "David Mensah",
    avatar: "DM",
    country: "Kenya",
    industry: "Logistics",
    stage: "Seed",
    problem: "African logistics is fragmented and inefficient. Empty truck returns average 40%, and there's no visibility into shipment status.",
    solution: "Uber for trucks - matching shippers with drivers, plus real-time tracking and digital documentation. Reducing empty miles by 60%.",
    market: "Africa's logistics market is $180B, with last-mile delivery being the fastest growing segment.",
    impact: "Cut shipping costs by 30% while improving reliability for African businesses.",
    traction: "2,000 trucks on platform, $500K monthly GMV, NPS of 72.",
    likes: 167,
    saves: 78,
    comments: 41,
    createdAt: "4 days ago",
    isLiked: true,
    isSaved: true,
    isVerified: false,
  },
]

export default function SavedIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(savedIdeas)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [showMobilePanel, setShowMobilePanel] = useState(false)

  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdea(idea)
    setShowMobilePanel(true)
  }

  const handleClosePanel = () => {
    setShowMobilePanel(false)
    setSelectedIdea(null)
  }

  const handleUnsave = (ideaId: string) => {
    setIdeas(ideas.filter(idea => idea.id !== ideaId))
    if (selectedIdea?.id === ideaId) {
      setSelectedIdea(null)
    }
  }

  const handleLike = (ideaId: string) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          isLiked: !idea.isLiked,
          likes: idea.isLiked ? idea.likes - 1 : idea.likes + 1,
        }
      }
      return idea
    }))
    if (selectedIdea?.id === ideaId) {
      setSelectedIdea(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      } : null)
    }
  }

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur-sm p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Saved Ideas</h1>
              <p className="mt-1 text-muted-foreground">
                {ideas.length} ideas saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Saved ideas list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {ideas.length > 0 ? (
            ideas.map(idea => (
              <div key={idea.id} className="relative">
                <IdeaCard
                  idea={idea}
                  isSelected={selectedIdea?.id === idea.id}
                  onClick={() => handleSelectIdea(idea)}
                  onLike={() => handleLike(idea.id)}
                  onSave={() => handleUnsave(idea.id)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">No saved ideas</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Save ideas you like to review them later
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel - Desktop */}
      <div className="hidden w-96 flex-shrink-0 border-l border-border bg-card lg:block">
        <IdeaDetailPanel
          idea={selectedIdea}
          onLike={() => selectedIdea && handleLike(selectedIdea.id)}
          onSave={() => selectedIdea && handleUnsave(selectedIdea.id)}
        />
      </div>

      {/* Right panel - Mobile */}
      {showMobilePanel && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={handleClosePanel}
            onKeyDown={(e) => e.key === "Escape" && handleClosePanel()}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-2xl bg-card lg:hidden overflow-hidden">
            <IdeaDetailPanel
              idea={selectedIdea}
              onClose={handleClosePanel}
              onLike={() => selectedIdea && handleLike(selectedIdea.id)}
              onSave={() => selectedIdea && handleUnsave(selectedIdea.id)}
            />
          </div>
        </>
      )}
    </div>
  )
}
