import { NextResponse } from "next/server";
import {
  fetchUserProfile,
  fetchRepos,
  fetchContributions,
  aggregateLanguages,
  fetchRecentCommits,
  computeStats,
} from "@/lib/github";

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "profile";

  try {
    switch (type) {
      case "profile": {
        const profile = await fetchUserProfile();
        return NextResponse.json({
          data: profile,
          stale: false,
          timestamp: new Date().toISOString(),
        });
      }

      case "repos": {
        const repos = await fetchRepos();
        return NextResponse.json({
          data: repos,
          stale: false,
          timestamp: new Date().toISOString(),
        });
      }

      case "contributions": {
        const contributions = await fetchContributions();
        return NextResponse.json({
          data: contributions,
          stale: false,
          timestamp: new Date().toISOString(),
        });
      }

      case "languages": {
        const repos = await fetchRepos();
        const languages = await aggregateLanguages(repos);
        return NextResponse.json({
          data: languages,
          stale: false,
          timestamp: new Date().toISOString(),
        });
      }

      case "commits": {
        const repos = await fetchRepos();
        const commits = await fetchRecentCommits(repos);
        return NextResponse.json({
          data: commits,
          stale: false,
          timestamp: new Date().toISOString(),
        });
      }

      case "stats": {
        const [repos, contributions] = await Promise.all([
          fetchRepos(),
          fetchContributions(),
        ]);
        const stats = await computeStats(repos, contributions);
        return NextResponse.json({
          data: stats,
          stale: false,
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(`GitHub API error (type=${type}):`, error);
    return NextResponse.json(
      {
        data: null,
        stale: true,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
