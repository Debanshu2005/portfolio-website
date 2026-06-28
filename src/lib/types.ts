// ─── GitHub Types ─────────────────────────────────────────────

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  license: {
    name: string;
    spdx_id: string;
  } | null;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface LanguageBreakdown {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface CommitEntry {
  sha: string;
  message: string;
  date: string;
  repo: string;
  url: string;
}

export interface GitHubStats {
  profile: GitHubProfile;
  totalStars: number;
  totalCommitsThisYear: number;
  topLanguage: string;
  repoCount: number;
}

// Marketplace Types

export interface MarketplaceStats {
  displayName: string;
  publisherName: string;
  extensionName: string;
  totalAcquisitions: number;
  installs: number;
  downloads: number;
  updates: number;
  rating: number;
  ratingCount: number;
  lastUpdated: string;
  marketplaceUrl: string;
}

// ─── LinkedIn Types ───────────────────────────────────────────

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface LinkedInData {
  lastUpdated: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
}

// ─── Featured Project Config ──────────────────────────────────

export interface FeaturedProject {
  repoName: string;
  longDescription: string;
  techStack: string[];
  highlights?: string[];
}

// ─── API Response Types ───────────────────────────────────────

export interface GitHubApiResponse<T> {
  data: T;
  stale: boolean;
  error?: string;
  timestamp: string;
}
