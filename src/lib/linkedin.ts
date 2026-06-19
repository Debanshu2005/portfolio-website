import type { LinkedInData } from "./types";

// ─── Default LinkedIn Data ────────────────────────────────────
// This data is loaded at build time from /data/linkedin.json
// To update: edit the JSON file and push to main — site rebuilds automatically

const defaultLinkedInData: LinkedInData = {
  lastUpdated: new Date().toISOString(),
  experience: [],
  education: [],
  certifications: [],
  achievements: [],
};

export function getLinkedInData(): LinkedInData {
  try {
    // Dynamic import of the JSON data
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require("../../data/linkedin.json") as LinkedInData;
    return data;
  } catch {
    console.warn("linkedin.json not found, using default data");
    return defaultLinkedInData;
  }
}

export function formatLastUpdated(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
