#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const profilePath = path.join(process.cwd(), "data", "linkedin.json");

const sections = [
  {
    key: "experience",
    label: "Experience",
    singular: "experience item",
    fields: ["role", "company", "duration", "description"],
    titleField: "role",
  },
  {
    key: "education",
    label: "Education",
    singular: "education item",
    fields: ["degree", "institution", "year", "grade"],
    titleField: "degree",
  },
  {
    key: "certifications",
    label: "Certifications",
    singular: "certification",
    fields: ["name", "issuer", "date", "url"],
    titleField: "name",
  },
  {
    key: "achievements",
    label: "Achievements",
    singular: "achievement",
    fields: ["title", "description", "date"],
    titleField: "title",
  },
];

function showHelp() {
  console.log(`Update the portfolio profile data in data/linkedin.json.

Usage:
  npm run profile:update

The command opens an interactive prompt. Press Enter to keep an existing value.
`);
}

function normalizeChoice(value) {
  return value.trim().toLowerCase();
}

async function ask(rl, question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  const answer = await rl.question(`${question}${suffix}: `);
  return answer.trim() || defaultValue;
}

async function askAction(rl, itemLabel) {
  while (true) {
    const answer = normalizeChoice(
      await rl.question(`${itemLabel} - keep, edit, or delete? [keep]: `)
    );

    if (!answer || answer === "k" || answer === "keep") return "keep";
    if (answer === "e" || answer === "edit") return "edit";
    if (answer === "d" || answer === "delete") return "delete";

    console.log("Please enter keep, edit, or delete.");
  }
}

async function askYesNo(rl, question, defaultYes = true) {
  const hint = defaultYes ? "Y/n" : "y/N";

  while (true) {
    const answer = normalizeChoice(await rl.question(`${question} [${hint}]: `));

    if (!answer) return defaultYes;
    if (answer === "y" || answer === "yes") return true;
    if (answer === "n" || answer === "no") return false;

    console.log("Please enter yes or no.");
  }
}

async function editItem(rl, section, existing = {}) {
  const next = {};

  for (const field of section.fields) {
    next[field] = await ask(rl, field, existing[field] || "");
  }

  return next;
}

async function editSection(rl, section, currentItems) {
  console.log(`\n${section.label}`);
  console.log("-".repeat(section.label.length));

  const nextItems = [];

  for (const [index, item] of currentItems.entries()) {
    const title = item[section.titleField] || `${section.label} ${index + 1}`;
    const action = await askAction(rl, `${index + 1}. ${title}`);

    if (action === "keep") {
      nextItems.push(item);
    }

    if (action === "edit") {
      nextItems.push(await editItem(rl, section, item));
    }
  }

  while (await askYesNo(rl, `Add another ${section.singular}?`, false)) {
    nextItems.push(await editItem(rl, section));
  }

  return nextItems;
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    showHelp();
    return;
  }

  if (!input.isTTY) {
    console.error("profile:update must be run in an interactive terminal.");
    process.exitCode = 1;
    return;
  }

  const raw = await readFile(profilePath, "utf8");
  const profile = JSON.parse(raw);
  const rl = createInterface({ input, output });

  try {
    console.log("Portfolio profile updater");
    console.log("Press Enter to keep existing values.\n");

    const nextProfile = { ...profile };

    for (const section of sections) {
      const currentItems = Array.isArray(profile[section.key])
        ? profile[section.key]
        : [];
      nextProfile[section.key] = await editSection(rl, section, currentItems);
    }

    nextProfile.lastUpdated = new Date().toISOString();

    console.log("\nPreview:");
    console.log(JSON.stringify(nextProfile, null, 2));

    if (await askYesNo(rl, "\nSave these changes?", true)) {
      await writeFile(profilePath, `${JSON.stringify(nextProfile, null, 2)}\n`, "utf8");
      console.log(`Saved ${profilePath}`);
    } else {
      console.log("No changes saved.");
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
