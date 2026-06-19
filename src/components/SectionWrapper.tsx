"use client";

import { motion } from "framer-motion";
import { staggerContainer, defaultViewport } from "@/lib/motion";

interface SectionWrapperProps {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export default function SectionWrapper({
  id,
  number,
  title,
  subtitle,
  children,
  className = "",
  headerRight,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-28 ${className}`}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="relative max-w-7xl mx-auto px-6"
      >
        {/* Section Header */}
        <div className="flex items-start justify-between mb-12 sm:mb-16">
          <div>
            <span className="section-number block mb-3">
              {number} / {title.toLowerCase()}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-[-0.02em]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-text-muted text-base max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && (
            <div className="hidden sm:block">{headerRight}</div>
          )}
        </div>

        {/* Section Content */}
        {children}
      </motion.div>
    </section>
  );
}
