# Debanshu Sarkar Portfolio

Personal portfolio for Debanshu Sarkar, focused on embedded systems, autonomous drones, Raspberry Pi builds, open source projects, and developer tools.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- SWR for GitHub API data
- lucide-react icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
https://portfolio-website-ten-weld-98.vercel.app/
```

The dev script uses webpack because Turbopack was hanging on this Windows scratch workspace.

## Resume

The resume download is served from:

```text
public/resume.pdf
```

Visitors can download it from:

```text
/resume.pdf
```

To update the resume, replace `public/resume.pdf` with the latest PDF using the same file name.

## Profile Data

GitHub project data refreshes through the GitHub API. LinkedIn-style timeline data is stored locally in:

```text
data/linkedin.json
```

To update experience, education, certifications, or achievements, run:

```bash
npm run profile:update
```

The command opens an interactive prompt where you can keep, edit, delete, or add entries. It updates `lastUpdated` automatically when you save.

## GitHub API Token

The site can load public GitHub data without a token, but GitHub may return `403` when the local IP hits an unauthenticated rate limit. When that happens, the site falls back to built-in project data so the page still works.

For reliable live updates, add a GitHub token to `.env.local`:

```text
GITHUB_TOKEN=your_token_here
GITHUB_USERNAME=Debanshu2005
```

A fine-grained read-only token for public repositories is enough. For a classic token, `public_repo` and `read:user` are enough for this site.

## Contact

Email shown on the website:

```text
debanshu.sarkar2005@gmail.com
```

GitHub:

```text
https://github.com/Debanshu2005
```

LinkedIn:

```text
https://www.linkedin.com/in/debanshu-sarkar-50b0b9286/
```

## Useful Commands

```bash
npm run dev
npm run profile:update
npm run lint
npm run build
```
