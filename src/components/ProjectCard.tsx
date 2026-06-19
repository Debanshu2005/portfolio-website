"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Star, ExternalLink, Clock } from "lucide-react";
import { fadeUpVariants, languageColors } from "@/lib/motion";
import type { GitHubRepo, FeaturedProject } from "@/lib/types";

interface ProjectCardProps {
  repo: GitHubRepo;
  featured?: FeaturedProject;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function isRecentlyActive(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000; // 30 days
}

export default function ProjectCard({ repo, featured }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const langColor = repo.language
    ? languageColors[repo.language] || "#8892A4"
    : "#8892A4";
  const isActive = isRecentlyActive(repo.pushed_at);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUpVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className="group relative glass hover:border-accent-cyan/50 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] transition-all duration-300"
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
          </span>
          <span className="font-mono text-[10px] text-accent-green uppercase tracking-wider">
            Live
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Repo name */}
        <h3 className="font-display text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">
          {repo.name.replace(/[-_]/g, " ")}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
          {featured?.longDescription || repo.description || "No description"}
        </p>

        {/* Featured: tech stack tags */}
        {featured && featured.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {featured.techStack.map((tech) => (
              <span key={tech} className="terminal-tag text-[11px]">
                [{tech}]
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-text-muted">
          {/* Language */}
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              <span className="font-mono">{repo.language}</span>
            </span>
          )}

          {/* Stars */}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} />
              <span className="font-mono">{repo.stargazers_count}</span>
            </span>
          )}

          {/* Last updated */}
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={12} />
            <span className="font-mono">{timeAgo(repo.pushed_at)}</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-space">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
            aria-label={`View ${repo.name} on GitHub`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>Source</span>
          </a>

          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
              aria-label={`View live demo of ${repo.name}`}
            >
              <ExternalLink size={14} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
