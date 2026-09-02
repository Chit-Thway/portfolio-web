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
  const headEnd = html.indexOf("</head>");
  assert.ok(headEnd > -1);
  const head = html.slice(0, headEnd);
  assert.match(
    html,
    /<title>CHIT THWAY \| Application Support, QA &amp; Web Support<\/title>/,
  );
  assert.match(
    head,
    /<link rel="canonical" href="https:\/\/chitthway-portfolio\.pages\.dev"\/?>/,
  );
  assert.match(
    head,
    /<meta property="og:url" content="https:\/\/chitthway-portfolio\.pages\.dev"\/?>/,
  );
  assert.match(head, /<meta property="og:image:width" content="1200"\/?>/);
  assert.match(head, /<meta property="og:image:height" content="627"\/?>/);
  assert.match(html, /Application support,/);
  assert.match(html, /troubleshooting/);
  assert.match(html, /software quality/);
  assert.match(html, /Job Application Tracker/);
  assert.match(html, /Portfolio V2/);
  assert.match(html, /Live, evolving and very much mine/);
  assert.match(html, /Windows Support Diagnostic Toolkit/);
  assert.match(html, /Storage Insights &amp; Guided Cleanup/);
  assert.match(html, /Web Development &amp; QA Work/);
  assert.match(html, /Flagship product · Live/);
  assert.match(html, /Live product · Free account available/);
  assert.match(html, /save up to 10 applications/);
  assert.match(html, /src="\/chit-thway-portrait\.jpg\?v=14019d07"/);
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
  assert.match(html, /View Memoir/);
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

