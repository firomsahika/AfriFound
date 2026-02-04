import { NextRequest, NextResponse } from "next/server";
import { getIdeas } from "@/lib/actions/ideas";
import type { IdeaFilters, IdeaStage } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: IdeaFilters = {
    industry: searchParams.get("industry") || undefined,
    country: searchParams.get("country") || undefined,
    stage: (searchParams.get("stage") as IdeaStage) || undefined,
    search: searchParams.get("search") || undefined,
    sort: (searchParams.get("sort") as "trending" | "recent" | "hot") || "recent",
  };

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  try {
    const result = await getIdeas(filters, page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}
