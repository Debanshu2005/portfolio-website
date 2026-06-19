import type {
  GitHubProfile,
  GitHubRepo,
  ContributionData,
  LanguageBreakdown,
  CommitEntry,
  GitHubStats,
} from "./types";
import { languageColors } from "./motion";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Debanshu2005";
const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const fallbackRepos: GitHubRepo[] = [
  {
    id: 1062345166,
    name: "code-janitor",
    full_name: `${GITHUB_USERNAME}/code-janitor`,
    description:
      "VS Code extension for autocorrect and syntax fixing across multiple programming languages.",
    html_url: `https://github.com/${GITHUB_USERNAME}/code-janitor`,
    homepage: null,
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["vscode-extension", "developer-tools"],
    created_at: "",
    updated_at: "",
    pushed_at: "2026-06-19T00:00:00Z",
    fork: false,
    archived: false,
    license: null,
  },
  {
    id: 1253528524,
    name: "DronePy",
    full_name: `${GITHUB_USERNAME}/DronePy`,
    description:
      "Python drone-control work around autonomous operation, telemetry, and ArduPilot/MAVLink integration.",
    html_url: `https://github.com/${GITHUB_USERNAME}/DronePy`,
    homepage: null,
    language: "Python",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["drone", "ardupilot", "mavlink"],
    created_at: "",
    updated_at: "",
    pushed_at: "2026-06-19T00:00:00Z",
    fork: false,
    archived: false,
    license: null,
  },
  {
    id: 1135601712,
    name: "Pi_Buddy",
    full_name: `${GITHUB_USERNAME}/Pi_Buddy`,
    description:
      "Raspberry Pi based physical AI companion with speech and hardware-control experiments.",
    html_url: `https://github.com/${GITHUB_USERNAME}/Pi_Buddy`,
    homepage: null,
    language: "Python",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["raspberry-pi", "ai", "hardware"],
    created_at: "",
    updated_at: "",
    pushed_at: "2026-06-19T00:00:00Z",
    fork: false,
    archived: false,
    license: null,
  },
  {
    id: 1049293422,
    name: "Rail_QR",
    full_name: `${GITHUB_USERNAME}/Rail_QR`,
    description:
      "QR workflow for railway fitting management, engraving, inventory checks, and risk tracking.",
    html_url: `https://github.com/${GITHUB_USERNAME}/Rail_QR`,
    homepage: null,
    language: "Python",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["qr-code", "inventory", "railway"],
    created_at: "",
    updated_at: "",
    pushed_at: "2026-06-19T00:00:00Z",
    fork: false,
    archived: false,
    license: null,
  },
];

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) {
    h["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }
  return h;
}

// ─── REST API Helpers ─────────────────────────────────────────

export async function fetchUserProfile(): Promise<GitHubProfile> {
  const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
    headers: headers(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${perPage}&page=${page}`,
      {
        headers: headers(),
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) {
      console.warn(
        `GitHub repos fetch failed: ${res.status}. Using fallback project data.`
      );
      return fallbackRepos;
    }
    const repos: GitHubRepo[] = await res.json();
    allRepos.push(...repos);
    if (repos.length < perPage) break;
    page++;
  }

  // Filter out forks and archived
  return allRepos.filter((r) => !r.fork && !r.archived);
}

export async function fetchRepoLanguages(
  repoName: string
): Promise<Record<string, number>> {
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
    {
      headers: headers(),
      next: { revalidate: 300 },
    }
  );
  if (!res.ok) return {};
  return res.json();
}

// ─── GraphQL API Helpers ──────────────────────────────────────

export async function fetchContributions(): Promise<ContributionData> {
  if (!GITHUB_TOKEN) {
    return { totalContributions: 0, weeks: [] };
  }

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        username: GITHUB_USERNAME,
        from: oneYearAgo.toISOString(),
        to: now.toISOString(),
      },
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error("GitHub GraphQL failed:", res.status);
    return { totalContributions: 0, weeks: [] };
  }

  const json = await res.json();
  const calendar =
    json.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    return { totalContributions: 0, weeks: [] };
  }

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
  };
}

export async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  if (!GITHUB_TOKEN) return [];

  const query = `
    query($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              primaryLanguage { name }
              stargazerCount
              forkCount
              updatedAt
              pushedAt
              repositoryTopics(first: 10) {
                nodes { topic { name } }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username: GITHUB_USERNAME },
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const nodes = json.data?.user?.pinnedItems?.nodes || [];

  return nodes.map(
    (n: {
      name: string;
      description: string | null;
      url: string;
      homepageUrl: string | null;
      primaryLanguage: { name: string } | null;
      stargazerCount: number;
      forkCount: number;
      updatedAt: string;
      pushedAt: string;
      repositoryTopics: { nodes: { topic: { name: string } }[] };
    }) => ({
      id: 0,
      name: n.name,
      full_name: `${GITHUB_USERNAME}/${n.name}`,
      description: n.description,
      html_url: n.url,
      homepage: n.homepageUrl,
      language: n.primaryLanguage?.name || null,
      stargazers_count: n.stargazerCount,
      forks_count: n.forkCount,
      topics: n.repositoryTopics?.nodes?.map(
        (t: { topic: { name: string } }) => t.topic.name
      ) || [],
      created_at: "",
      updated_at: n.updatedAt,
      pushed_at: n.pushedAt,
      fork: false,
      archived: false,
      license: null,
    })
  );
}

// ─── Recent Commits (across repos) ───────────────────────────

export async function fetchRecentCommits(
  repos: GitHubRepo[],
  limit = 10
): Promise<CommitEntry[]> {
  const topRepos = repos
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    )
    .slice(0, 8);

  const commitPromises = topRepos.map(async (repo) => {
    try {
      const res = await fetch(
        `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=3`,
        {
          headers: headers(),
          next: { revalidate: 300 },
        }
      );
      if (!res.ok) return [];
      const commits = await res.json();
      return commits.map(
        (c: {
          sha: string;
          commit: { message: string; author: { date: string } };
          html_url: string;
        }) => ({
          sha: c.sha,
          message: c.commit.message.split("\n")[0],
          date: c.commit.author.date,
          repo: repo.name,
          url: c.html_url,
        })
      );
    } catch {
      return [];
    }
  });

  const results = await Promise.all(commitPromises);
  return results
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// ─── Aggregate Language Data ─────────────────────────────────

export async function aggregateLanguages(
  repos: GitHubRepo[]
): Promise<LanguageBreakdown[]> {
  const topRepos = repos
    .filter((r) => r.language)
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    )
    .slice(0, 15);

  const langMap: Record<string, number> = {};

  const promises = topRepos.map(async (repo) => {
    const langs = await fetchRepoLanguages(repo.name);
    Object.entries(langs).forEach(([lang, bytes]) => {
      langMap[lang] = (langMap[lang] || 0) + bytes;
    });
  });

  await Promise.all(promises);

  if (Object.keys(langMap).length === 0) {
    topRepos.forEach((repo) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });
  }

  const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
  if (totalBytes === 0) return [];

  return Object.entries(langMap)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      color: languageColors[name] || "#8892A4",
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10);
}

// ─── Compute Stats ────────────────────────────────────────────

export async function computeStats(
  repos: GitHubRepo[],
  contributions: ContributionData
): Promise<GitHubStats> {
  const profile = await fetchUserProfile();
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  // Count languages
  const langCount: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  });
  const topLanguage =
    Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    profile,
    totalStars,
    totalCommitsThisYear: contributions.totalContributions,
    topLanguage,
    repoCount: repos.length,
  };
}
