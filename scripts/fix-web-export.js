// Vercel's CLI applies a built-in default ignore list to directory deploys
// that always excludes anything named "node_modules" — including
// dist/assets/node_modules, which is just where Expo's web export mirrors
// font/icon assets from real node_modules packages (nothing to do with an
// actual dependency tree). A .vercelignore negation rule doesn't override
// that built-in list, so this renames the directory and rewrites the
// matching references in the bundled JS after every `expo export --web`.
const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const oldDir = path.join(distDir, "assets", "node_modules");
const newDir = path.join(distDir, "assets", "deps");

if (!fs.existsSync(oldDir)) {
  console.log("No dist/assets/node_modules found — nothing to fix.");
  process.exit(0);
}

fs.cpSync(oldDir, newDir, { recursive: true });
fs.rmSync(oldDir, { recursive: true, force: true });

const jsDir = path.join(distDir, "_expo", "static", "js", "web");
for (const file of fs.readdirSync(jsDir)) {
  if (!file.endsWith(".js")) continue;
  const filePath = path.join(jsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const fixed = content.split("assets/node_modules").join("assets/deps");
  if (fixed !== content) fs.writeFileSync(filePath, fixed);
}

console.log("Renamed dist/assets/node_modules -> dist/assets/deps and updated bundle references.");
