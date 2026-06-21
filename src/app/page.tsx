"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Download,
  Mail,
  MapPin,
  RadioTower,
  Send,
  Wrench,
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type {
  CommitEntry,
  GitHubRepo,
  GitHubStats,
  LanguageBreakdown,
} from "@/lib/types";
import linkedInData from "../../data/linkedin.json";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const contactEmail = "debanshu.sarkar2005@gmail.com";

const roles = [
  "Embedded Systems Builder",
  "Firmware Developer",
  "Autonomous Systems Builder",
  "Open Source Creator",
];

const projectBlueprints = [
  {
    name: "Autonomous Quadcopter",
    repo: "DronePy",
    label: "Flight systems",
    summary:
      "Drone-control tooling around ArduPilot, MAVLink, waypoint logic, telemetry, and autonomous field experiments.",
    stack: ["ArduPilot", "MAVLink", "DroneKit", "GPS", "Python"],
    accent: "cyan",
    url: "https://github.com/Debanshu2005/DronePy",
  },
  {
    name: "Pi Buddy",
    repo: "Pi_Buddy",
    label: "Physical AI",
    summary:
      "Raspberry Pi companion experiments blending local hardware control, speech, computer vision, and interaction loops.",
    stack: ["Raspberry Pi", "Python", "Speech", "Servo", "Vision"],
    accent: "violet",
    url: "https://github.com/Debanshu2005/Pi_Buddy",
  },
  {
    name: "Smart Rescue Glove",
    repo: "Gesture_Control_TnX",
    label: "Assistive hardware",
    summary:
      "Sensor-rich rescue and gesture-control exploration with ESP32-class hardware, thermal sensing, and real-world signal input.",
    stack: ["ESP32", "Sensors", "mmWave", "AMG8833", "Embedded C"],
    accent: "green",
    url: "https://github.com/Debanshu2005/Gesture_Control_TnX",
  },
  {
    name: "Code Janitor",
    repo: "code-janitor",
    label: "Developer tool",
    summary:
      "VS Code extension for syntax repair and autocorrect workflows, built with a practical open-source product mindset.",
    stack: ["TypeScript", "VS Code API", "Git", "Automation"],
    accent: "amber",
    url: "https://github.com/Debanshu2005/code-janitor",
  },
  {
    name: "IntelScan",
    repo: "IntelScan",
    label: "PyPI CLI",
    summary:
      "Workspace scanner that turns codebases into structured summaries for faster AI-assisted development handoffs.",
    stack: ["Python", "CLI", "PyPI", "Markdown", "CI/CD"],
    accent: "cyan",
    url: "https://github.com/Debanshu2005/IntelScan",
  },
  {
    name: "Gesture RC Car",
    repo: "Bluetooth_RC_CAR",
    label: "Robotics control",
    summary:
      "Remote-control vehicle and gesture interface experiments that connect embedded input with physical motion.",
    stack: ["Arduino", "Bluetooth", "Motor control", "C++"],
    accent: "violet",
    url: "https://github.com/Debanshu2005/Bluetooth_RC_CAR",
  },
];

const skills = [
  { name: "ESP32", domain: "hardware", size: "large", context: "IoT prototypes" },
  { name: "STM32", domain: "hardware", size: "medium", context: "Microcontroller work" },
  { name: "RTOS", domain: "hardware", size: "medium", context: "Firmware scheduling" },
  { name: "I2C", domain: "hardware", size: "small", context: "Sensor buses" },
  { name: "SPI", domain: "hardware", size: "small", context: "Peripheral buses" },
  { name: "UART", domain: "hardware", size: "small", context: "Telemetry links" },
  { name: "Python", domain: "software", size: "large", context: "Drone tooling and CLIs" },
  { name: "TypeScript", domain: "software", size: "medium", context: "Code Janitor" },
  { name: "GitHub Actions", domain: "software", size: "small", context: "CI/CD automation" },
  { name: "VS Code API", domain: "software", size: "medium", context: "Editor extensions" },
  { name: "ArduPilot", domain: "autonomy", size: "large", context: "Autonomous quadcopter" },
  { name: "MAVLink", domain: "autonomy", size: "large", context: "Flight telemetry" },
  { name: "DroneKit", domain: "autonomy", size: "medium", context: "Mission scripts" },
  { name: "PID", domain: "autonomy", size: "small", context: "Control loops" },
  { name: "DSP", domain: "signal", size: "medium", context: "Instrumentation signals" },
  { name: "FFT", domain: "signal", size: "small", context: "Frequency analysis" },
  { name: "OpenCV", domain: "vision", size: "medium", context: "Vision experiments" },
  { name: "YOLOv8", domain: "vision", size: "small", context: "Object detection" },
];

