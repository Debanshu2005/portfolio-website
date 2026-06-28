import type { MarketplaceStats } from "@/lib/types";

const MARKETPLACE_EXTENSION_ID = "debanshu2005.code-janitor";
const MARKETPLACE_API_URL =
  "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=7.2-preview.1";

type MarketplaceStatistic = {
  statisticName: string;
  value: number;
};

type MarketplaceExtension = {
  displayName: string;
  extensionName: string;
  lastUpdated: string;
  publisher: {
    publisherName: string;
  };
  statistics?: MarketplaceStatistic[];
};

type MarketplaceResponse = {
  results?: Array<{
    extensions?: MarketplaceExtension[];
  }>;
};

function statValue(
  statistics: MarketplaceStatistic[] | undefined,
  statisticName: string
) {
  return (
    statistics?.find((statistic) => statistic.statisticName === statisticName)
      ?.value ?? 0
  );
}

export async function fetchMarketplaceStats(
  extensionId = MARKETPLACE_EXTENSION_ID
): Promise<MarketplaceStats> {
  const response = await fetch(MARKETPLACE_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json;api-version=7.2-preview.1",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filters: [
        {
          criteria: [
            {
              filterType: 7,
              value: extensionId,
            },
          ],
        },
      ],
      flags: 914,
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Marketplace API returned ${response.status}`);
  }

  const marketplaceData = (await response.json()) as MarketplaceResponse;
  const extension = marketplaceData.results?.[0]?.extensions?.[0];

  if (!extension) {
    throw new Error(`Marketplace extension not found: ${extensionId}`);
  }

  const publisherName = extension.publisher.publisherName;
  const extensionName = extension.extensionName;
  const installs = Math.round(statValue(extension.statistics, "install"));
  const downloads = Math.round(statValue(extension.statistics, "downloadCount"));

  return {
    displayName: extension.displayName,
    publisherName,
    extensionName,
    totalAcquisitions: installs + downloads,
    installs,
    downloads,
    updates: Math.round(statValue(extension.statistics, "updateCount")),
    rating: statValue(extension.statistics, "averagerating"),
    ratingCount: Math.round(statValue(extension.statistics, "ratingcount")),
    lastUpdated: extension.lastUpdated,
    marketplaceUrl: `https://marketplace.visualstudio.com/items?itemName=${publisherName}.${extensionName}`,
  };
}
