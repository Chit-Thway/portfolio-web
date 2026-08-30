import { mkdir, rm, writeFile } from "node:fs/promises";

const generatedWranglerConfigUrl = new URL(
  "../dist/server/wrangler.json",
  import.meta.url,
);
const generatedDeployRedirectUrl = new URL(
  "../.wrangler/deploy/config.json",
  import.meta.url,
);
await rm(generatedWranglerConfigUrl, { force: true });
await rm(generatedDeployRedirectUrl, { force: true });
console.log("Removed generated Worker-only deployment metadata before Pages deployment.");

const origin = process.env.PAGES_ORIGIN ?? "https://chitthway-portfolio.pages.dev";
const projectSlugs = [
  "portfolio-v2",
  "windows-support-toolkit",
  "windows-storage-extension",
  "jira-service-management",
  "quick-fire-questions",
  "job-application-tracker",
  "concise-digital-work",
];
const routes = [
  "/",
  "/visitor",
  "/diary",
  "/login",
  "/diary/manage",
  ...projectSlugs.map((slug) => `/projects/${slug}`),
];
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

for (const route of routes) {
  const response = await worker.fetch(
    new Request(new URL(route, origin), {
      headers: {
        accept: "text/html",
        host: new URL(origin).host,
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  if (!response.ok) {
    throw new Error(`Static export for ${route} failed with HTTP ${response.status}`);
  }

  const html = await response.text();
  if (html.includes("localhost:3000")) {
    throw new Error(`Static export for ${route} contains a localhost metadata URL`);
  }

  const relativeOutput = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
  const output = new URL(`../dist/client/${relativeOutput}`, import.meta.url);
  await mkdir(new URL("./", output), { recursive: true });
  await writeFile(output, html, "utf8");
  console.log(`Exported ${new URL(route, origin)} to ${output.pathname}`);
}
