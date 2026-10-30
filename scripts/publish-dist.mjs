import { spawn } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const publicDir = join(root, ".output", "public");
const serverEntry = join(root, ".output", "server", "index.mjs");
const port = 4173;
const routes = [
  "/",
  "/about",
  "/asian-bistro",
  "/nawab-gardens",
  "/services",
  "/blog",
  "/faqs",
  "/contact",
  "/reserve",
  "/privacy",
  "/terms",
  "/admin",
];

rmSync(dist, { recursive: true, force: true });
cpSync(publicDir, dist, { recursive: true });

const server = spawn(process.execPath, [serverEntry], {
  env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});

let logs = "";
server.stdout.on("data", (chunk) => {
  logs += chunk;
});
server.stderr.on("data", (chunk) => {
  logs += chunk;
});

try {
  await waitForServer(`http://127.0.0.1:${port}/`);
  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    if (!response.ok) {
      throw new Error(`${route} returned ${response.status}`);
    }
    const html = await response.text();
    const file = route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    console.log(`wrote ${route}`);
  }
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  server.kill("SIGTERM");
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Static render server did not start on ${url}`);
}
