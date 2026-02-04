"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getConversations() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const conversations = await db.conversation.findMany({
    where: {
      participants: {
        some: { userId: user.id },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              company: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get unread counts
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await db.message.count({
        where: {
          conversationId: conv.id,
          receiverId: user.id,
          read: false,
        },
      });

      const otherParticipant = conv.participants.find(
        (p) => p.user.id !== user.id
      );

      return {
        ...conv,
        unreadCount,
        otherUser: otherParticipant?.user,
        lastMessage: conv.messages[0] || null,
      };
    })
  );

  return conversationsWithUnread;
}

export async function getOrCreateConversation(otherUserId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  if (otherUserId === user.id) {
    return { success: false, error: "Cannot message yourself" };
  }

  // Check if conversation already exists
  const existingConversation = await db.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: user.id } } },
        { participants: { some: { userId: otherUserId } } },
      ],
    },
  });

  if (existingConversation) {
    return { success: true, conversationId: existingConversation.id };
  }

  // Create new conversation
  const conversation = await db.conversation.create({
    data: {
      participants: {
        create: [{ userId: user.id }, { userId: otherUserId }],
      },
    },
  });

  revalidatePath("/dashboard/messages");

  return { success: true, conversationId: conversation.id };
}

export async function getMessages(conversationId: string, page = 1, pageSize = 50) {
  const user = await getCurrentUser();

  if (!user) {
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }

  // Verify user is part of conversation
  const participant = await db.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        userId: user.id,
        conversationId,
      },
    },
  });

  if (!participant) {
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const skip = (page - 1) * pageSize;

  const [messages, total] = await Promise.all([
    db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: pageSize,
    }),
    db.message.count({ where: { conversationId } }),
  ]);

  // Mark messages as read
  await db.message.updateMany({
    where: {
      conversationId,
      receiverId: user.id,
      read: false,
    },
    data: { read: true },
  });

  // Update last read timestamp
  await db.conversationParticipant.update({
    where: {
      userId_conversationId: {
        userId: user.id,
        conversationId,
      },
    },
    data: { lastReadAt: new Date() },
  });

  return {
    items: messages,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function sendMessage(conversationId: string, content: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  if (!content.trim()) {
    return { success: false, error: "Message cannot be empty" };
  }

  // Get the other participant
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!conversation) {
    return { success: false, error: "Conversation not found" };
  }

  const otherParticipant = conversation.participants.find(
    (p) => p.user.id !== user.id
  );

  if (!otherParticipant) {
    return { success: false, error: "Invalid conversation" };
  }

  const message = await db.message.create({
    data: {
      content: content.trim(),
      senderId: user.id,
      receiverId: otherParticipant.user.id,
      conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
        },
      },
    },
  });

  // Update conversation timestamp
  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Create notification
  await db.notification.create({
    data: {
      type: "MESSAGE",
      title: "New Message",
      message: `${user.name} sent you a message`,
      userId: otherParticipant.user.id,
      data: { conversationId, messageId: message.id },
    },
  });

  revalidatePath("/dashboard/messages");

  return { success: true, data: message };
}

export async function getUnreadMessageCount() {
  const user = await getCurrentUser();

  if (!user) {
    return 0;
  }

  return db.message.count({
    where: {
      receiverId: user.id,
      read: false,
    },
  });
}
