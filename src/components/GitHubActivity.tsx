"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { GitCommit } from "lucide-react";
import { fadeUpVariants } from "@/lib/motion";
import type { ContributionData, LanguageBreakdown, CommitEntry } from "@/lib/types";
import { SkeletonHeatmap } from "./SkeletonLoader";

// ─── Contribution Heatmap ─────────────────────────────────────

function ContributionHeatmap({
  data,
  isLoading,
}: {
  data: ContributionData | null;
  isLoading: boolean;
}) {
  const maxCount = useMemo(() => {
    let max = 0;
    if (!data) return 1;
    data.weeks.forEach((w) =>
      w.contributionDays.forEach((d) => {
        if (d.contributionCount > max) max = d.contributionCount;
      })
    );
    return max || 1;
  }, [data]);

  if (isLoading || !data) return <SkeletonHeatmap />;

  const getColor = (count: number) => {
    if (count === 0) return "#0D1B2A";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "#0a3d2a";
    if (intensity < 0.5) return "#0f6b3f";
    if (intensity < 0.75) return "#1aa34a";
    return "#00FF88";
  };

  // Take last 52 weeks
  const weeks = data.weeks.slice(-52);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-text-muted">
          {data.totalContributions} contributions in the last year
        </span>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-[2px]"
              style={{
                backgroundColor: getColor(Math.round(intensity * maxCount)),
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-[3px]" style={{ minWidth: "max-content" }}>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {week.contributionDays.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className="heatmap-cell w-3 h-3 relative group"
                  style={{ backgroundColor: getColor(day.contributionCount) }}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-[4px] bg-space-surface border border-border-space text-xs font-mono text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {day.contributionCount} on{" "}
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Language Donut Chart ─────────────────────────────────────

function LanguageDonut({
  languages,
  isLoading,
}: {
  languages: LanguageBreakdown[];
  isLoading: boolean;
}) {
  if (isLoading || languages.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="font-mono text-xs text-text-muted">Loading...</span>
      </div>
    );
  }

  const chartData = languages.slice(0, 6).map((l) => ({
    name: l.name,
    value: l.percentage,
    color: l.color,
  }));

  return (
    <div className="flex items-center gap-6">
      <div className="w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0D1B2A",
                border: "1px solid #1E2D3D",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono, monospace",
              }}
              itemStyle={{ color: "#E8ECF1" }}
              formatter={(value) => [`${Number(value ?? 0)}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        {chartData.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="font-mono text-text-muted truncate">
              {lang.name}
            </span>
            <span className="font-mono text-text-primary ml-auto shrink-0">
              {lang.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Commit Feed ──────────────────────────────────────────────

function CommitFeed({
  commits,
  isLoading,
}: {
  commits: CommitEntry[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-6 rounded-[4px]" />
        ))}
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <p className="font-mono text-xs text-text-muted">
        No recent commits available
      </p>
    );
  }

  const formatCommitDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  return (
    <div className="space-y-1 font-mono text-xs">
      {commits.slice(0, 10).map((commit, idx) => (
        <motion.div
          key={commit.sha}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.03 }}
          className="flex items-start gap-2 py-1.5 px-2 rounded-[4px] hover:bg-space-surface-hover transition-colors group"
        >
          <GitCommit
            size={14}
            className="text-accent-green shrink-0 mt-0.5"
          />
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted group-hover:text-text-primary transition-colors truncate flex-1 min-w-0"
          >
            <span className="text-accent-cyan">[{commit.repo}]</span>{" "}
            {commit.message}
          </a>
          <span className="text-text-muted shrink-0 opacity-60">
            {formatCommitDate(commit.date)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

interface GitHubActivityProps {
  contributions: ContributionData | null;
  languages: LanguageBreakdown[];
  commits: CommitEntry[];
  isLoading: boolean;
}

export default function GitHubActivity({
  contributions,
  languages,
  commits,
  isLoading,
}: GitHubActivityProps) {
  return (
    <div className="space-y-8">
      {/* Contribution Heatmap */}
      <motion.div
        variants={fadeUpVariants}
        className="p-6 border border-border-space rounded-[6px] bg-space-surface"
      >
        <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">
          {"// contribution_calendar"}
        </h3>
        <ContributionHeatmap data={contributions} isLoading={isLoading} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 border border-border-space rounded-[6px] bg-space-surface"
        >
          <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">
            {"// language_breakdown"}
          </h3>
          <LanguageDonut languages={languages} isLoading={isLoading} />
        </motion.div>

        {/* Recent Commits */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 border border-border-space rounded-[6px] bg-space-surface"
        >
          <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">
            {"// recent_commits"}
          </h3>
          <CommitFeed commits={commits} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}