test("renders the Outside the IDE photo stack", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Outside the IDE/);
  assert.match(html, /A life beyond the screen\./);
  assert.match(html, /Socials/);
  assert.match(html, /Travel/);
  assert.match(html, /Gaming/);
  assert.match(html, /Eating out/);
  assert.match(html, /Click to cycle/);
  assert.match(html, /aria-label=["']Show next photo: Socials["']/);
  assert.match(html, /aria-label=["']Choose an interest["']/);
  assert.match(html, /aria-live=["']polite["']/);
  assert.match(html, /src=["']\/life-beyond-screen\/socials-2\.webp["']/);
});

test("renders the Milestone 6 public GitHub activity and contact actions", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Recent works/);
  assert.match(html, /data-github-source=["']public-events["']/);
  assert.match(html, /Loading recent public activity/);
  assert.match(html, /Activity cells use recent public GitHub events and authored commits only/);
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

test("links the six selected projects to their case studies", async () => {
  const response = await render();
  const html = await response.text();

  for (const slug of [
    "portfolio-v2",
    "job-application-tracker",
    "windows-support-toolkit",
    "windows-storage-extension",
    "concise-digital-work",
    "jira-service-management",
  ]) {
    assert.match(html, new RegExp(`href=["']/projects/${slug}/["']`));
    assert.match(html, new RegExp(`aria-label=["']View [^"']+ case study["']`));
  }

  assert.doesNotMatch(html, /href=["']\/projects\/quick-fire-questions\/["']/);
  assert.doesNotMatch(html, /Explore case study|View repository/i);
  assert.ok(html.indexOf("Windows Support Diagnostic Toolkit") < html.indexOf("Storage Insights &amp; Guided Cleanup"));
});

test("renders the Portfolio V2 and Diary companion case studies in order", async () => {
  const response = await render("/projects/portfolio-v2");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /yes, you are looking at it\.\.\./);
  assert.match(html, /Portfolio V2 website case study, slide 1 of 6/);
  assert.match(html, /Portfolio-V2-Case-Study\.pptx/);
  assert.match(html, /The Diary deserves its own little detour\./);
  assert.match(html, /Portfolio Diary case study, slide 1 of 6/);
  assert.match(html, /Portfolio-Diary-Case-Study\.pptx/);
  assert.match(html, /How this project grew/);
  assert.match(html, /How this portfolio grew/);
  assert.match(html, /data-journey-kind="problem"/);
  assert.match(html, /data-journey-kind="solution"/);
  assert.match(html, /LinkedIn could not keep the evidence together/);
  assert.match(html, /Initial Problem/);
  assert.match(html, /Give every project one complete home/);
  assert.match(html, /First idea/);
  assert.doesNotMatch(html, /The evidence was scattered/);
  assert.match(html, /Create layers of information/);
  assert.match(html, /data-journey-highlight="true"/);
  assert.match(html, /Unexpected idea/);
  assert.match(html, /The personal section became a Diary/);
  assert.match(html, /Professional work and personality can coexist/);
  assert.match(html, /Content structure matters as much as visual design/);
  assert.match(html, /aria-label="Open the Diary \(opens in a new tab\)"/);
  assert.doesNotMatch(html, /data-journey-kind="decision"/);
  assert.ok(html.indexOf('class="case-hero"') < html.indexOf('data-project-journey="true"'));
  assert.ok(html.indexOf("The Diary deserves its own little detour.") < html.indexOf("Technology architecture"));
  assert.ok(html.indexOf("Portfolio V2 website case study") < html.indexOf("Portfolio Diary case study"));
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
  assert.match(html, /data-repository-link="true"/);
  assert.match(html, /<track[^>]*\sdefault(?:=|\s|>)/i);
  assert.match(html, /Technology architecture/);
  assert.match(html, /Read-only Windows evidence pipeline/);
  assert.match(html, /PowerShell/);
  assert.match(html, /Pytest/);
  assert.match(html, /How this toolkit grew/);
  assert.match(html, /Initial Problem/);
  assert.match(html, /First idea/);
  assert.match(html, /Make Windows evidence understandable/);
  assert.match(html, /Collect, validate, explain/);
  assert.match(html, /A local support workflow/);
  assert.doesNotMatch(html, /data-journey-link="true"/);
  assert.ok(html.indexOf("Technology architecture") < html.indexOf("What the project demonstrates"));
  assert.ok(html.indexOf("Other projects") < html.indexOf("demonstration.mp4"));
});

test("renders the Windows storage extension with a simple run and process tree", async () => {
  const response = await render("/projects/windows-storage-extension");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Storage Insights &amp; Guided Cleanup/);
  assert.match(html, /\/projects\/windows-storage-extension\/demonstration\.mp4/);
  assert.match(html, /\/projects\/windows-storage-extension\/demonstration\.vtt/);
  assert.match(html, /43 second demonstration/);
  assert.match(html, /Local storage evidence and guarded cleanup workflow/);
  assert.match(html, /non-overlapping drive accounting/i);
  assert.match(html, /Recycle Bin only/);
  assert.match(html, /python -m storage/);
  assert.match(html, /selected-drive-report\.json/);
  assert.match(html, /selected-drive-file-types\.json/);
  assert.match(html, /Replace C:\\ with the drive you want to review/);
  assert.match(html, /storage-extension-v2-ui-polish/);
  assert.match(html, /data-project-journey="true"/);
  assert.match(html, /How this extension grew/);
  assert.match(html, /A warning without a next step/);
  assert.match(html, /Find old files/);
  assert.match(html, /Pivot to file types/);
  assert.match(html, /Unexpected idea/);
  assert.match(html, /Scan once, filter many times/);
  assert.match(html, /Guardrails cannot fix the wrong model/);
  assert.doesNotMatch(html, /data-journey-link="true"/);
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
  assert.match(html, /data-slide-counter="true"/);
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

test("renders the public Job Tracker with its free plan and live actions", async () => {
  const response = await render("/projects/job-application-tracker");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /\/projects\/job-application-tracker\/demonstration\.mp4/);
  assert.match(html, /Live · Public/);
  assert.match(html, /Up to 10 saved applications/);
  assert.match(html, /Solo Product Architect and Full-Stack Engineer/);
  assert.match(html, /View live project/);
  assert.match(html, /Explore public demo/);
  assert.match(html, /Get Chrome extension/);
  assert.match(html, /chromewebstore\.google\.com\/detail\/job-application-tracker-c\/ofeagkadonbdgjhdiobfdnmafhoknkig/);
  assert.match(html, /Available on Chrome Web Store/);
  assert.match(html, /myjobtracker\.com\.au\/demo/);
  assert.match(html, /More than 200 automated tests/);
  assert.match(html, /Secure production job-search platform/);
  assert.match(html, /ASP\.NET Core MVC/);
  assert.match(html, /PostgreSQL/);
  assert.match(html, /Azure App Service/);
  assert.match(html, /Chrome Manifest V3/);
  assert.match(html, /How this tracker grew/);
  assert.match(html, /Initial Problem/);
  assert.match(html, /First idea/);
  assert.match(html, /Lost track in a phone interview/);
  assert.match(html, /Unexpected idea/);
  assert.match(html, /Inspired idea/);
  assert.match(html, /myjobtracker\.com\.au\/settings/);
  assert.doesNotMatch(html, /azurewebsites\.net|Private QA|QA in progress/);
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
