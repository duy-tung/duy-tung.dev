// Post-build check over dist/:
//  - every internal href/src (and srcset) resolves to a built file
//  - every in-page #fragment exists on the target page
//  - every URL in a baseline list (optional arg) still resolves
//  - lists all TODO placeholders still rendered
// Usage: pnpm build && pnpm check:site [baseline-urls.txt]
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const site = "https://duy-tung.dev";

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const htmlFiles = walk(dist).filter((f) => f.endsWith(".html"));

/** Map a URL path to the file that serves it, or null. */
function resolve(pathname) {
  const clean = decodeURIComponent(pathname.split(/[?#]/)[0]);
  const candidates = clean.endsWith("/")
    ? [join(dist, clean, "index.html")]
    : [join(dist, clean), join(dist, clean, "index.html"), join(dist, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
};

const broken = [];
const todos = new Map();
let checked = 0;

for (const file of htmlFiles) {
  const raw = readFileSync(file, "utf8");
  // Ignore inline script bodies: they build hrefs at runtime, not real links.
  const html = raw.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/g, "$1</script>");
  const page = `/${relative(dist, file).replace(/index\.html$/, "")}`;

  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
      m[1].split(",").map((s) => s.trim().split(/\s+/)[0]),
    ),
  ];

  for (let ref of refs) {
    ref = ref.replaceAll("&amp;", "&");
    if (ref.startsWith(site)) ref = ref.slice(site.length) || "/";
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(ref)) continue;
    checked++;

    const [pathPart, fragment] = ref.split("#");
    const target = pathPart === "" ? file : resolve(new URL(pathPart, `http://x${page}`).pathname);
    if (!target) {
      broken.push(`${page} -> ${ref}`);
    } else if (fragment && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(fragment))) {
      broken.push(`${page} -> ${ref} (missing #${fragment})`);
    }
  }

  for (const m of html.matchAll(/<!-- TODO: ([\s\S]*?) -->/g)) {
    todos.set(m[1], [...(todos.get(m[1]) ?? []), page]);
  }
}

const baselineFile = process.argv[2];
const missingBaseline = baselineFile
  ? readFileSync(baselineFile, "utf8").split("\n").filter(Boolean).filter((u) => !resolve(u))
  : [];

console.log(`Checked ${checked} internal references across ${htmlFiles.length} HTML files.`);

if (todos.size) {
  console.log(`\n${todos.size} TODO placeholder(s) still rendered:`);
  for (const [label, pages] of todos) {
    console.log(`  - ${label}\n      on ${[...new Set(pages)].join(", ")}`);
  }
}

if (baselineFile) {
  console.log(
    missingBaseline.length
      ? `\nBaseline URLs no longer served:\n${missingBaseline.map((u) => `  - ${u}`).join("\n")}`
      : `\nAll baseline URLs from ${baselineFile} still resolve.`,
  );
}

if (broken.length) {
  console.error(`\n${broken.length} broken internal link(s):\n${broken.map((b) => `  - ${b}`).join("\n")}`);
}

process.exit(broken.length || missingBaseline.length ? 1 : 0);
