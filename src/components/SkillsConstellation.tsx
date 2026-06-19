"use client";

import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/motion";
import type { LanguageBreakdown } from "@/lib/types";
import { SkeletonBar } from "./SkeletonLoader";

// ─── Skill Domains ────────────────────────────────────────────

const SKILL_DOMAINS = [
  {
    name: "Embedded Systems",
    icon: "⚡",
    skills: ["ESP32", "STM32", "Arduino", "Raspberry Pi", "PlatformIO", "UART", "SPI", "I2C"],
  },
  {
    name: "Firmware",
    icon: "🔧",
    skills: ["FreeRTOS", "RTOS", "Bare-metal C", "Interrupt-driven", "OTA Updates", "Bootloader"],
  },
  {
    name: "Autonomous Systems",
    icon: "🚁",
    skills: ["ArduPilot", "MAVLink", "PX4", "DroneKit", "Computer Vision", "PID Control"],
  },
  {
    name: "Software & DevOps",
    icon: "💻",
    skills: ["Python", "JavaScript", "TypeScript", "Node.js", "Git", "CI/CD", "Docker"],
  },
  {
    name: "AI / ML",
    icon: "🧠",
    skills: ["TensorFlow Lite", "Edge AI", "Signal Processing", "DSP", "OpenCV"],
  },
  {
    name: "Tools & Platforms",
    icon: "🛠️",
    skills: ["VS Code", "KiCad", "Proteus", "MATLAB", "Linux", "Oscilloscope"],
  },
];

interface SkillsConstellationProps {
  languages: LanguageBreakdown[];
  isLoading: boolean;
}

export default function SkillsConstellation({
  languages,
  isLoading,
}: SkillsConstellationProps) {
  return (
    <div className="space-y-12">
      {/* Skill Domains Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_DOMAINS.map((domain, idx) => (
          <motion.div
            key={domain.name}
            variants={fadeUpVariants}
            custom={idx}
            className="p-5 border border-border-space rounded-[6px] bg-space-surface hover:border-border-hover transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{domain.icon}</span>
              <h3 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wide">
                {domain.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domain.skills.map((skill) => (
                <span key={skill} className="terminal-tag">
                  [{skill}]
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Language Proficiency Bars */}
      <motion.div variants={fadeUpVariants} className="mt-8">
        <h3 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-6">
          {"// language_proficiency (from GitHub)"}
        </h3>

        {isLoading ? (
          <SkeletonBar />
        ) : languages.length > 0 ? (
          <div className="space-y-3">
            {languages.slice(0, 8).map((lang, idx) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="font-mono text-xs text-text-muted w-24 text-right shrink-0">
                  {lang.name}
                </span>
                <div className="flex-1 h-1.5 bg-space-surface rounded-full overflow-hidden border border-border-space">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                </div>
                <span className="font-mono text-xs text-text-muted w-12 shrink-0">
                  {lang.percentage}%
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm font-mono">
            No language data available
          </p>
        )}
      </motion.div>
    </div>
  );
}
