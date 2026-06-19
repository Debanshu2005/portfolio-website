"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Embedded Systems Engineer",
  "Firmware Developer",
  "Autonomous Systems Builder",
  "Open Source Creator",
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_DURATION = 2000;

export default function Hero() {
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTyping = useCallback(() => {
    const currentRole = ROLES[roleIndex];

    if (!isDeleting) {
      if (roleText.length < currentRole.length) {
        setRoleText(currentRole.slice(0, roleText.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
        return;
      }
    } else {
      if (roleText.length > 0) {
        setRoleText(roleText.slice(0, -1));
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        return;
      }
    }
  }, [roleText, roleIndex, isDeleting]);

  useEffect(() => {
    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [handleTyping, isDeleting]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Aurora Background */}
      <div className="aurora-bg" />

      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-space-bg)] to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-6 py-2 mb-8 glass rounded-full"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green" />
          </span>
          <span className="font-mono text-xs text-accent-green tracking-wide">
            Open to Internships — 2026
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.02em] mb-4 text-text-primary"
        >
          DEBANSHU SARKAR 1ST
        </motion.h1>

        {/* Typing Role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="h-10 flex items-center justify-center mb-6"
        >
          <span className="font-mono text-lg sm:text-xl text-accent-cyan">
            {`> `}
            {roleText}
            <span className="typing-cursor text-accent-cyan">▌</span>
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Building the future at the intersection of hardware and code.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToProjects}
            id="cta-view-projects"
            className="group relative px-8 py-3 glass text-accent-cyan font-medium rounded-full transition-all duration-300 hover:border-accent-cyan/50 hover:bg-accent-cyan/10 glow-cyan"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            id="cta-download-resume"
            className="px-8 py-3 glass text-text-primary font-medium rounded-full transition-all duration-300 hover:border-text-primary hover:bg-white/5"
          >
            Download Resume
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-border-space rounded-full flex justify-center"
        >
          <motion.div className="w-1 h-2 bg-text-muted rounded-full mt-1.5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
