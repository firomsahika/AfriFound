import Link from "next/link"
import { ArrowRight, Lightbulb, Users, TrendingUp, Heart, Bookmark, MessageCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AfriFound</span>
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </Link>
          <Link href="#featured" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Featured Ideas
          </Link>
          <Link href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Testimonials
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard/post">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Post Your Idea
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Now connecting 500+ founders with investors
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Where African Ideas{" "}
            <span className="text-primary">Meet Capital</span>
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl text-pretty">
            The premier platform for African founders, developers, and investors to share startup ideas, 
            discover innovation, and connect for funding and collaboration.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                Explore Ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/post">
              <Button size="lg" variant="outline" className="w-full border-border text-foreground hover:bg-secondary sm:w-auto bg-transparent">
                Post Your Idea
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
          {[
            { value: "500+", label: "Founders" },
            { value: "150+", label: "Investors" },
            { value: "$2.5M", label: "Raised" },
            { value: "54", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Lightbulb,
      title: "Share Your Idea",
      description: "Post your startup idea with problem, solution, and market details. Get visibility from our community of founders and investors.",
    },
    {
      icon: Users,
      title: "Connect with Investors",
      description: "Verified investors browse ideas, save their favorites, and reach out directly. No intermediaries, no friction.",
    },
    {
      icon: TrendingUp,
      title: "Grow Together",
      description: "Receive feedback, build connections, and secure funding to turn your vision into reality across Africa.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to connect your idea with the right investors
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedIdeasSection() {
  const ideas = [
    {
      id: 1,
      title: "AgroConnect",
      founder: "Amara Okafor",
      avatar: "AO",
      country: "Nigeria",
      problem: "Small-scale farmers lack access to markets and fair pricing for their produce.",
      solution: "B2B marketplace connecting farmers directly with restaurants and retailers.",
      likes: 234,
      saves: 89,
      industry: "AgriTech",
    },
    {
      id: 2,
      title: "MedAssist AI",
      founder: "Kwame Asante",
      avatar: "KA",
      country: "Ghana",
      problem: "Healthcare diagnosis delays due to shortage of specialists in rural areas.",
      solution: "AI-powered diagnostic tool for community health workers.",
      likes: 187,
      saves: 72,
      industry: "HealthTech",
    },
    {
      id: 3,
      title: "PayLocal",
      founder: "Fatima Ben Ali",
      avatar: "FB",
      country: "Morocco",
      problem: "Cross-border payments in Africa are slow, expensive, and unreliable.",
      solution: "Blockchain-based instant settlement network for African currencies.",
      likes: 312,
      saves: 156,
      industry: "FinTech",
    },
  ]

  return (
    <section id="featured" className="border-t border-border bg-secondary/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Ideas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Trending startups that are shaping Africa&apos;s future
            </p>
          </div>
          <Link href="/dashboard" className="hidden items-center gap-1 text-primary hover:underline sm:flex">
            View all ideas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <article
              key={idea.id}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {idea.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{idea.founder}</div>
                    <div className="text-xs text-muted-foreground">{idea.country}</div>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {idea.industry}
                </span>
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-foreground">{idea.title}</h3>
              
              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Problem</span>
                  <p className="mt-0.5 text-sm text-foreground/80 line-clamp-2">{idea.problem}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Solution</span>
                  <p className="mt-0.5 text-sm text-foreground/80 line-clamp-2">{idea.solution}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-muted-foreground">
                <button type="button" className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                  <Heart className="h-4 w-4" />
                  {idea.likes}
                </button>
                <button type="button" className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                  <Bookmark className="h-4 w-4" />
                  {idea.saves}
                </button>
                <button type="button" className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary hover:underline">
            View all ideas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "AfriFound connected me with three investors within two weeks. I secured my seed round faster than I ever imagined possible.",
      author: "Chioma Eze",
      role: "Founder, EduBridge",
      country: "Nigeria",
      avatar: "CE",
    },
    {
      quote: "As an investor, finding quality African startups was challenging. AfriFound gives me a curated feed of the most promising ideas.",
      author: "David Mensah",
      role: "Partner, Sahara Ventures",
      country: "Kenya",
      avatar: "DM",
    },
    {
      quote: "The feedback from the community helped me refine my pitch. The platform is more than funding - it's a support network.",
      author: "Youssef El Amrani",
      role: "Founder, SolarHome",
      country: "Morocco",
      avatar: "YE",
    },
  ]

  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Founders & Investors
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join the community that&apos;s building Africa&apos;s future
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-foreground/90 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-foreground">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} · {testimonial.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Share Your Vision?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join hundreds of African founders who are already connecting with investors
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard/post">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                Post Your Idea
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full border-border text-foreground hover:bg-secondary sm:w-auto bg-transparent">
                Browse Ideas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Lightbulb className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AfriFound</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">About</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; 2026 AfriFound. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturedIdeasSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
