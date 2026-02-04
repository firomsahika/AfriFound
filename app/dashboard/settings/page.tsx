"use client"

import { useState } from "react"
import { Bell, Lock, Eye, Globe, Trash2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationSettings {
  emailLikes: boolean
  emailSaves: boolean
  emailComments: boolean
  emailContacts: boolean
  pushLikes: boolean
  pushSaves: boolean
  pushComments: boolean
  pushContacts: boolean
}

interface PrivacySettings {
  showEmail: boolean
  showCountry: boolean
  allowMessages: boolean
  publicProfile: boolean
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailLikes: true,
    emailSaves: true,
    emailComments: true,
    emailContacts: true,
    pushLikes: false,
    pushSaves: false,
    pushComments: true,
    pushContacts: true,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showEmail: false,
    showCountry: true,
    allowMessages: true,
    publicProfile: true,
  })

  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "account">("notifications")

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "account", label: "Account", icon: Lock },
  ] as const

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Email Notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choose what updates you receive via email</p>
            
            <div className="mt-4 space-y-4">
              {[
                { key: "emailLikes", label: "Someone likes your idea" },
                { key: "emailSaves", label: "Someone saves your idea" },
                { key: "emailComments", label: "Someone comments on your idea" },
                { key: "emailContacts", label: "An investor wants to contact you" },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between">
                  <span className="text-foreground">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof NotificationSettings] }))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      notifications[item.key as keyof NotificationSettings] ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
                        notifications[item.key as keyof NotificationSettings] && "translate-x-5"
                      )}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Push Notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choose what updates you receive on your device</p>
            
            <div className="mt-4 space-y-4">
              {[
                { key: "pushLikes", label: "Someone likes your idea" },
                { key: "pushSaves", label: "Someone saves your idea" },
                { key: "pushComments", label: "Someone comments on your idea" },
                { key: "pushContacts", label: "An investor wants to contact you" },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between">
                  <span className="text-foreground">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof NotificationSettings] }))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      notifications[item.key as keyof NotificationSettings] ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
                        notifications[item.key as keyof NotificationSettings] && "translate-x-5"
                      )}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy tab */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Profile Visibility</h3>
            <p className="mt-1 text-sm text-muted-foreground">Control what others can see about you</p>
            
            <div className="mt-4 space-y-4">
              {[
                { key: "publicProfile", label: "Public profile", description: "Allow anyone to view your profile" },
                { key: "showEmail", label: "Show email address", description: "Display your email on your profile" },
                { key: "showCountry", label: "Show country", description: "Display your country on your profile" },
                { key: "allowMessages", label: "Allow messages", description: "Let others send you direct messages" },
              ].map(item => (
                <div key={item.key} className="flex items-start justify-between">
                  <div>
                    <span className="text-foreground">{item.label}</span>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key as keyof PrivacySettings] }))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors flex-shrink-0 mt-1",
                      privacy[item.key as keyof PrivacySettings] ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
                        privacy[item.key as keyof PrivacySettings] && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Change Password</h3>
            <p className="mt-1 text-sm text-muted-foreground">Update your password to keep your account secure</p>
            
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-foreground">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Update Password
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Sessions</h3>
            <p className="mt-1 text-sm text-muted-foreground">Manage your active sessions</p>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="font-medium text-foreground">Current session</p>
                  <p className="text-sm text-muted-foreground">Lagos, Nigeria · Chrome on MacOS</p>
                </div>
                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              </div>
            </div>
            
            <Button variant="outline" className="mt-4 border-border text-foreground hover:bg-secondary bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out of all devices
            </Button>
          </div>

          <div className="rounded-xl border border-destructive/50 bg-card p-6">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
            <p className="mt-1 text-sm text-muted-foreground">Irreversible account actions</p>
            
            <div className="mt-4">
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
