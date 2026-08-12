import { writeFile } from "node:fs/promises";

const origin = process.env.PAGES_ORIGIN ?? "https://chitthway-portfolio.pages.dev";
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", `${process.pid}-${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request(`${origin}/`, {
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
  throw new Error(`Static export failed with HTTP ${response.status}`);
}

const html = await response.text();
if (html.includes("localhost:3000")) {
  throw new Error("Static export contains a localhost metadata URL");
}

const output = new URL("../dist/client/index.html", import.meta.url);
await writeFile(output, html, "utf8");
console.log(`Exported ${origin} to ${output.pathname}`);
