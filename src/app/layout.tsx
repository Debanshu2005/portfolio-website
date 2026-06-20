import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debanshu Sarkar - Embedded Systems and Open Source",
  description:
    "Portfolio of Debanshu Sarkar, an Electronics and Instrumentation Engineering student building autonomous systems, embedded prototypes, and developer tools.",
  keywords: [
    "Debanshu Sarkar",
    "embedded systems",
    "firmware developer",
    "autonomous systems",
    "ESP32",
    "ArduPilot",
    "Raspberry Pi",
    "open source",
    "portfolio",
  ],
  authors: [{ name: "Debanshu Sarkar", url: "https://github.com/Debanshu2005" }],
  creator: "Debanshu Sarkar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://debanshu.dev",
    title: "Debanshu Sarkar - Embedded Systems and Open Source",
    description:
      "Electronics and Instrumentation Engineering student building embedded systems, autonomous drones, Raspberry Pi experiments, and developer tools.",
    siteName: "Debanshu Sarkar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debanshu Sarkar - Embedded Systems and Open Source",
    description:
      "Embedded systems, autonomous drones, Raspberry Pi builds, and developer tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Debanshu Sarkar",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://debanshu.dev",
    jobTitle: "Embedded Systems Builder",
    description:
      "Electronics and Instrumentation Engineering student specializing in embedded systems, autonomous drones, Raspberry Pi prototypes, and developer tools.",
    sameAs: [
      "https://github.com/Debanshu2005",
      "https://www.linkedin.com/in/debanshu-sarkar-50b0b9286/",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
              name: "Techno Main SaltLake",
    },
  };

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
