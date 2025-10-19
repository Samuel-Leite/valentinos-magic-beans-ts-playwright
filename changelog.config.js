const { readdirSync } = require("fs");

// Automatically generate scopes based on top-level project folders
const allScopes = readdirSync("./", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith(".")); // ignore hidden folders like .husky

module.exports = {
  disableEmoji: false,
  maxMessageLength: 72,
  minMessageLength: 3,
  questions: ["type", "scope", "subject", "body", "issues"],
  scopes: ["all", ...allScopes],
  types: {
    feat: {
      description: "A new feature",
      emoji: "✨",
      value: "feat",
    },
    fix: {
      description: "A bug fix",
      emoji: "🐛",
      value: "fix",
    },
    docs: {
      description: "Documentation changes",
      emoji: "📚",
      value: "docs",
    },
    style: {
      description: "Code style changes (formatting, missing semicolons, etc)",
      emoji: "💅",
      value: "style",
    },
    refactor: {
      description: "Code changes that neither fix a bug nor add a feature",
      emoji: "💡",
      value: "refactor",
    },
    test: {
      description: "Adding or updating tests",
      emoji: "🧪",
      value: "test",
    },
    chore: {
      description: "Maintenance tasks or build process updates",
      emoji: "📦",
      value: "chore",
    },
    ci: {
      description: "Changes to CI/CD configuration",
      emoji: "🔁",
      value: "ci",
    },
    perf: {
      description: "Performance improvements",
      emoji: "⚡",
      value: "perf",
    },
    merge: {
      description: "Merging branches",
      emoji: "🧬",
      value: "merge",
    },
    revert: {
      description: "Reverting a previous commit",
      emoji: "⏪",
      value: "revert",
    },
  },
};
