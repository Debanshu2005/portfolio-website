"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/motion";

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  isLoading?: boolean;
}

export default function StatCard({
  value,
  label,
  suffix = "",
  prefix = "",
  isLoading = false,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate count-up
          const duration = 1500;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isLoading, hasAnimated]);

  if (isLoading) {
    return (
      <div className="p-6 border border-border-space rounded-[6px] bg-space-surface">
        <div className="skeleton h-9 w-20 mb-2" />
        <div className="skeleton h-4 w-24" />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariants}
      className="p-6 glass hover:border-accent-cyan/50 hover:shadow-[0_0_20px_rgba(0,242,254,0.15)] transition-all duration-300"
    >
      <div className="stat-underline inline-block mb-3">
        <span className="font-mono text-3xl sm:text-4xl font-medium text-text-primary">
          {prefix}
          {displayValue}
          {suffix}
        </span>
      </div>
      <p className="text-text-muted text-sm font-medium">{label}</p>
    </motion.div>
  );
}
