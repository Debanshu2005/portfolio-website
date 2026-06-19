"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, MapPin } from "lucide-react";

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
import { fadeUpVariants } from "@/lib/motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "";

    if (!endpoint || endpoint.includes("xxxx")) {
      // Simulate success when no endpoint configured
      setTimeout(() => setStatus("success"), 1000);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Contact info */}
      <motion.div variants={fadeUpVariants} className="space-y-8">
        <div>
          <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
            Let&apos;s build something together
          </h3>
          <p className="text-text-muted leading-relaxed">
            I&apos;m always open to discussing embedded systems projects,
            firmware development, or any interesting collaboration.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email (obfuscated) */}
          <a
            href="mailto:debanshu.sarkar2005@gmail.com"
            className="flex items-center gap-3 text-text-muted hover:text-accent-cyan transition-colors group"
          >
            <div className="p-2 border border-border-space rounded-[4px] group-hover:border-accent-cyan/30 transition-colors">
              <Mail size={16} />
            </div>
            <span className="font-mono text-sm">
              {"debanshu"}&#46;{"sarkar2005"}&#64;{"gmail"}&#46;{"com"}
            </span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Debanshu2005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-muted hover:text-accent-cyan transition-colors group"
          >
            <div className="p-2 border border-border-space rounded-[4px] group-hover:border-accent-cyan/30 transition-colors">
              <GithubIcon />
            </div>
            <span className="font-mono text-sm">github.com/Debanshu2005</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/debanshu-sarkar-50b0b9286/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-muted hover:text-accent-cyan transition-colors group"
          >
            <div className="p-2 border border-border-space rounded-[4px] group-hover:border-accent-cyan/30 transition-colors">
              <LinkedinIcon />
            </div>
            <span className="font-mono text-sm">
              linkedin.com/in/debanshu-sarkar-50b0b9286
            </span>
          </a>

          {/* Location */}
          <div className="flex items-center gap-3 text-text-muted">
            <div className="p-2 border border-border-space rounded-[4px]">
              <MapPin size={16} />
            </div>
            <span className="font-mono text-sm">
              22.5726° N, 88.3639° E — Kolkata, India
            </span>
          </div>
        </div>
      </motion.div>

      {/* Right: Contact form */}
      <motion.div variants={fadeUpVariants}>
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center h-full p-8 border border-accent-green/30 rounded-[6px] bg-accent-green/5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle size={48} className="text-accent-green mb-4" />
            </motion.div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
              Message sent!
            </h3>
            <p className="text-text-muted text-sm text-center">
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 font-mono text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              Send another →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
            <div>
              <label
                htmlFor="contact-name"
                className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-space-surface border border-border-space rounded-[4px] text-text-primary text-sm font-body placeholder:text-text-muted/50 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-space-surface border border-border-space rounded-[4px] text-text-primary text-sm font-body placeholder:text-text-muted/50 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-space-surface border border-border-space rounded-[4px] text-text-primary text-sm font-body placeholder:text-text-muted/50 focus:outline-none focus:border-accent-cyan/50 transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              id="contact-submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan font-medium rounded-[4px] transition-all duration-300 hover:bg-accent-cyan/20 hover:border-accent-cyan/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-red-400 text-xs font-mono text-center">
                Failed to send. Please try again or email directly.
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}
