"use client";

import Image from "next/image";
import useSWR from "swr";
import {
  ArrowUpRight,
  Blocks,
  Cpu,
  GraduationCap,
  Mail,
  MapPin,
  RadioTower,
  Satellite,
  Wrench,
} from "lucide-react";
import type {
  CommitEntry,
  GitHubRepo,
  GitHubStats,
  LanguageBreakdown,
} from "@/lib/types";
import linkedInData from "../../data/linkedin.json";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const avatarUrl = "https://avatars.githubusercontent.com/u/198463781?v=4";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const focusAreas = [
  {
    icon: Cpu,
    title: "Embedded systems",
    text: "ESP32, STM32, Arduino, Raspberry Pi, sensors, serial buses, and field-ready prototypes.",
  },
  {
    icon: Satellite,
    title: "Autonomous flight",
    text: "ArduPilot, MAVLink, GPS telemetry, waypoint logic, and disaster-response drone experiments.",
  },
  {
    icon: Blocks,
    title: "Developer tools",
    text: "VS Code extensions, workspace scanners, CLIs, and AI-assisted workflows that save developer time.",
  },
];

const featuredProjects = [
  {
    name: "Code Janitor",
    repo: "code-janitor",
    url: "https://github.com/Debanshu2005/code-janitor",
    label: "VS Code extension",
    summary:
      "Autocorrect and syntax repair for code editors, with real marketplace traction and a workflow-first product mindset.",
    stack: ["TypeScript", "VS Code API", "Git", "AI agents"],
  },
  {
    name: "DronePy",
    repo: "DronePy",
    url: "https://github.com/Debanshu2005/DronePy",
    label: "Flight tooling",
    summary:
      "Python drone-control work around autonomous operation, telemetry, and ArduPilot/MAVLink integration.",
    stack: ["Python", "ArduPilot", "MAVLink", "GPS"],
  },
  {
    name: "Pi Buddy",
    repo: "Pi_Buddy",
    url: "https://github.com/Debanshu2005/Pi_Buddy",
    label: "Physical AI companion",
    summary:
      "Raspberry Pi based companion work that blends speech, local hardware control, and physical interaction.",
    stack: ["Python", "Raspberry Pi", "Speech", "Servo control"],
  },
  {
    name: "Rail QR",
    repo: "Rail_QR",
    url: "https://github.com/Debanshu2005/Rail_QR",
    label: "Industrial traceability",
    summary:
      "QR workflow for railway fitting management, engraving, inventory checks, and risk tracking.",
    stack: ["Python", "QR codes", "Database", "Operations"],
  },
];

const skillGroups = [
  {
    title: "Hardware bench",
    items: ["ESP32", "STM32", "Arduino", "Raspberry Pi", "UART", "SPI", "I2C"],
  },
  {
    title: "Flight and robotics",
    items: ["ArduPilot", "MAVLink", "DroneKit", "GPS", "Telemetry", "PID control"],
  },
  {
    title: "Software craft",
    items: ["Python", "TypeScript", "Node.js", "Git", "CI/CD", "CLI design"],
  },
  {
    title: "Applied AI",
    items: ["OpenCV", "Edge AI", "Signal processing", "Speech", "Automation"],
  },
];

