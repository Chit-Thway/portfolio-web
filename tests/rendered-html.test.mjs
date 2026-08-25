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
  assert.match(html, /Application support,/);
  assert.match(html, /troubleshooting/);
  assert.match(html, /software quality/);
  assert.match(html, /Job Application Tracker/);
  assert.match(html, /Windows Support Diagnostic Toolkit/);
  assert.match(html, /Web Development &amp; QA Work/);
  assert.match(html, /Flagship product · Live/);
  assert.match(html, /Live product · Public demo available/);
  assert.match(html, /src="\/chit-thway-portrait\.jpg\?v=49cf7aef"/);
  assert.match(html, /Jira Service Management Simulation/);
  assert.match(html, /Service-management simulation · Public/);
  assert.doesNotMatch(html, /\/_next\/image\?url=/);
  assert.match(html, /Skip to content/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /href=["']#["']/i);
  assert.doesNotMatch(html, /href=["']\/visitor\/?["']/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(html, new RegExp(["Ch", "ris"].join(""), "i"));
  assert.doesNotMatch(html, /dark-comedy game prototype/i);
});

test("renders the bounded Version 2 navigation", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /href=["']#home["']/);
  assert.match(html, /href=["']#projects["']/);
  assert.match(html, />Projects</);
  assert.match(html, /href=["']#experience["']/);
  assert.match(html, />Experience</);
  assert.match(html, /href=["']\/diary\/["']/);
  assert.match(html, />Diary</);
  assert.doesNotMatch(html, /aria-disabled=["']true["']/);
  assert.doesNotMatch(html, /href=["']#(?:skills|education|contact)["']/);
});

test("renders the Milestone 2 profile directory", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Three files\. The useful context\./);
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-orientation="vertical"/);
  assert.match(html, /bio\.md/);
  assert.match(html, /education\.md/);
  assert.match(html, /location\.md/);
  assert.match(html, /Support-minded by design\./);
  assert.match(html, /Investigate, validate, communicate/);
  assert.match(html, /role="tabpanel"/);
  assert.doesNotMatch(html, /C:\\portfolio|Hello, World/i);
});

test("renders the Milestone 4 experience and technology evidence", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Work shaped by real users\./);
  assert.match(html, /Tools I use in context\./);
  assert.match(html, /Crown Events and Conferences/);
  assert.match(html, /Concise Digital/);
  assert.match(html, /4LifeSkills/);

  const currentRole = html.indexOf("January 2023 – Present");
  const webInternship = html.indexOf("April 2026 – June 2026");
  const learningInternship = html.indexOf("November 2025 – December 2025");
  assert.ok(currentRole >= 0 && currentRole < webInternship);
  assert.ok(webInternship < learningInternship);

  assert.match(html, /Application development/);
  assert.match(html, /Support and quality/);
  assert.match(html, /Platforms and delivery/);
  assert.match(html, /PowerShell/);
  assert.match(html, /PostgreSQL/);
  assert.match(html, /Pause motion/);
  assert.match(html, /aria-pressed=["']false["']/);
  assert.match(html, /data-direction=["']left["']/);
  assert.match(html, /data-direction=["']right["']/);
});

test("renders the Milestone 5 Outside the IDE stack with honest temporary media", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Outside the IDE/);
  assert.match(html, /A life beyond the screen\./);
  assert.match(html, /Gym/);
  assert.match(html, /Gaming/);
  assert.match(html, /Going out/);
  assert.match(html, /Eating out/);
  assert.match(html, /Temporary image/);
  assert.match(html, /Click to cycle/);
  assert.match(html, /aria-label=["']Show next interest: Gaming["']/);
  assert.match(html, /aria-label=["']Choose an interest["']/);
  assert.match(html, /aria-live=["']polite["']/);
  assert.match(html, /src=["']\/chit-thway-portrait\.jpg\?v=49cf7aef["']/);
});

test("renders the Milestone 6 public GitHub activity and contact actions", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Recent work, shown honestly\./);
  assert.match(html, /data-github-source=["']public-events["']/);
  assert.match(html, /Loading recent public activity/);
  assert.match(html, /Public events only · recent 30-day window/);
  assert.match(html, /href=["']https:\/\/github\.com\/Chit-Thway["']/);
  assert.match(html, /Let’s solve something useful\./);
  assert.match(html, /id=["']contact["']/);
  assert.match(html, /href=["']mailto:chitthway67@gmail\.com["']/);
  assert.match(html, /linkedin\.com\/in\/chit-thway-197241332/);
  assert.match(html, /Review public repositories/);
  assert.match(html, /href=["']\/chit-thway-resume\.pdf["']/);
  assert.match(html, /download(?:=["']["'])?/);
  assert.match(html, /Download résumé/);
  assert.match(html, /Download PDF/);
});

test("links the four selected projects to their case studies", async () => {
  const response = await render();
  const html = await response.text();

  for (const slug of [
    "job-application-tracker",
    "windows-support-toolkit",
    "concise-digital-work",
    "jira-service-management",
  ]) {
    assert.match(html, new RegExp(`href=["']/projects/${slug}/["']`));
    assert.match(html, new RegExp(`aria-label=["']View [^"']+ case study["']`));
  }

  assert.doesNotMatch(html, /href=["']\/projects\/quick-fire-questions\/["']/);
  assert.doesNotMatch(html, /Explore case study|View repository/i);
});

test("renders the Windows toolkit video and simple setup", async () => {
  const response = await render("/projects/windows-support-toolkit");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /data-portfolio-version="2"/);
  assert.match(html, /href="mailto:chitthway67@gmail\.com"/);
  assert.doesNotMatch(html, /href="\/projects\/quick-fire-questions\/"/);
  assert.match(html, /Windows Support Diagnostic Toolkit/);
  assert.match(html, /\/projects\/windows-support-toolkit\/demonstration\.mp4/);
  assert.match(html, /A simple first run/);
  assert.match(html, /python -m dashboard/);
  assert.match(html, /class="repository-button case-title-repository"/);
  assert.match(html, /<track[^>]*\sdefault(?:=|\s|>)/i);
  assert.match(html, /Technology architecture/);
  assert.match(html, /Read-only Windows evidence pipeline/);
  assert.match(html, /PowerShell/);
  assert.match(html, /Pytest/);
  assert.ok(html.indexOf("Technology architecture") < html.indexOf("What the project demonstrates"));
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
  assert.match(html, /Timed multiplayer Roblox experience/);
  assert.match(html, /Roblox Studio/);
  assert.match(html, /Two-client testing/);
});

test("renders the deployed Job Tracker with live actions and no setup steps", async () => {
  const response = await render("/projects/job-application-tracker");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /\/projects\/job-application-tracker\/demonstration\.mp4/);
  assert.match(html, /Deployed MVP — Private QA/);
  assert.match(html, /Solo Product Architect and Full-Stack Engineer/);
  assert.match(html, /View live project/);
  assert.match(html, /Explore public demo/);
  assert.match(html, /Get Chrome extension/);
  assert.match(html, /chromewebstore\.google\.com\/detail\/job-application-tracker-c\/ofeagkadonbdgjhdiobfdnmafhoknkig/);
  assert.match(html, /Available on Chrome Web Store/);
  assert.match(html, /azurewebsites\.net\/demo/);
  assert.match(html, /More than 200 automated tests/);
  assert.match(html, /Secure production job-search platform/);
  assert.match(html, /ASP\.NET Core MVC/);
  assert.match(html, /PostgreSQL/);
  assert.match(html, /Azure App Service/);
  assert.match(html, /Chrome Manifest V3/);
  assert.doesNotMatch(html, /pending review|awaiting (Google )?review|not publicly available yet/i);
  assert.ok(html.indexOf("Technology architecture") < html.indexOf("What the project demonstrates"));
  assert.doesNotMatch(html, /Private until launch|production hosting[^<]*not available|final application domain[^<]*not available/i);
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

test("renders the unlisted visitor department with no-index metadata", async () => {
  const response = await render("/visitor");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /You found the visitor department/);
  assert.match(html, /One anonymous browser profile counts once per Perth week/);
  assert.match(html, /No names, accounts or raw IP addresses are stored/);
  assert.match(html, /name="robots"[^>]*noindex/i);
  assert.doesNotMatch(html, /Sign in|Log in|Password/i);
});
test("renders the Milestone 7 Diary and keeps administration unlisted", async () => {
  const diaryResponse = await render("/diary");
  assert.equal(diaryResponse.status, 200);
  const diaryHtml = await diaryResponse.text();

  assert.match(diaryHtml, /<title>Diary \| CHIT THWAY<\/title>/);
  assert.match(diaryHtml, /Small moments, kept with intention\./);
  assert.match(diaryHtml, /Checking the Diary\./);
  assert.match(diaryHtml, /Latest entries/);
  assert.doesNotMatch(diaryHtml, /A personal archive, newest first\./);
  assert.doesNotMatch(diaryHtml, /href=["']\/login\/?["']/);

  const loginResponse = await render("/login");
  assert.equal(loginResponse.status, 200);
  const loginHtml = await loginResponse.text();

  assert.match(loginHtml, /<title>Private Entrance \| CHIT THWAY<\/title>/);
  assert.match(loginHtml, /name=["']robots["'][^>]*noindex/i);
  assert.match(loginHtml, /Admin passphrase/);
  assert.match(loginHtml, /Private entrance\./);

  const manageResponse = await render("/diary/manage");
  assert.equal(manageResponse.status, 200);
  const manageHtml = await manageResponse.text();

  assert.match(manageHtml, /<title>Diary Publisher \| CHIT THWAY<\/title>/);
  assert.match(manageHtml, /name=["']robots["'][^>]*noindex/i);
  assert.match(manageHtml, /Publish a moment\./);
  assert.match(manageHtml, /Checking the publishing session/);
});
