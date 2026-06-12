#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const imagesRoot = path.join(root, "images");
const outputPath = path.join(root, "metadata", "images.json");
const owner = process.env.GITHUB_OWNER || "OWNER";
const repo = process.env.GITHUB_REPO || "gofid-images";
const branch = process.env.GITHUB_BRANCH || "main";
const checkOnly = process.argv.includes("--check");

const allowedExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      if (!entry.isFile()) return [];

      const ext = path.extname(entry.name).toLowerCase();
      if (!allowedExtensions.has(ext)) return [];

      return [fullPath];
    });
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

const images = walk(imagesRoot)
  .map((filePath) => {
    const relativePath = toPosix(path.relative(root, filePath));
    const stat = fs.statSync(filePath);
    const category = relativePath.split("/")[1] || "misc";
    const name = path.basename(filePath);

    return {
      name,
      category,
      path: relativePath,
      size: stat.size,
      githubPagesUrl: `https://${owner}.github.io/${repo}/${relativePath}`,
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${relativePath}`,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const payload = {
  generatedAt: new Date().toISOString(),
  owner,
  repo,
  branch,
  count: images.length,
  images,
};

const nextContent = `${JSON.stringify(payload, null, 2)}\n`;

if (checkOnly) {
  const currentContent = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (currentContent !== nextContent) {
    console.error("metadata/images.json is not up to date. Run npm run index.");
    process.exit(1);
  }
  console.log("metadata/images.json is up to date.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, nextContent);
console.log(`Indexed ${images.length} image(s) in metadata/images.json.`);
