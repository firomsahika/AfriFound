// Shared types for AfriFound

export type UserRole = "FOUNDER" | "INVESTOR" | "DEVELOPER" | "MENTOR";
export type IdeaStage = "IDEA" | "MVP" | "EARLY_TRACTION" | "GROWTH" | "SCALING";
export type IdeaStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  bio: string | null;
  location: string | null;
  country: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  skills: string[];
  interests: string[];
  company: string | null;
  companyRole: string | null;
  investmentFocus: string[];
  portfolioSize: string | null;
  investmentRange: string | null;
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  description: string | null;
  industry: string;
  country: string;
  stage: IdeaStage;
  fundingGoal: number | null;
  fundingRaised: number;
  equity: number | null;
  teamSize: number;
  tags: string[];
  coverImage: string | null;
  pitchDeck: string | null;
  website: string | null;
  views: number;
  status: IdeaStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  userId: string;
  user: User;
  _count?: {
    likes: number;
    saves: number;
    comments: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  read: boolean;
  createdAt: Date;
  sender: User;
  receiver: User;
}

export interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participants: {
    user: User;
  }[];
  messages: Message[];
  _count?: {
    messages: number;
  };
  unreadCount?: number;
  lastMessage?: Message;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: Record<string, unknown> | null;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  ideaId: string;
  parentId: string | null;
  createdAt: Date;
  user: User;
  replies?: Comment[];
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface IdeaFilters {
  industry?: string;
  country?: string;
  stage?: IdeaStage;
  search?: string;
  sort?: "trending" | "recent" | "hot";
  userId?: string;
  status?: IdeaStatus;
}

// Form types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface IdeaFormData {
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  description?: string;
  industry: string;
  country: string;
  stage: IdeaStage;
  fundingGoal?: number;
  equity?: number;
  teamSize: number;
  tags: string[];
  coverImage?: string;
  pitchDeck?: string;
  website?: string;
  status: IdeaStatus;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
  location?: string;
  country?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  skills: string[];
  interests: string[];
  company?: string;
  companyRole?: string;
  investmentFocus?: string[];
  portfolioSize?: string;
  investmentRange?: string;
}

// Constants
export const INDUSTRIES = [
  "FinTech",
  "AgriTech",
  "HealthTech",
  "EdTech",
  "E-Commerce",
  "CleanTech",
  "Logistics",
  "PropTech",
  "InsurTech",
  "Entertainment",
  "SaaS",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Other",
] as const;

export const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Kenya",
  "South Africa",
  "Egypt",
  "Ghana",
  "Rwanda",
  "Ethiopia",
  "Tanzania",
  "Uganda",
  "Senegal",
  "Morocco",
  "Tunisia",
  "Côte d'Ivoire",
  "Cameroon",
  "Zimbabwe",
  "Botswana",
  "Mauritius",
  "Namibia",
  "Other",
] as const;

export const STAGES: { value: IdeaStage; label: string }[] = [
  { value: "IDEA", label: "Idea Stage" },
  { value: "MVP", label: "MVP" },
  { value: "EARLY_TRACTION", label: "Early Traction" },
  { value: "GROWTH", label: "Growth" },
  { value: "SCALING", label: "Scaling" },
];

export const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "FOUNDER", label: "Founder", description: "Share your startup ideas and connect with investors" },
  { value: "INVESTOR", label: "Investor", description: "Discover promising African startups to invest in" },
  { value: "DEVELOPER", label: "Developer", description: "Find exciting projects to work on" },
  { value: "MENTOR", label: "Mentor", description: "Guide the next generation of African entrepreneurs" },
];