const hardwareImages = [
  {
    label: "Arduino Uno R3",
    note: "microcontroller prototyping",
    className: "arduino-board",
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Arduino_uno_r3.jpg?width=900",
    source: "https://commons.wikimedia.org/wiki/File:Arduino_uno_r3.jpg",
  },
  {
    label: "Raspberry Pi 4B",
    note: "edge compute and physical AI",
    className: "raspberry-board",
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Raspberry_Pi_4_Model_B_-_Top.jpg?width=900",
    source: "https://commons.wikimedia.org/wiki/File:Raspberry_Pi_4_Model_B_-_Top.jpg",
  },
  {
    label: "PLC / Control Panel",
    note: "instrumentation and process control",
    className: "sensor-board",
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Plc_control_panel.JPG?width=900",
    source: "https://commons.wikimedia.org/wiki/File:Plc_control_panel.JPG",
  },
];

const PARTICLE_COUNT = 96;
const REDUCED_PARTICLE_COUNT = 36;
const PARTICLE_LINK_DISTANCE = 92;

const sectionReveal = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

const cardReveal = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const revealViewport = { once: true, amount: 0.18 };
const revealEase = [0.22, 1, 0.36, 1] as const;

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function useTypewriter(items: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = items[index];
    const doneTyping = !deleting && text === current;
    const doneDeleting = deleting && text === "";
    const delay = doneTyping ? 1800 : deleting ? 34 : 64;

    const timer = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }

      if (doneDeleting) {
        setDeleting(false);
        setIndex((value) => (value + 1) % items.length);
        return;
      }

      setText((value) =>
        deleting
          ? current.slice(0, Math.max(0, value.length - 1))
          : current.slice(0, value.length + 1)
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, index, items, text]);

  return text;
}

function CursorSystem() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const ringY = useSpring(cursorY, { stiffness: 300, damping: 28 });
  const planeX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const planeY = useSpring(cursorY, { stiffness: 80, damping: 20 });
  const planeRotate = useMotionValue(-20);
  const [active, setActive] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      const dx = event.clientX - last.current.x;
      const dy = event.clientY - last.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        planeRotate.set((Math.atan2(dy, dx) * 180) / Math.PI);
      }
      last.current = { x: event.clientX, y: event.clientY };
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const hoverable = target?.closest("a, button, input, textarea, [data-cursor]");
      const textTarget = target?.closest("input, textarea, .typing-line");
      setActive(Boolean(hoverable));
      setTextMode(Boolean(textTarget));
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [cursorX, cursorY, planeRotate]);

  return (
    <div className="cursor-system" aria-hidden="true">
      <motion.div
        className={`cursor-ring ${active ? "is-active" : ""}`}
        style={{ x: ringX, y: ringY }}
      />
      <motion.div
        className={`cursor-dot ${textMode ? "is-text" : ""}`}
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.svg
        className="paper-plane"
        style={{ x: planeX, y: planeY, rotate: planeRotate }}
        viewBox="0 0 64 64"
      >
        <path d="M6 31 58 8 42 56 30 37 6 31Z" />
        <path d="M30 37 58 8 20 33" />
      </motion.svg>
    </div>
  );
}

function MobileSignalPlane() {
  return (
    <div className="mobile-plane-system" aria-hidden="true">
      <span className="mobile-plane-trail" />
      <svg className="mobile-paper-plane" viewBox="0 0 64 64">
        <path d="M6 31 58 8 42 56 30 37 6 31Z" />
        <path d="M30 37 58 8 20 33" />
      </svg>
    </div>
  );
}

