import { mkdir, writeFile } from "node:fs/promises";

const origin = process.env.PAGES_ORIGIN ?? "https://chitthway-portfolio.pages.dev";
const projectSlugs = [
  "windows-support-toolkit",
  "jira-service-management",
  "quick-fire-questions",
  "job-application-tracker",
  "concise-digital-work",
];
const routes = ["/", "/visitor", ...projectSlugs.map((slug) => `/projects/${slug}`)];
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
