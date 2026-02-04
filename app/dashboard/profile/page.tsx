"use client"

import { useState } from "react"
import { Camera, MapPin, Link as LinkIcon, Twitter, Linkedin, Globe, Edit, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UserProfile {
  name: string
  email: string
  bio: string
  role: "founder" | "investor"
  country: string
  website: string
  twitter: string
  linkedin: string
  avatar: string
  verified: boolean
  ideas: number
  likes: number
  connections: number
}

const initialProfile: UserProfile = {
  name: "Amara Okafor",
  email: "amara@agroconnect.ng",
  bio: "Building the future of African agriculture. Founder of AgroConnect - connecting farmers directly to markets. Passionate about using technology to solve real problems.",
  role: "founder",
  country: "Nigeria",
  website: "https://agroconnect.ng",
  twitter: "amaraokafor",
  linkedin: "amaraokafor",
  avatar: "AO",
  verified: true,
  ideas: 2,
  likes: 379,
  connections: 48,
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(profile)

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
        
        {/* Avatar and info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-primary/10 text-2xl font-bold text-primary">
                {profile.avatar}
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
              {profile.verified && (
                <div className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-xl font-bold text-foreground bg-transparent border-b border-input focus:border-primary focus:outline-none"
                />
              ) : (
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium",
                  profile.role === "founder" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {profile.role === "founder" ? "Founder" : "Investor"}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {profile.country}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{profile.ideas}</p>
              <p className="text-sm text-muted-foreground">Ideas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{profile.likes}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{profile.connections}</p>
              <p className="text-sm text-muted-foreground">Connections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground">About</h3>
        {isEditing ? (
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            rows={4}
            className="mt-3 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          />
        ) : (
          <p className="mt-3 text-foreground/80 leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {/* Links */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground">Links</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            {isEditing ? (
              <input
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                placeholder="Website URL"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            ) : (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.website}
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Twitter className="h-5 w-5 text-muted-foreground" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.twitter}
                onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                placeholder="Twitter username"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            ) : (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                @{profile.twitter}
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Linkedin className="h-5 w-5 text-muted-foreground" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.linkedin}
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                placeholder="LinkedIn username"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            ) : (
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                linkedin.com/in/{profile.linkedin}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