function ScrollProgressHud() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;

      setProgress(Math.min(100, Math.max(0, Math.round(nextProgress))));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const level = Math.max(1, Math.min(5, Math.ceil(progress / 20)));
  const complete = progress >= 100;

  return (
    <div
      className={`scroll-progress-hud ${complete ? "is-complete" : ""}`}
      role="progressbar"
      aria-label="Website explored"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      style={{ "--progress": `${progress}%` } as CSSProperties}
    >
      <div className="scroll-progress-copy">
        <span>Explored</span>
        <strong>{progress}%</strong>
      </div>
      <div className="scroll-progress-track" aria-hidden="true">
        <span className="scroll-progress-fill" />
        <span className="scroll-progress-runner">
          <span className="runner-head">
            <span />
          </span>
          <span className="runner-body">DS</span>
        </span>
        {complete ? (
          <span className="scroll-complete-burst">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                style={{ "--burst-index": index } as CSSProperties}
              />
            ))}
          </span>
        ) : null}
      </div>
      <div className="scroll-progress-levels" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={index < level ? "is-active" : ""}
          />
        ))}
      </div>
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: reduced ? REDUCED_PARTICLE_COUNT : PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));

    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,0.72)";

      const grid = new Map<string, number[]>();
      const cellSize = PARTICLE_LINK_DISTANCE;

      particles.forEach((particle, index) => {
        const px = particle.x * width;
        const py = particle.y * height;
        const dx = px - mouse.current.x;
        const dy = py - mouse.current.y;
        const distance = Math.hypot(dx, dy);

        if (!reduced && distance < 110) {
          particle.vx += (dx / Math.max(distance, 1)) * 0.018;
          particle.vy += (dy / Math.max(distance, 1)) * 0.018;
        }

        particle.x += particle.vx / Math.max(width, 1);
        particle.y += particle.vy / Math.max(height, 1);
        particle.vx *= 0.985;
        particle.vy *= 0.985;

        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
        particle.x = Math.min(1, Math.max(0, particle.x));
        particle.y = Math.min(1, Math.max(0, particle.y));

        context.beginPath();
        context.arc(px, py, 1.3, 0, Math.PI * 2);
        context.fill();

        const cellX = Math.floor(px / cellSize);
        const cellY = Math.floor(py / cellSize);
        const cellKey = `${cellX},${cellY}`;
        const existing = grid.get(cellKey);
        if (existing) {
          existing.push(index);
        } else {
          grid.set(cellKey, [index]);
        }
      });

      particles.forEach((particle, index) => {
        const px = particle.x * width;
        const py = particle.y * height;
        const cellX = Math.floor(px / cellSize);
        const cellY = Math.floor(py / cellSize);

        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          for (let offsetY = -1; offsetY <= 1; offsetY++) {
            const neighbors = grid.get(`${cellX + offsetX},${cellY + offsetY}`);
            if (!neighbors) continue;

            for (const neighborIndex of neighbors) {
              if (neighborIndex <= index) continue;

              const neighbor = particles[neighborIndex];
              const nx = neighbor.x * width;
              const ny = neighbor.y * height;
              const distance = Math.hypot(px - nx, py - ny);

              if (distance < PARTICLE_LINK_DISTANCE) {
                context.strokeStyle = `rgba(0, 212, 255, ${
                  0.18 * (1 - distance / PARTICLE_LINK_DISTANCE)
                })`;
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(px, py);
                context.lineTo(nx, ny);
                context.stroke();
              }
            }
          }
        }
      });

      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}

function HardwareBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = backdropRef.current;
    if (!element) return;

    let frame = 0;
    let nextPointer: PointerEvent | null = null;
    let rect = element.getBoundingClientRect();

    const updateBackdrop = () => {
      frame = 0;
      if (!nextPointer) return;

      const x = (nextPointer.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const y = (nextPointer.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      element.style.setProperty("--board-x", `${x * 18}px`);
      element.style.setProperty("--board-y", `${y * 18}px`);
      element.style.setProperty("--board-rotate-x", `${y * -5}deg`);
      element.style.setProperty("--board-rotate-y", `${x * 5}deg`);
    };

    const onMove = (event: PointerEvent) => {
      nextPointer = event;
      if (!frame) frame = window.requestAnimationFrame(updateBackdrop);
    };

    const onResize = () => {
      rect = element.getBoundingClientRect();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={backdropRef} className="hardware-backdrop" aria-hidden="true">
      <svg className="industrial-pipeline" viewBox="0 0 1200 720">
        <path className="pipe pipe-primary" d="M40 612 H250 Q310 612 310 552 V428 Q310 368 370 368 H438" />
        <path className="pipe pipe-primary" d="M762 184 H940 Q1000 184 1000 244 V552 Q1000 612 1060 612 H1170" />
        <path className="pipe pipe-secondary" d="M130 118 H388 Q430 118 430 160 V252" />
        <path className="pipe pipe-secondary" d="M746 606 H890 Q930 606 930 566 V462" />
        <path className="pipe pipe-thin" d="M78 258 H214 Q254 258 254 298 V456" />
        <path className="pipe pipe-thin" d="M1050 142 V260 Q1050 300 1090 300 H1164" />
        <g className="pipe-joint" transform="translate(310 428)">
          <circle r="19" />
          <path d="M-12 0 H12 M0 -12 V12" />
        </g>
        <g className="pipe-joint" transform="translate(1000 552)">
          <circle r="19" />
          <path d="M-12 0 H12 M0 -12 V12" />
        </g>
        <g className="pipe-gauge" transform="translate(254 456)">
          <circle r="25" />
          <path d="M0 0 L14 -9" />
          <path d="M-12 13 H12" />
        </g>
        <g className="pipe-gauge" transform="translate(930 462)">
          <circle r="25" />
          <path d="M0 0 L9 13" />
          <path d="M-12 13 H12" />
        </g>
        <circle className="pipe-node" cx="430" cy="160" r="6" />
        <circle className="pipe-node" cx="370" cy="368" r="6" />
        <circle className="pipe-node" cx="1050" cy="260" r="6" />
      </svg>
      {hardwareImages.map((image) => (
        <div
          key={image.label}
          className={`hardware-photo ${image.className}`}
        >
          <Image
            src={image.src}
            alt={image.label}
            fill
            sizes="(max-width: 920px) 10rem, 15rem"
            unoptimized
          />
          <span>
            <strong>{image.label}</strong>
            <em>{image.note}</em>
          </span>
        </div>
      ))}
    </div>
  );
}

function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="stat-pill">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function repoFor(repos: GitHubRepo[], name: string) {
  return repos.find((repo) => repo.name.toLowerCase() === name.toLowerCase());
}

function formatDate(dateString: string) {
  if (!dateString) return "Live";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export default function Home() {
  const typedRole = useTypewriter(roles);
  const [activeProject, setActiveProject] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { data: statsData } = useSWR<{ data: GitHubStats }>(
    "/api/github?type=stats",
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  );
  const { data: reposData } = useSWR<{ data: GitHubRepo[] }>(
    "/api/github?type=repos",
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  );
  const { data: languagesData } = useSWR<{ data: LanguageBreakdown[] }>(
    "/api/github?type=languages",
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  );
  const { data: commitsData } = useSWR<{ data: CommitEntry[] }>(
    "/api/github?type=commits",
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  );

  const stats = statsData?.data;
  const repos = reposData?.data ?? [];
  const languages = languagesData?.data ?? [];
  const commits = commitsData?.data ?? [];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setActiveProject((value) => (value + 1) % projectBlueprints.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveProject((value) =>
          value === 0 ? projectBlueprints.length - 1 : value - 1
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const timelineItems = useMemo(
    () => [
      ...linkedInData.education.map((item) => ({
        icon: Cpu,
        date: item.year,
        title: item.degree,
        text: `${item.institution} - ${item.grade}`,
      })),
      ...linkedInData.experience.map((item) => ({
        icon: Wrench,
        date: item.duration,
        title: item.role,
        text: `${item.company} - ${item.description}`,
      })),
      ...linkedInData.achievements.map((item) => ({
        icon: RadioTower,
        date: item.date,
        title: item.title,
        text: item.description,
      })),
    ],
    []
  );

  const handleMailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `Portfolio message from ${contactForm.name || "someone"}`;
    const body = [
      contactForm.message,
      "",
      contactForm.name ? `Name: ${contactForm.name}` : "",
      contactForm.email ? `Reply email: ${contactForm.email}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const gmailParams = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: contactEmail,
      su: subject,
      body,
    });
    const gmailUrl = `https://mail.google.com/mail/?${gmailParams.toString()}`;
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    const draftWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer");

    if (!draftWindow) {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <main className="site-shell">
      <CursorSystem />
      <MobileSignalPlane />
      <ScrollProgressHud />

      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="brand-mark">
          DS
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#timeline">Timeline</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero-section">
        <ParticleField />
        <HardwareBackdrop />
        <div className="hero-vignette" />
        <div className="hero-content">
          <div className="status-badge">
            <span />
            Open to Collaborate - 2026
          </div>
          <p className="hero-eyebrow">Electronics and Instrumentation - Techno Main SaltLake</p>
          <h1>
            <span>Debanshu</span>
            <span>Sarkar</span>
          </h1>
          <p className="typing-line">
            {typedRole}
            <span className="typing-caret">_</span>
          </p>
          <p className="hero-copy">
            I build things that move, think, and respond to the real world:
            autonomous drones, embedded prototypes, physical AI companions, and
            developer tools.
          </p>
          <div className="hero-stats">
            <StatPill value={projectBlueprints.length} label="Projects" />
            <StatPill value="1,534+" label="VS Code installs" />
            <StatPill value="#3" label="Dept. rank" />
            <StatPill value={stats?.repoCount ?? "--"} label="GitHub repos" />
          </div>
          <div className="hero-actions">
            <a href="#projects" className="primary-action">
              View Projects
              <ArrowUpRight size={18} />
            </a>
            <a href="/resume.pdf" className="secondary-action">
              <Download size={18} />
              Download Resume
            </a>
          </div>
        </div>
        <div className="scroll-indicator" aria-hidden="true">
          <span />
        </div>
      </section>

      <motion.section
        id="about"
        className="about-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <SectionHeading
          eyebrow="Inside the signal"
          title="I turn circuits into useful systems"
          text="I am Debanshu Sarkar, an Electronics and Instrumentation student at Techno Main SaltLake who likes building embedded prototypes, autonomous machines, and practical developer tools."
        />
        <div className="about-panels">
          <motion.article
            className="about-panel human-panel"
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            transition={{ duration: 0.55, ease: revealEase }}
          >
            <span className="panel-number">01</span>
            <h3>The Engineer</h3>
            <p>From firmware to flight — I ship embedded systems, autonomous machines, and developer tools that solve real problems.</p>
            <div className="coordinates">
              <MapPin size={16} />
              22.5726 N / 88.3639 E
            </div>
          </motion.article>
          <motion.article
            className="about-panel circuit-panel"
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            transition={{ duration: 0.55, delay: 0.08, ease: revealEase }}
          >
            <span className="panel-number">02</span>
            <h3>The Stack</h3>
            <div className="circuit-board" aria-label="Circuit board skill map">
              {["ESP32", "STM32", "ArduPilot", "MAVLink", "Python", "RTOS"].map((node) => (
                <span key={node}>{node}</span>
              ))}
            </div>
          </motion.article>
          <motion.article
            className="about-panel numbers-panel"
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            transition={{ duration: 0.55, delay: 0.16, ease: revealEase }}
          >
            <span className="panel-number">03</span>
            <h3>The Numbers</h3>
            <strong>B.Tech EIE - 2027</strong>
            <strong>Rank #3 / Dept</strong>
            <strong>Code Janitor - 1,534+ installs</strong>
          </motion.article>
        </div>
      </motion.section>

      <motion.section
        id="projects"
        className="projects-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <SectionHeading
          eyebrow="3D project deck"
          title="Work with a physical-world bias"
          text="Use the arrows, keyboard, or swipe-scroll rhythm: each card is a small proof that software is more interesting when it touches hardware."
        />
        <div className="carousel-controls">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() =>
              setActiveProject((value) =>
                value === 0 ? projectBlueprints.length - 1 : value - 1
              )
            }
          >
            <ArrowLeft size={18} />
          </button>
          <span>
            {activeProject + 1} / {projectBlueprints.length}
          </span>
          <button
            type="button"
            aria-label="Next project"
            onClick={() =>
              setActiveProject((value) => (value + 1) % projectBlueprints.length)
            }
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="project-carousel">
          {projectBlueprints.map((project, index) => {
            const repo = repoFor(repos, project.repo);
            let offset = index - activeProject;
            if (offset > projectBlueprints.length / 2) offset -= projectBlueprints.length;
            if (offset < -projectBlueprints.length / 2) offset += projectBlueprints.length;

            const style = {
              transform: `translateX(${offset * 220}px) translateZ(${
                -Math.abs(offset) * 80
              }px) rotateY(${offset * -32}deg) scale(${
                1 - Math.min(Math.abs(offset) * 0.12, 0.36)
              })`,
              opacity: Math.abs(offset) > 2 ? 0 : 1,
              zIndex: 20 - Math.abs(offset),
            } as CSSProperties;

            return (
              <article
                key={project.name}
                className={`project-card ${offset === 0 ? "is-active" : ""}`}
                style={style}
                data-cursor
              >
                <div className="project-card-top">
                  <span>{project.label}</span>
                  <span className={`live-badge ${project.accent}`}>
                    <i />
                    Live
                  </span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <div className="project-metadata">
                  <span>{repo?.language || project.stack[0]}</span>
                  <span>{repo?.stargazers_count ?? 0} stars</span>
                  <span>Updated {formatDate(repo?.pushed_at || "")}</span>
                </div>
                <div className="tag-list">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <a
                  href={repo?.html_url || project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <GithubIcon />
                  Source
                </a>
              </article>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        id="skills"
        className="skills-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <SectionHeading
          eyebrow="Skill nebula"
          title="A galaxy of things I actually wire together"
          text="Hover a node to see where it shows up. GitHub languages still feed the software signal."
        />
        <div className="skills-layout">
          <div className="skill-nebula">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <path d="M15 60 C35 20, 60 20, 85 55" />
              <path d="M20 35 C45 70, 58 68, 82 32" />
              <path d="M14 76 C45 48, 64 46, 90 72" />
            </svg>
            {skills.map((skill, index) => (
              <button
                key={skill.name}
                type="button"
                className={`skill-node ${skill.domain} ${skill.size}`}
                style={
                  {
                    "--x": `${10 + ((index * 23) % 78)}%`,
                    "--y": `${14 + ((index * 37) % 70)}%`,
                    "--drift": `${(index % 5) + 4}s`,
                  } as CSSProperties
                }
              >
                <span>{skill.name}</span>
                <em>Used in: {skill.context}</em>
              </button>
            ))}
          </div>
          <aside className="language-panel">
            <span className="panel-number">GitHub language mix</span>
            {languages.length > 0 ? (
              languages.slice(0, 6).map((language) => (
                <div key={language.name} className="language-row">
                  <span>
                    <i style={{ backgroundColor: language.color }} />
                    {language.name}
                  </span>
                  <strong>{language.percentage}%</strong>
                </div>
              ))
            ) : (
              <p>Language data appears when the GitHub API responds.</p>
            )}
          </aside>
        </div>
      </motion.section>

      <motion.section
        id="timeline"
        className="timeline-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <SectionHeading
          eyebrow={`Last updated ${formatDate(linkedInData.lastUpdated)}`}
          title="Stay updated on my latest work"
          text="A story of academic signal, shipped projects, and hands-on systems work."
        />
        <div className="timeline-list">
          {timelineItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={`${item.title}-${index}`}
                className="timeline-item"
                variants={cardReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.28 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.04, 0.22),
                  ease: revealEase,
                }}
              >
                <div className="timeline-icon">
                  <Icon size={18} />
                </div>
                <span>{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        className="activity-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <SectionHeading
          eyebrow="GitHub live activity"
          title="Signals from the workbench"
          text="Fallback data keeps the site stable when GitHub rate-limits unauthenticated local requests."
        />
        <div className="activity-grid">
          <div className="terminal-log">
            <span className="terminal-title">recent commits</span>
            {commits.length > 0 ? (
              commits.slice(0, 10).map((commit) => (
                <a key={commit.sha} href={commit.url} target="_blank" rel="noopener noreferrer">
                  <span>[{formatDate(commit.date)}]</span>
                  <strong>{commit.message}</strong>
                  <em>{commit.repo}</em>
                </a>
              ))
            ) : (
              <p>[standby] GitHub commit feed waiting for API response.</p>
            )}
          </div>
          <div className="heatmap-preview" aria-label="Contribution heatmap preview">
            {Array.from({ length: 84 }).map((_, index) => (
              <span key={index} style={{ opacity: 0.18 + (index % 7) * 0.1 }} />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="contact-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <div>
          <span className="section-kicker">Coordinates locked</span>
          <h2>LET&apos;S BUILD SOMETHING.</h2>
          <p>Embedded systems, autonomous machines, practical AI, or developer tooling. Bring the messy problem.</p>
          <div className="contact-meta">
            <span>
              <MapPin size={16} />
              22.5726 N, 88.3639 E
            </span>
            <a href={`mailto:${contactEmail}`}>
              <Mail size={16} />
              {contactEmail}
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleMailSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={contactForm.name}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={contactForm.email}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={4}
              placeholder="Tell me what we are building"
              value={contactForm.message}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
            />
          </label>
          <button type="submit">
            <Send size={16} />
            Open Mail Draft
          </button>
          <div className="social-links">
            <a href="https://github.com/Debanshu2005" target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/debanshu-sarkar-50b0b9286/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon />
              LinkedIn
            </a>
          </div>
        </form>
      </motion.section>
    </main>
  );
}
