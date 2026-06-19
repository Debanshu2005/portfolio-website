"use client";

import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/motion";
import { Briefcase, GraduationCap, Award, BadgeCheck } from "lucide-react";
import type { LinkedInData } from "@/lib/types";
import { formatLastUpdated } from "@/lib/linkedin";

interface TimelineProps {
  data: LinkedInData;
}

type TimelineItem = {
  type: "experience" | "education" | "certification" | "achievement";
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  url?: string;
  sortDate: string;
};

const ICONS = {
  experience: Briefcase,
  education: GraduationCap,
  certification: BadgeCheck,
  achievement: Award,
};

const ACCENT_COLORS = {
  experience: "border-accent-cyan",
  education: "border-accent-violet",
  certification: "border-accent-green",
  achievement: "border-accent-cyan",
};

export default function Timeline({ data }: TimelineProps) {
  // Flatten all items into a single timeline
  const items: TimelineItem[] = [
    ...data.experience.map((e) => ({
      type: "experience" as const,
      title: e.role,
      subtitle: e.company,
      duration: e.duration,
      description: e.description,
      sortDate: e.duration,
    })),
    ...data.education.map((e) => ({
      type: "education" as const,
      title: e.degree,
      subtitle: e.institution,
      duration: e.year,
      description: e.grade ? `Grade: ${e.grade}` : "",
      sortDate: e.year,
    })),
    ...data.certifications.map((c) => ({
      type: "certification" as const,
      title: c.name,
      subtitle: c.issuer,
      duration: c.date,
      description: "",
      url: c.url,
      sortDate: c.date,
    })),
    ...data.achievements.map((a) => ({
      type: "achievement" as const,
      title: a.title,
      subtitle: "",
      duration: a.date,
      description: a.description,
      sortDate: a.date,
    })),
  ];

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted font-mono text-sm">
          No experience data loaded. Edit /data/linkedin.json to populate.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border-space" />

      <div className="space-y-8">
        {items.map((item, idx) => {
          const Icon = ICONS[item.type];
          const accentBorder = ACCENT_COLORS[item.type];

          return (
            <motion.div
              key={`${item.type}-${idx}`}
              variants={fadeUpVariants}
              className="relative pl-12 sm:pl-16"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-2.5 sm:left-4.5 top-1 w-3.5 h-3.5 rounded-full border-2 bg-space-bg ${accentBorder}`}
              />

              {/* Card */}
              <div className="p-5 border border-border-space rounded-[6px] bg-space-surface hover:border-border-hover transition-colors duration-300">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-text-muted shrink-0" />
                    <h3 className="font-display text-sm font-semibold text-text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-text-muted whitespace-nowrap shrink-0">
                    {item.duration}
                  </span>
                </div>

                {item.subtitle && (
                  <p className="text-text-muted text-sm mb-1 ml-6">
                    {item.subtitle}
                  </p>
                )}

                {item.description && (
                  <p className="text-text-muted text-sm mt-2 ml-6 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 ml-6 font-mono text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                  >
                    View credential →
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Last updated footer */}
      <div className="mt-8 pl-12 sm:pl-16">
        <span className="font-mono text-xs text-text-muted">
          Last synced: {formatLastUpdated(data.lastUpdated)}
        </span>
      </div>
    </div>
  );
}
