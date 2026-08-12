import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
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
}

test("server-renders the completed portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>CHIT THWAY \| Application Support, QA &amp; Web Support<\/title>/,
  );
  assert.match(html, /Support-minded\./);
  assert.match(html, /Windows Support Diagnostic Toolkit/);
  assert.match(html, /Jira Service Management Simulation/);
  assert.match(html, /Job Application Tracker/);
  assert.match(html, /Bachelor of Science \(Computer Science\)/);
  assert.match(html, /src="\/chit-thway-portrait\.jpg\?v=49cf7aef"/);
  assert.match(html, /src="\/uwa-logo\.png"/);
  assert.doesNotMatch(html, /\/_next\/image\?url=/);
  assert.match(html, /Skip to content/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /href=["']#["']/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(html, new RegExp(["Ch", "ris"].join(""), "i"));
  assert.doesNotMatch(html, /dark-comedy game prototype/i);
});

test("renders every required navigation destination", async () => {
  const response = await render();
  const html = await response.text();
  for (const id of [
    "home",
    "about",
    "projects",
    "experience",
    "skills",
    "education",
    "contact",
  ]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
    assert.match(html, new RegExp(`href=["']#${id}["']`));
  }
});
