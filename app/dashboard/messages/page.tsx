"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, Loader2, Search, CheckCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  company?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  id: string;
  updatedAt: string;
  otherUser: User;
  lastMessage: Message | null;
  unreadCount: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("conversation");

  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    initialConversationId
  );
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const {
    data: conversations = [],
    mutate: mutateConversations,
    isLoading: loadingConversations,
  } = useSWR<Conversation[]>("/api/conversations", fetcher, {
    refreshInterval: 5000,
  });

  // Fetch messages for selected conversation
  const { data: messagesData, mutate: mutateMessages } = useSWR(
    selectedConversation
      ? `/api/messages?conversationId=${selectedConversation}`
      : null,
    fetcher,
    { refreshInterval: 3000 }
  );

  const messages: Message[] = messagesData?.items || [];

  // Determine current user from messages
  useEffect(() => {
    if (messages.length > 0 && conversations.length > 0) {
      const selectedConv = conversations.find((c) => c.id === selectedConversation);
      if (selectedConv && messages[0]) {
        const otherId = selectedConv.otherUser?.id;
        const firstMsg = messages[0];
        setCurrentUserId(firstMsg.senderId === otherId ? firstMsg.receiverId : firstMsg.senderId);
      }
    }
  }, [messages, conversations, selectedConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    const content = messageInput;
    setMessageInput("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content,
        }),
      });

      if (res.ok) {
        mutateMessages();
        mutateConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageInput(content);
    }

    setIsSending(false);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-full flex-shrink-0 border-r border-border bg-card md:w-80">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/30 pl-9"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          {loadingConversations ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start a conversation by contacting a founder
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/50",
                    selectedConversation === conv.id && "bg-secondary"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.otherUser?.avatar || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {conv.otherUser?.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium text-foreground">
                        {conv.otherUser?.name || "Unknown"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ""}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium",
                          conv.otherUser?.role === "INVESTOR"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        {conv.otherUser?.role?.charAt(0)}
                        {conv.otherUser?.role?.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="hidden flex-1 flex-col md:flex">
        {selectedConversation && selectedConv ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConv.otherUser?.avatar || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {selectedConv.otherUser?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {selectedConv.otherUser?.name || "Unknown"}
                  </p>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      selectedConv.otherUser?.role === "INVESTOR"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {selectedConv.otherUser?.role?.charAt(0)}
                    {selectedConv.otherUser?.role?.slice(1).toLowerCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedConv.otherUser?.company || ""}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-end gap-2",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar || undefined} />
                            <AvatarFallback className="bg-primary/20 text-xs text-primary">
                              {message.sender?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2.5",
                            isOwn
                              ? "rounded-br-md bg-primary text-primary-foreground"
                              : "rounded-bl-md bg-secondary text-foreground"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={cn(
                              "mt-1 flex items-center justify-end gap-1 text-[10px]",
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            <span>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isOwn &&
                              (message.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-3"
              >
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-secondary/30"
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  disabled={!messageInput.trim() || isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Select a conversation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
