import { type Variants } from "framer-motion";

// ─── Stagger Container ───────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ─── Fade Up (used for most section reveals) ─────────────────

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Fade In (no vertical movement) ──────────────────────────

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ─── Scale Up (for cards, badges) ─────────────────────────────

export const scaleUpVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Slide In From Left ───────────────────────────────────────

export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Viewport Settings ───────────────────────────────────────

export const defaultViewport = {
  once: true,
  amount: 0.2 as const,
  margin: "-50px" as const,
};

// ─── Language Colors ──────────────────────────────────────────

export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Rust: "#dea584",
  Go: "#00ADD8",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Lua: "#000080",
  "Jupyter Notebook": "#DA5B0B",
  Makefile: "#427819",
  Dockerfile: "#384d54",
  CMake: "#DA3434",
};
