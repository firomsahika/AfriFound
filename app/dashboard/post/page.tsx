"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Lightbulb, Target, Wrench, Globe, MapPin, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Basics", icon: Lightbulb },
  { id: 2, name: "Problem", icon: Target },
  { id: 3, name: "Solution", icon: Wrench },
  { id: 4, name: "Market", icon: Globe },
  { id: 5, name: "Preview", icon: Eye },
]

const industries = [
  "FinTech", "HealthTech", "AgriTech", "EdTech", "CleanTech", 
  "Logistics", "E-commerce", "PropTech", "InsurTech", "Other"
]

const stages = ["Idea", "Pre-seed", "Seed", "Series A", "Series B+"]

const countries = [
  "Nigeria", "Kenya", "South Africa", "Ghana", "Egypt", "Morocco",
  "Tanzania", "Ethiopia", "Rwanda", "Uganda", "Senegal", "Other"
]

interface FormData {
  title: string
  industry: string
  stage: string
  country: string
  problem: string
  solution: string
  market: string
  impact: string
  traction: string
}

export default function PostIdeaPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    industry: "",
    stage: "",
    country: "",
    problem: "",
    solution: "",
    market: "",
    impact: "",
    traction: "",
  })

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.industry && formData.stage && formData.country
      case 2:
        return formData.problem.length >= 50
      case 3:
        return formData.solution.length >= 50
      case 4:
        return formData.market.length >= 30
      case 5:
        return true
      default:
        return false
    }
  }

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    alert("Idea submitted successfully! Redirecting to dashboard...")
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Post Your Idea</h1>
            <div className="w-20" />
          </div>

          {/* Steps */}
          <div className="mt-6 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.id
                        ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  disabled={currentStep < step.id}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.name}</span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-px w-8 sm:w-12",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-6">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about your startup idea
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground">
                      Idea Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g., AgroConnect - Farm to Table Marketplace"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-foreground">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stage" className="block text-sm font-medium text-foreground">
                      Stage *
                    </label>
                    <select
                      id="stage"
                      value={formData.stage}
                      onChange={(e) => updateField("stage", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select stage</option>
                      {stages.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-foreground">
                      Country / Region *
                    </label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Problem */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">The Problem</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    What pain point are you solving? Be specific and quantify if possible.
                  </p>
                </div>

                <div>
                  <label htmlFor="problem" className="block text-sm font-medium text-foreground">
                    Problem Statement * (min 50 characters)
                  </label>
                  <textarea
                    id="problem"
                    rows={6}
                    placeholder="Describe the problem you're solving. Who experiences this problem? How big is the impact?"
                    value={formData.problem}
                    onChange={(e) => updateField("problem", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formData.problem.length}/50 minimum characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Solution */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Your Solution</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    How does your product or service solve this problem?
                  </p>
                </div>

                <div>
                  <label htmlFor="solution" className="block text-sm font-medium text-foreground">
                    Solution Description * (min 50 characters)
                  </label>
                  <textarea
                    id="solution"
                    rows={6}
                    placeholder="Explain your solution. What makes it unique? How does it work?"
                    value={formData.solution}
                    onChange={(e) => updateField("solution", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formData.solution.length}/50 minimum characters
                  </p>
                </div>

                <div>
                  <label htmlFor="impact" className="block text-sm font-medium text-foreground">
                    Impact (optional)
                  </label>
                  <textarea
                    id="impact"
                    rows={3}
                    placeholder="What social, economic, or environmental impact will your solution have?"
                    value={formData.impact}
                    onChange={(e) => updateField("impact", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Market */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Market & Traction</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell investors about your target market and any traction you have.
                  </p>
                </div>

                <div>
                  <label htmlFor="market" className="block text-sm font-medium text-foreground">
                    Target Market * (min 30 characters)
                  </label>
                  <textarea
                    id="market"
                    rows={4}
                    placeholder="Who are your customers? How big is the market opportunity?"
                    value={formData.market}
                    onChange={(e) => updateField("market", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formData.market.length}/30 minimum characters
                  </p>
                </div>

                <div>
                  <label htmlFor="traction" className="block text-sm font-medium text-foreground">
                    Traction (optional)
                  </label>
                  <textarea
                    id="traction"
                    rows={3}
                    placeholder="Any users, revenue, partnerships, or milestones achieved?"
                    value={formData.traction}
                    onChange={(e) => updateField("traction", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Preview */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Preview Your Idea</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review your submission before posting
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        AO
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Amara Okafor</div>
                        <div className="text-xs text-muted-foreground">{formData.country} · Just now</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {formData.industry}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {formData.stage}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">{formData.title || "Your Idea Title"}</h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Problem</span>
                      <p className="mt-1 text-sm text-foreground/80">{formData.problem || "Your problem statement..."}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Solution</span>
                      <p className="mt-1 text-sm text-foreground/80">{formData.solution || "Your solution description..."}</p>
                    </div>
                    {formData.market && (
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Market</span>
                        <p className="mt-1 text-sm text-foreground/80">{formData.market}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm text-primary">
                    <strong>Ready to post?</strong> Your idea will be visible to investors and founders immediately after submission.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                className="border-border text-foreground hover:bg-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Submit Idea
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Live Preview Card (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">Live Preview</h3>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      AO
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Amara Okafor</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{formData.country || "Country"}</span>
                        <span>·</span>
                        <span>Just now</span>
                      </div>
                    </div>
                  </div>
                  {formData.industry && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {formData.industry}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {formData.title || "Your Idea Title"}
                </h3>

                <div className="mt-3 space-y-3">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Problem</span>
                    <p className="mt-1 text-sm text-foreground/80 line-clamp-2">
                      {formData.problem || "Your problem statement will appear here..."}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Solution</span>
                    <p className="mt-1 text-sm text-foreground/80 line-clamp-2">
                      {formData.solution || "Your solution description will appear here..."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-sm">
                    <span className="h-4 w-4">❤️</span>
                    0
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <span className="h-4 w-4">🔖</span>
                    0
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <span className="h-4 w-4">💬</span>
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
