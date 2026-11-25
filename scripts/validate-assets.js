const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "..", "public");
const missing = [];
const externalHosts = new Set();

function* files(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* files(fullPath);
    } else {
      yield fullPath;
    }
  }
}

function assetUrl(rawUrl) {
  let url = rawUrl.trim().replace(/^["']|["']$/g, "");
  if (!url || url.startsWith("#") || url.startsWith("data:") || url.startsWith("mailto:") || url.startsWith("javascript:")) {
    return null;
  }
  if (/^(https?:)?\/\//i.test(url)) {
    externalHosts.add(url.split("/")[2] || url);
    return null;
  }
  if (url.includes("${")) {
    return null;
  }
  return decodeURIComponent(url.split(/[?#]/)[0]);
}

function validateAssets() {
  if (!fs.existsSync(publicDir)) {
    throw new Error(`Build output not found: ${publicDir}. Run "npm run build" first.`);
  }

  for (const file of files(publicDir)) {
    if (!/\.(html|css)$/i.test(file)) {
      continue;
    }

    const content = fs.readFileSync(file, "utf8");
    const matches = content.matchAll(/\b(?:src|href)=["']([^"']+)["']|url\(([^)]+)\)/gi);

    for (const match of matches) {
      const url = assetUrl(match[1] || match[2] || "");
      if (!url || !/\.(png|jpe?g|webp|awebp|gif|svg|woff2?|ttf|css|js|xml)$/i.test(url)) {
        continue;
      }

      const normalizedUrl = path.posix.normalize(url);
      const target = path.isAbsolute(normalizedUrl)
        ? path.join(publicDir, normalizedUrl.replace(/^\/+/, ""))
        : path.resolve(path.dirname(file), normalizedUrl);

      if (!fs.existsSync(target)) {
        missing.push({file: path.relative(publicDir, file), url});
      }
    }
  }

  if (missing.length > 0) {
    console.error("Missing local assets:");
    for (const item of missing) {
      console.error(`- ${item.file}: ${item.url}`);
    }
    process.exitCode = 1;
  } else {
    console.log("All local asset references resolve correctly.");
  }

  if (externalHosts.size > 0) {
    console.log(`External hosts: ${[...externalHosts].sort().join(", ")}`);
  }
}

if (require.main === module) {
  validateAssets();
}

module.exports = validateAssets;
