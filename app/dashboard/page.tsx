import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { IdeaFeed } from "@/components/dashboard/idea-feed";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Feed - AfriFound",
  description: "Discover innovative African startup ideas",
};

function FeedLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <Suspense fallback={<FeedLoading />}>
      <IdeaFeed currentUserId={user?.id} />
    </Suspense>
  );
}
