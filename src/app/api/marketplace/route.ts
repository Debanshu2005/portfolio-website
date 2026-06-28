import { NextResponse } from "next/server";
import { fetchMarketplaceStats } from "@/lib/marketplace";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const extensionId =
    searchParams.get("extensionId") || "debanshu2005.code-janitor";

  try {
    const stats = await fetchMarketplaceStats(extensionId);

    return NextResponse.json({
      data: stats,
      stale: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Marketplace API error (extensionId=${extensionId}):`, error);

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
