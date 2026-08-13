import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(path, "http://localhost"), {
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

test("links every homepage project to its own case study", async () => {
  const response = await render();
  const html = await response.text();

  for (const slug of [
    "windows-support-toolkit",
    "jira-service-management",
    "quick-fire-questions",
    "job-application-tracker",
    "concise-digital-work",
  ]) {
    assert.match(html, new RegExp(`href=["']/projects/${slug}/["']`));
    assert.match(html, new RegExp(`aria-label=["']View [^"']+ case study["']`));
  }
  assert.doesNotMatch(html, /Explore case study/i);
  assert.match(html, /View repository/);
});

test("renders the Windows toolkit video and simple setup", async () => {
  const response = await render("/projects/windows-support-toolkit");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Windows Support Diagnostic Toolkit/);
  assert.match(html, /\/projects\/windows-support-toolkit\/demonstration\.mp4/);
  assert.match(html, /A simple first run/);
  assert.match(html, /python -m dashboard/);
  assert.match(html, /class="repository-button case-title-repository"/);
  assert.doesNotMatch(html, /<track[^>]*\sdefault(?:=|\s|>)/i);
  assert.ok(html.indexOf("Other projects") < html.indexOf("demonstration.mp4"));
});

test("renders the Jira slide viewer and presentation download", async () => {
  const response = await render("/projects/jira-service-management");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Kestrel Ridge IT Service Desk case study, slide 1 of 12/);
  assert.match(html, /Download presentation/);
  assert.match(html, /Kestrel-Ridge-JSM-Case-Study\.pptx/);
  assert.match(html, /aria-label="Show previous slide"/);
  assert.match(html, /aria-label="Show next slide"/);
  assert.match(html, /class="slide-counter"/);
  assert.ok(html.indexOf("Other projects") < html.indexOf("slide-1.png"));
});

test("renders an honest in-progress page for Quick-Fire Questions", async () => {
  const response = await render("/projects/quick-fire-questions");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Case study in progress/);
  assert.match(html, /No unfinished footage/);
});

test("renders the private Job Tracker demonstration without setup steps", async () => {
  const response = await render("/projects/job-application-tracker");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /\/projects\/job-application-tracker\/demonstration\.mp4/);
  assert.match(html, /Private until launch/);
  assert.doesNotMatch(html, /A simple first run/);
  assert.doesNotMatch(html, /Try it \/ 02/);
});

test("renders the QA report beside an in-page PDF viewer", async () => {
  const response = await render("/projects/concise-digital-work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Sanitised QA and bug reporting portfolio sample/);
  assert.match(html, /Read the full report/);
  assert.match(html, /\/projects\/concise-digital-work\/QA_Bug_Report\.pdf/);
  assert.match(html, /<dialog/);
  assert.match(html, /report-page-6\.png/);
});
