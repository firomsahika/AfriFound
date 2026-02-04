"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const rawData = {
    name: formData.get("name") as string,
    bio: (formData.get("bio") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    country: (formData.get("country") as string) || undefined,
    website: (formData.get("website") as string) || "",
    linkedin: (formData.get("linkedin") as string) || "",
    twitter: (formData.get("twitter") as string) || undefined,
    skills: JSON.parse((formData.get("skills") as string) || "[]"),
    interests: JSON.parse((formData.get("interests") as string) || "[]"),
    company: (formData.get("company") as string) || undefined,
    companyRole: (formData.get("companyRole") as string) || undefined,
    investmentFocus: JSON.parse((formData.get("investmentFocus") as string) || "[]"),
    portfolioSize: (formData.get("portfolioSize") as string) || undefined,
    investmentRange: (formData.get("investmentRange") as string) || undefined,
  };

  const validated = profileSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  await db.user.update({
    where: { id: user.id },
    data: validated.data,
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return { success: true, message: "Profile updated successfully" };
}

export async function updateSettings(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const settings = {
    emailNotifications: formData.get("emailNotifications") === "true",
    pushNotifications: formData.get("pushNotifications") === "true",
    weeklyDigest: formData.get("weeklyDigest") === "true",
    profileVisibility: formData.get("profileVisibility") as string,
    showEmail: formData.get("showEmail") === "true",
  };

  await db.user.update({
    where: { id: user.id },
    data: settings,
  });

  revalidatePath("/dashboard/settings");

  return { success: true, message: "Settings updated successfully" };
}

export async function getUserProfile(userId: string) {
  const profile = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      bio: true,
      location: true,
      country: true,
      website: true,
      linkedin: true,
      twitter: true,
      skills: true,
      interests: true,
      company: true,
      companyRole: true,
      investmentFocus: true,
      portfolioSize: true,
      investmentRange: true,
      showEmail: true,
      profileVisibility: true,
      createdAt: true,
      _count: {
        select: {
          ideas: { where: { status: "PUBLISHED" } },
        },
      },
    },
  });

  if (!profile) {
    return null;
  }

  // Hide email if user settings say so
  if (!profile.showEmail) {
    return { ...profile, email: null };
  }

  return profile;
}

export async function getNotifications(page = 1, pageSize = 20) {
  const user = await getCurrentUser();

  if (!user) {
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const skip = (page - 1) * pageSize;

  const [notifications, total] = await Promise.all([
    db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.notification.count({ where: { userId: user.id } }),
  ]);

  return {
    items: notifications,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function markNotificationAsRead(notificationId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  await db.notification.update({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser();

  if (!user) {
    return { ideassuccess: false, error: "You must be logged in" };
  }

  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function getUnreadNotificationCount() {
  const user = await getCurrentUser();

  if (!user) {
    return 0;
  }

  return db.notification.count({
    where: {
      userId: user.id,
      read: false,
    },
  });
}

export async function getUserAnalytics() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Get user's ideas with aggregated stats
  const ideas = await db.idea.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      views: true,
      createdAt: true,
      status: true,
      _count: {
        select: {
          likes: true,
          saves: true,
          comments: true,
        },
      },
    },
  });

  const totalViews = ideas.reduce((sum, idea) => sum + idea.views, 0);
  const totalLikes = ideas.reduce((sum, idea) => sum + idea._count.likes, 0);
  const totalSaves = ideas.reduce((sum, idea) => sum + idea._count.saves, 0);
  const totalComments = ideas.reduce((sum, idea) => sum + idea._count.comments, 0);

  // Get views by day for the last 30 days (simplified - in production you'd track this separately)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentIdeas = ideas.filter(
    (idea) => new Date(idea.createdAt) >= thirtyDaysAgo
  );

  // Get messages received count
  const messagesReceived = await db.message.count({
    where: { receiverId: user.id },
  });

  return {
    totalIdeas: ideas.length,
    publishedIdeas: ideas.filter((i) => i.status === "PUBLISHED").length,
    draftIdeas: ideas.filter((i) => i.status === "DRAFT").length,
    totalViews,
    totalLikes,
    totalSaves,
    totalComments,
    messagesReceived,
    ideas: ideas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      views: idea.views,
      likes: idea._count.likes,
      saves: idea._count.saves,
      comments: idea._count.comments,
      createdAt: idea.createdAt,
    })),
    recentActivity: recentIdeas.length,
  };
}
