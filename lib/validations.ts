import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["FOUNDER", "INVESTOR", "DEVELOPER", "MENTOR"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(200, "Tagline must be less than 200 characters"),
  problem: z.string().min(20, "Problem must be at least 20 characters"),
  solution: z.string().min(20, "Solution must be at least 20 characters"),
  description: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  country: z.string().min(1, "Country is required"),
  stage: z.enum(["IDEA", "MVP", "EARLY_TRACTION", "GROWTH", "SCALING"]),
  fundingGoal: z.number().positive().optional(),
  equity: z.number().min(0).max(100).optional(),
  teamSize: z.number().int().positive().default(1),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
  coverImage: z.string().url().optional().or(z.literal("")),
  pitchDeck: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  company: z.string().optional(),
  companyRole: z.string().optional(),
  investmentFocus: z.array(z.string()).optional(),
  portfolioSize: z.string().optional(),
  investmentRange: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  receiverId: z.string().cuid("Invalid receiver ID"),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
  ideaId: z.string().cuid("Invalid idea ID"),
  parentId: z.string().cuid().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type IdeaInput = z.infer<typeof ideaSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
