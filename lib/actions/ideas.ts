"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ideaSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { IdeaFilters, IdeaStage, IdeaStatus } from "@/lib/types";

export async function createIdea(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in to create an idea" };
  }

  const rawData = {
    title: formData.get("title") as string,
    tagline: formData.get("tagline") as string,
    problem: formData.get("problem") as string,
    solution: formData.get("solution") as string,
    description: (formData.get("description") as string) || undefined,
    industry: formData.get("industry") as string,
    country: formData.get("country") as string,
    stage: formData.get("stage") as IdeaStage,
    fundingGoal: formData.get("fundingGoal")
      ? Number(formData.get("fundingGoal"))
      : undefined,
    equity: formData.get("equity") ? Number(formData.get("equity")) : undefined,
    teamSize: Number(formData.get("teamSize")) || 1,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    coverImage: (formData.get("coverImage") as string) || "",
    pitchDeck: (formData.get("pitchDeck") as string) || "",
    website: (formData.get("website") as string) || "",
    status: (formData.get("status") as IdeaStatus) || "DRAFT",
  };

  const validated = ideaSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const idea = await db.idea.create({
    data: {
      ...validated.data,
      userId: user.id,
      publishedAt: validated.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-ideas");

  return { success: true, data: idea };
}

export async function updateIdea(ideaId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const existing = await db.idea.findUnique({
    where: { id: ideaId },
  });

  if (!existing || existing.userId !== user.id) {
    return { success: false, error: "Idea not found or access denied" };
  }

  const rawData = {
    title: formData.get("title") as string,
    tagline: formData.get("tagline") as string,
    problem: formData.get("problem") as string,
    solution: formData.get("solution") as string,
    description: (formData.get("description") as string) || undefined,
    industry: formData.get("industry") as string,
    country: formData.get("country") as string,
    stage: formData.get("stage") as IdeaStage,
    fundingGoal: formData.get("fundingGoal")
      ? Number(formData.get("fundingGoal"))
      : undefined,
    equity: formData.get("equity") ? Number(formData.get("equity")) : undefined,
    teamSize: Number(formData.get("teamSize")) || 1,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    coverImage: (formData.get("coverImage") as string) || "",
    pitchDeck: (formData.get("pitchDeck") as string) || "",
    website: (formData.get("website") as string) || "",
    status: (formData.get("status") as IdeaStatus) || existing.status,
  };

  const validated = ideaSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const idea = await db.idea.update({
    where: { id: ideaId },
    data: {
      ...validated.data,
      publishedAt:
        validated.data.status === "PUBLISHED" && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-ideas");

  return { success: true, data: idea };
}

export async function deleteIdea(ideaId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const idea = await db.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea || idea.userId !== user.id) {
    return { success: false, error: "Idea not found or access denied" };
  }

  await db.idea.delete({
    where: { id: ideaId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-ideas");

  return { success: true };
}

export async function getIdeas(filters: IdeaFilters = {}, page = 1, pageSize = 10) {
  const user = await getCurrentUser();
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (filters.industry) {
    where.industry = filters.industry;
  }

  if (filters.country) {
    where.country = filters.country;
  }

  if (filters.stage) {
    where.stage = filters.stage;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { tagline: { contains: filters.search, mode: "insensitive" } },
      { problem: { contains: filters.search, mode: "insensitive" } },
      { solution: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.userId) {
    where.userId = filters.userId;
    delete where.status; // Show all statuses for user's own ideas
    if (filters.status) {
      where.status = filters.status;
    }
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };

  if (filters.sort === "trending") {
    orderBy = { views: "desc" };
  } else if (filters.sort === "hot") {
    orderBy = { likes: { _count: "desc" } };
  }

  const [ideas, total] = await Promise.all([
    db.idea.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            company: true,
            country: true,
          },
        },
        _count: {
          select: {
            likes: true,
            saves: true,
            comments: true,
          },
        },
        ...(user
          ? {
              likes: {
                where: { userId: user.id },
                select: { id: true },
              },
              saves: {
                where: { userId: user.id },
                select: { id: true },
              },
            }
          : {}),
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    db.idea.count({ where }),
  ]);

  const formattedIdeas = ideas.map((idea) => ({
    ...idea,
    isLiked: user ? idea.likes?.length > 0 : false,
    isSaved: user ? idea.saves?.length > 0 : false,
    likes: undefined,
    saves: undefined,
  }));

  return {
    items: formattedIdeas,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getIdeaById(ideaId: string) {
  const user = await getCurrentUser();

  const idea = await db.idea.findUnique({
    where: { id: ideaId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          bio: true,
          company: true,
          country: true,
          linkedin: true,
          twitter: true,
          website: true,
        },
      },
      _count: {
        select: {
          likes: true,
          saves: true,
          comments: true,
        },
      },
      comments: {
        where: { parentId: null },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  role: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      ...(user
        ? {
            likes: {
              where: { userId: user.id },
              select: { id: true },
            },
            saves: {
              where: { userId: user.id },
              select: { id: true },
            },
          }
        : {}),
    },
  });

  if (!idea) {
    return null;
  }

  // Increment views
  await db.idea.update({
    where: { id: ideaId },
    data: { views: { increment: 1 } },
  });

  return {
    ...idea,
    isLiked: user ? idea.likes?.length > 0 : false,
    isSaved: user ? idea.saves?.length > 0 : false,
    likes: undefined,
    saves: undefined,
  };
}

export async function toggleLike(ideaId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const existing = await db.like.findUnique({
    where: {
      userId_ideaId: {
        userId: user.id,
        ideaId,
      },
    },
  });

  if (existing) {
    await db.like.delete({
      where: { id: existing.id },
    });
    return { success: true, liked: false };
  }

  await db.like.create({
    data: {
      userId: user.id,
      ideaId,
    },
  });

  // Create notification for idea owner
  const idea = await db.idea.findUnique({
    where: { id: ideaId },
    select: { userId: true, title: true },
  });

  if (idea && idea.userId !== user.id) {
    await db.notification.create({
      data: {
        type: "LIKE",
        title: "New Like",
        message: `${user.name} liked your idea "${idea.title}"`,
        userId: idea.userId,
        data: { ideaId, userId: user.id },
      },
    });
  }

  revalidatePath("/dashboard");

  return { success: true, liked: true };
}

export async function toggleSave(ideaId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const existing = await db.save.findUnique({
    where: {
      userId_ideaId: {
        userId: user.id,
        ideaId,
      },
    },
  });

  if (existing) {
    await db.save.delete({
      where: { id: existing.id },
    });
    revalidatePath("/dashboard/saved");
    return { success: true, saved: false };
  }

  await db.save.create({
    data: {
      userId: user.id,
      ideaId,
    },
  });

  revalidatePath("/dashboard/saved");

  return { success: true, saved: true };
}

export async function getSavedIdeas(page = 1, pageSize = 10) {
  const user = await getCurrentUser();

  if (!user) {
    return { items: [], total: 0, , pageSize, totalPages: 0 };
  }

  const skip = (page - 1) * pageSize;

  const [saves, total] = await Promise.all([
    db.save.findMany({
      where: { userId: user.id },
      include: {
        idea: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                company: true,
                country: true,
              },
            },
            _count: {
              select: {
                likes: true,
                saves: true,
                comments: true,
              },
            },
            likes: {
              where: { userId: user.id },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.save.count({ where: { userId: user.id } }),
  ]);

  const ideas = saves.map((save) => ({
    ...save.idea,
    isLiked: save.idea.likes.length > 0,
    isSaved: true,
    likes: undefined,
  }));

  return {
    items: ideas,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function addComment(ideaId: string, content: string, parentId?: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const comment = await db.comment.create({
    data: {
      content,
      userId: user.id,
      ideaId,
      parentId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
        },
      },
    },
  });

  // Create notification for idea owner
  const idea = await db.idea.findUnique({
    where: { id: ideaId },
    select: { userId: true, title: true },
  });

  if (idea && idea.userId !== user.id) {
    await db.notification.create({
      data: {
        type: "COMMENT",
        title: "New Comment",
        message: `${user.name} commented on your idea "${idea.title}"`,
        userId: idea.userId,
        data: { ideaId, commentId: comment.id },
      },
    });
  }

  revalidatePath("/dashboard");

  return { success: true, data: comment };
}