function getProjectRepo(repos: GitHubRepo[], repoName: string) {
  return repos.find((repo) => repo.name.toLowerCase() === repoName.toLowerCase());
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function StatLine({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="stat-line">
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

export default function Home() {
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
  const profile = stats?.profile;

  return (
    <main>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="brand-mark">
          DS
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#timeline">Timeline</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero-shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">Kolkata based EIE student and builder</p>
            <h1>
              <span>Debanshu</span>
              <span>Sarkar</span>
            </h1>
            <p className="hero-text">
              I build where circuits meet code: autonomous drones, embedded
              prototypes, Raspberry Pi companions, and developer tools like
              Code Janitor.
            </p>
            <div className="hero-actions">
              <a href="#work" className="button primary-button">
                See the work
                <ArrowUpRight size={16} />
              </a>
              <a href="/resume.pdf" className="button ghost-button">
                Resume
              </a>
            </div>
          </div>

          <aside className="profile-panel" aria-label="Profile summary">
            <div className="profile-photo-wrap">
              <Image
                src={profile?.avatar_url || avatarUrl}
                alt="Debanshu Sarkar"
                width={176}
                height={176}
                priority
                className="profile-photo"
              />
            </div>
            <div>
              <p className="panel-label">Current signal</p>
              <h2>Embedded systems, open source, autonomous builds.</h2>
            </div>
            <div className="profile-stats">
              <StatLine value={stats?.repoCount ?? "--"} label="public repos" />
              <StatLine value={stats?.topLanguage ?? "--"} label="top GitHub language" />
              <StatLine value="3rd" label="department rank" />
            </div>
          </aside>
        </div>

        <div className="bench-strip" aria-label="Work focus">
          {focusAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article key={area.title}>
                <Icon size={20} />
                <h2>{area.title}</h2>
                <p>{area.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="work" className="page-section">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects with a physical-world bias"
          text="The portfolio now leads with the kind of work your GitHub actually shows: tooling, control systems, and applied hardware."
        />
        <div className="project-grid">
          {featuredProjects.map((project) => {
            const repo = getProjectRepo(repos, project.repo);
            return (
              <article key={project.name} className="project-card">
                <div className="project-card-top">
                  <span>{project.label}</span>
                  <a
                    href={repo?.html_url || project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} on GitHub`}
                  >
                    <GithubIcon />
                  </a>
                </div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <div className="project-meta">
                  {repo?.language ? <span>{repo.language}</span> : null}
                  {repo?.stargazers_count ? <span>{repo.stargazers_count} stars</span> : null}
                  {repo?.pushed_at ? <span>Updated {formatDate(repo.pushed_at)}</span> : null}
                </div>
                <div className="tag-list">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="skills" className="page-section split-section">
        <div>
          <SectionHeading
            eyebrow="Working range"
            title="A stack shaped by labs, not just landing pages"
            text="The skill map is organized around what you build: hardware interfaces, flight control, practical software, and AI at the edge."
          />
          <div className="skill-grid">
            {skillGroups.map((group) => (
              <article key={group.title} className="skill-card">
                <h3>{group.title}</h3>
                <div className="tag-list">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="language-panel">
          <div className="panel-label">GitHub language mix</div>
          <div className="language-list">
            {languages.length > 0 ? (
              languages.slice(0, 6).map((language) => (
                <div key={language.name} className="language-row">
                  <div>
                    <span
                      className="language-dot"
                      style={{ backgroundColor: language.color }}
                    />
                    <strong>{language.name}</strong>
                  </div>
                  <span>{language.percentage}%</span>
                </div>
              ))
            ) : (
              <p className="muted-copy">Language data will appear when the GitHub API responds.</p>
            )}
          </div>
        </aside>
      </section>

      <section id="timeline" className="page-section">
        <SectionHeading
          eyebrow="Trajectory"
          title="Student, maintainer, prototype builder"
        />
        <div className="timeline-grid">
          {linkedInData.education.map((item) => (
            <article key={item.degree} className="timeline-card">
              <GraduationCap size={20} />
              <span>{item.year}</span>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              <strong>{item.grade}</strong>
            </article>
          ))}
          {linkedInData.experience.map((item) => (
            <article key={`${item.role}-${item.company}`} className="timeline-card">
              <Wrench size={20} />
              <span>{item.duration}</span>
              <h3>{item.role}</h3>
              <p>{item.company}</p>
              <strong>{item.description}</strong>
            </article>
          ))}
          {linkedInData.achievements.slice(0, 3).map((item) => (
            <article key={item.title} className="timeline-card">
              <RadioTower size={20} />
              <span>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="activity" className="activity-section">
        <SectionHeading
          eyebrow="Recent commits"
          title="Still moving"
          text="A compact feed from the public GitHub activity powering the site."
        />
        <div className="commit-list">
          {commits.length > 0 ? (
            commits.slice(0, 6).map((commit) => (
              <a
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="commit-row"
              >
                <span>{commit.repo}</span>
                <strong>{commit.message}</strong>
                <time>{formatDate(commit.date)}</time>
              </a>
            ))
          ) : (
            <p className="muted-copy">Recent commits will appear when the GitHub API responds.</p>
          )}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div>
          <p className="kicker">Open to internships and collaboration</p>
          <h2>Bring me the messy hardware-software problems.</h2>
        </div>
        <div className="contact-links">
          <a href="mailto:debanshu.sarkar2005@gmail.com">
            <Mail size={18} />
            debanshu.sarkar2005@gmail.com
          </a>
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
          <span>
            <MapPin size={18} />
            Kolkata, India
          </span>
        </div>
      </section>
    </main>
  );
}
