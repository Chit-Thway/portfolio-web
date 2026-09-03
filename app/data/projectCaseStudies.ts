export type ProjectMedia =
  | { kind: "video"; src: string; label: string; duration: string }
  | { kind: "slides"; slides: string[]; downloadHref: string; label: string }
  | { kind: "pdf"; src: string; coverSrc: string; pages: string[]; label: string }
  | { kind: "pending"; label: string; message: string };

export type ProjectStackIcon =
  | "react"
  | "typescript"
  | "cloudflare"
  | "powershell"
  | "windows"
  | "python"
  | "json"
  | "pytest"
  | "roblox"
  | "lua"
  | "github"
  | "branch"
  | "csharp"
  | "dotnet"
  | "database"
  | "shield"
  | "postgresql"
  | "supabase"
  | "azure"
  | "email"
  | "github-actions"
  | "chrome"
  | "html"
  | "css"
  | "javascript"
  | "testing"
  | "health"
  | "backup";

export type ProjectStack = {
  subtitle: string;
  mark: ProjectStackIcon;
  groups: Array<{
    label: string;
    items: Array<{ name: string; icon: ProjectStackIcon }>;
  }>;
  description: string;
};

export type ProjectJourneyData = {
  title: string;
  showLinks?: boolean;
  items: Array<{
    kind: "Goal" | "Problem" | "Solution" | "Result" | "Lesson";
    label?: "Initial Problem" | "First idea";
    title: string;
    detail: string;
    badge?: "Unexpected idea" | "Inspired idea";
    link?: {
      label: string;
      href: string;
    };
  }>;
};

export type ProjectCaseStudy = {
  slug: string;
  eyebrow: string;
  introduction: string;
  media: ProjectMedia;
  stack?: ProjectStack;
  companion?: {
    eyebrow: string;
    title: string;
    introduction: string;
    media: Extract<ProjectMedia, { kind: "slides" }>;
  };
  actions?: Array<{
    label: string;
    href?: string;
  }>;
  journey?: ProjectJourneyData;
  facts: Array<{ label: string; value: string }>;
  overview: string[];
  setup?: {
    introduction: string;
    requirements: string[];
    steps: Array<{ title: string; detail: string; command?: string }>;
  };
  decisions: Array<{ title: string; detail: string }>;
  note?: string;
};

const jiraSlides = Array.from(
  { length: 12 },
  (_, index) => `/projects/jira-service-management/slides/slide-${index + 1}.png`,
);

const qaReportPages = Array.from(
  { length: 6 },
  (_, index) => `/projects/concise-digital-work/report-page-${index + 1}.png`,
);

const portfolioSlides = Array.from(
  { length: 6 },
  (_, index) => `/projects/portfolio-v2/Portfolio-V2-Case-Study/slide-${index + 1}.png`,
);

const portfolioDiarySlides = Array.from(
  { length: 6 },
  (_, index) => `/projects/portfolio-v2/diary-slides/slide-${index + 1}.png`,
);

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "portfolio-v2",
    eyebrow: "A case study about this very website",
    introduction:
      "yes, you are looking at it... this is the project and the place where the project is being explained. I rebuilt the portfolio so the useful stuff is easy to find, the deeper proof is there when someone wants it, and the whole thing still feels like me.",
    media: {
      kind: "slides",
      slides: portfolioSlides,
      downloadHref: "/projects/portfolio-v2/Portfolio-V2-Case-Study.pptx",
      label: "Portfolio V2 website case study",
    },
    stack: {
      subtitle: "A React portfolio with a Cloudflare-backed personal archive",
      mark: "react",
      groups: [
        {
          label: "Interface",
          items: [
            { name: "React", icon: "react" },
            { name: "TypeScript", icon: "typescript" },
            { name: "CSS Modules", icon: "css" },
          ],
        },
        {
          label: "Framework",
          items: [
            { name: "Vinext", icon: "javascript" },
            { name: "Vite", icon: "javascript" },
          ],
        },
        {
          label: "Cloud",
          items: [
            { name: "Cloudflare Pages", icon: "cloudflare" },
            { name: "Wrangler", icon: "cloudflare" },
          ],
        },
        {
          label: "Data and media",
          items: [
            { name: "D1", icon: "database" },
            { name: "R2", icon: "cloudflare" },
          ],
        },
        {
          label: "Quality",
          items: [
            { name: "Rendered route checks", icon: "testing" },
            { name: "ESLint", icon: "testing" },
          ],
        },
      ],
      description:
        "The public portfolio stays mostly static and quick, while Cloudflare Pages Functions, D1 and R2 step in for the parts that genuinely need a backend—visitor data, Diary posts, private sessions and uploaded media.",
    },
    companion: {
      eyebrow: "The personal side of the build",
      title: "The Diary deserves its own little detour.",
      introduction:
        "The Diary started as a small personal archive and quietly became a proper feature: multi-media posts, audio, links, editing and a private publisher. Cramming all of that into the main deck felt a bit rude, so it gets its own six-slide case study here.",
      media: {
        kind: "slides",
        slides: portfolioDiarySlides,
        downloadHref: "/projects/portfolio-v2/Portfolio-Diary-Case-Study.pptx",
        label: "Portfolio Diary case study",
      },
    },
    actions: [
      {
        label: "View the live site",
        href: "https://chitthwayportfolio.com",
      },
    ],
    journey: {
      title: "How this portfolio grew",
      items: [
        {
          kind: "Problem",
          label: "Initial Problem",
          title: "LinkedIn could not keep the evidence together",
          detail:
            "I wanted employers to watch project demonstrations easily, but LinkedIn’s project section did not support video. Live projects, GitHub repositories, reports and presentations were also scattered across different places.",
        },
        {
          kind: "Solution",
          label: "First idea",
          title: "Give every project one complete home",
          detail:
            "I built my own portfolio so each project could bring its explanation, technology, video demonstration, repository, reports and supporting files together without LinkedIn’s layout and media limits.",
          link: {
            label: "Open the portfolio homepage",
            href: "https://chitthwayportfolio.com/",
          },
        },
        {
          kind: "Problem",
          title: "Too much detail could overwhelm a quick visitor",
          detail:
            "Employers might leave if they had to read an entire case study before understanding the project.",
        },
        {
          kind: "Solution",
          title: "Create layers of information",
          detail:
            "The homepage provides the quick version, project pages provide more detail, and presentations offer the complete case study.",
        },
        {
          kind: "Problem",
          title: "A professional feed is not a personal scrapbook",
          detail:
            "LinkedIn was useful for professional updates, but it was not the right place for sharing casual photos, audio and everyday moments.",
        },
        {
          kind: "Solution",
          title: "The personal section became a Diary",
          detail:
            "The original idea was simply to share casual moments and show life outside the IDE. While developing it, I realised those stories deserved their own Instagram-like Diary with photos, videos, writing and audio.",
          badge: "Unexpected idea",
          link: {
            label: "Open the Diary",
            href: "https://chitthwayportfolio.com/diary/",
          },
        },
        {
          kind: "Result",
          title: "Employers can choose how deeply to explore",
          detail:
            "They can scan the homepage, open a project, watch a demonstration or read the complete case study.",
          link: {
            label: "Open the live portfolio website",
            href: "https://chitthwayportfolio.com/",
          },
        },
        {
          kind: "Result",
          title: "Professional work and personality can coexist",
          detail:
            "The project pages remain focused while the Diary provides an optional view of life outside the IDE.",
        },
        {
          kind: "Lesson",
          title: "Content structure matters as much as visual design",
          detail:
            "Organising information around how employers browse was as important as choosing colors and layouts.",
        },
      ],
    },
    facts: [
      { label: "Status", value: "Live and still being polished" },
      { label: "Role", value: "Design, writing, build and delivery" },
      { label: "Hosting", value: "Cloudflare Pages" },
      { label: "Backend", value: "Pages Functions, D1 and R2" },
    ],
    overview: [
      "The problem was pretty simple: a list of skills can say a lot without really proving much. I wanted the first screen to tell someone who I am and what I do, then give every serious claim a short path to something real—working software, a case study, a public repository or a downloadable artifact.",
      "So I treated the portfolio like a product instead of a decorative résumé. The homepage handles the quick scan; project pages slow things down when the detail matters. Light and dark themes, keyboard-aware interactions, reduced-motion behaviour and clear fallbacks are part of the build rather than an accessibility paragraph added afterwards.",
      "There is also a more personal corner of the site. The Diary has its own production backend and publishing workflow, but it stays a supporting character here; its companion case study below tells that story properly.",
    ],
    decisions: [
      {
        title: "Get to the point",
        detail:
          "The opening screen covers role, location, availability and the useful next actions before asking anyone to scroll through my life story.",
      },
      {
        title: "Let the work explain itself",
        detail:
          "Project cards give the short version, while the deeper pages keep architecture, decisions, media and honest project status close together.",
      },
      {
        title: "Keep the human bit",
        detail:
          "The visual system stays restrained, but the writing, photo directory, life outside the IDE and Diary stop the site from feeling like a very tidy spreadsheet.",
      },
      {
        title: "Ship it like a real thing",
        detail:
          "Wrangler deployment, production bindings, rendered-route checks and backend tests make updates repeatable instead of depending on a lucky drag-and-drop release.",
      },
    ],
    note:
      "This page will probably keep changing a little, which is the point. The portfolio is live, but it is also allowed to grow as the work does.",
  },
  {
    slug: "windows-support-toolkit",
    eyebrow: "Support engineering case study",
    introduction:
      "A local, read-only diagnostic workflow that collects bounded Windows evidence, validates a structured report and turns it into clear support findings in a Python dashboard.",
    media: {
      kind: "video",
        src: "/projects/windows-support-toolkit/demonstration.mp4?v=fe683d4d",
      label: "Windows Support Diagnostic Toolkit demonstration",
      duration: "32 second demonstration",
    },
    stack: {
      subtitle: "Read-only Windows evidence pipeline",
      mark: "windows",
      groups: [
        {
          label: "Collection",
          items: [
            { name: "PowerShell", icon: "powershell" },
            { name: "Windows", icon: "windows" },
          ],
        },
        {
          label: "Evaluation",
          items: [
            { name: "Python", icon: "python" },
            { name: "JSON", icon: "json" },
          ],
        },
        {
          label: "Quality",
          items: [
            { name: "Pytest", icon: "pytest" },
            { name: "Safety validation", icon: "shield" },
          ],
        },
        {
          label: "Delivery",
          items: [{ name: "GitHub", icon: "github" }],
        },
      ],
      description:
        "A bounded PowerShell collector feeds a validated JSON contract into deterministic Python checks, keeping system evidence safe, testable and easy to explain.",
    },
    journey: {
      title: "How this toolkit grew",
      showLinks: false,
      items: [
        {
          kind: "Problem",
          label: "Initial Problem",
          title: "Make Windows evidence understandable",
          detail:
            "Windows troubleshooting needed a repeatable way to gather useful evidence and explain it clearly without uploading private machine data, changing system settings or claiming an automatic diagnosis.",
          link: {
            label: "Open the project README",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/tree/storage-extension-v2-ui-polish#readme",
          },
        },
        {
          kind: "Solution",
          label: "First idea",
          title: "Collect, validate, explain",
          detail:
            "A read-only PowerShell collector creates structured JSON. A separate local Flask dashboard validates it, applies deterministic support rules and presents plain-English explanations with safe manual actions.",
          link: {
            label: "Open the workflow explanation",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/tree/storage-extension-v2-ui-polish#how-it-works",
          },
        },
        {
          kind: "Result",
          title: "A local support workflow",
          detail:
            "The completed toolkit collects system, resource, network, service and recent event evidence, then produces readable findings while handling partial, unavailable, malformed and unsupported reports safely.",
          link: {
            label: "Open the synthetic dashboard screenshot",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/screenshots/dashboard-overview.png",
          },
        },
      ],
    },
    facts: [
      { label: "Environment", value: "Windows / local only" },
      { label: "Repository", value: "Public" },
      { label: "Focus", value: "Safe diagnostic evidence" },
    ],
    overview: [
      "The project separates data collection, report validation, deterministic evaluation and presentation into distinct stages. That makes the workflow easier to test and prevents the dashboard from silently changing a report or running system commands.",
      "Synthetic fixtures cover healthy, warning, problem, partial and malformed states. Real reports remain local because they can contain machine-specific information, while the public repository uses fictional data for demonstrations and automated checks.",
    ],
    setup: {
      introduction:
        "Use the included fictional sample first. You only need Windows, Python 3.10 or later and a modern browser.",
      requirements: ["Windows PowerShell 5.1", "Python 3.10+", "Git or a downloaded repository ZIP"],
      steps: [
        {
          title: "Open the project folder",
          detail: "Download or clone the repository, then open PowerShell inside the folder.",
        },
        {
          title: "Create the local Python environment",
          detail: "Create and activate a virtual environment so the project dependencies stay isolated.",
          command: "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1",
        },
        {
          title: "Install the requirements",
          detail: "Install the small set of packages used by the dashboard and its tests.",
          command: "python -m pip install -r requirements-dev.txt",
        },
        {
          title: "Start the dashboard",
          detail: "The default command opens the fictional sample report. Visit the local address shown below and stop it with Ctrl+C.",
          command: "python -m dashboard\nhttp://127.0.0.1:5000",
        },
      ],
    },
    decisions: [
      {
        title: "Read-only by design",
        detail:
          "The PowerShell collector gathers a deliberately limited evidence set. It does not repair Windows, retrieve secrets or send reports anywhere.",
      },
      {
        title: "Deterministic support findings",
        detail:
          "Documented rules produce Healthy, Warning, Problem or Unavailable states, with evidence and plain-English next actions rather than an opaque diagnosis.",
      },
      {
        title: "Failure-aware presentation",
        detail:
          "Missing files, malformed JSON, unsupported versions and partial collection produce useful error states instead of raw tracebacks or misleading success screens.",
      },
    ],
  },
  {
    slug: "windows-storage-extension",
    eyebrow: "Windows support extension",
    introduction:
      "A local storage-analysis and guided-cleanup extension that turns a broad disk-space warning into clear evidence, focused review and deliberately recoverable action.",
    media: {
      kind: "video",
        src: "/projects/windows-storage-extension/demonstration.mp4?v=5260c1b9",
      label: "Storage Insights and Guided Cleanup demonstration",
      duration: "43 second demonstration",
    },
    stack: {
      subtitle: "Local storage evidence and guarded cleanup workflow",
      mark: "python",
      groups: [
        {
          label: "Analysis",
          items: [
            { name: "Python", icon: "python" },
            { name: "Windows", icon: "windows" },
          ],
        },
        {
          label: "Interface",
          items: [
            { name: "Flask", icon: "python" },
            { name: "HTML", icon: "html" },
            { name: "CSS", icon: "css" },
            { name: "JavaScript", icon: "javascript" },
          ],
        },
        {
          label: "Contracts",
          items: [
            { name: "JSON Schema", icon: "json" },
            { name: "Versioned reports", icon: "database" },
          ],
        },
        {
          label: "Quality",
          items: [
            { name: "Pytest", icon: "pytest" },
            { name: "Safety validation", icon: "shield" },
          ],
        },
      ],
      description:
        "Explicit Python scanners produce validated local reports for a loopback-only Flask interface, while deterministic policy and immediate revalidation guard every cleanup action.",
    },
    actions: [
      {
        label: "View extension branch",
        href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/tree/storage-extension-v2-ui-polish",
      },
    ],
    journey: {
      title: "How this extension grew",
      showLinks: false,
      items: [
        {
          kind: "Problem",
          label: "Initial Problem",
          title: "A warning without a next step",
          detail:
            "The diagnostic dashboard could identify low disk space, but it could not show where the space had gone or help the user decide what to review next.",
          link: {
            label: "Open the storage extension roadmap",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md",
          },
        },
        {
          kind: "Solution",
          label: "First idea",
          title: "Find old files",
          detail:
            "Scan file metadata, mark anything unchanged for 730 days as Stale, identify large, empty, temporary or incomplete files, and let the user filter candidates for reviewed Recycle Bin cleanup.",
          link: {
            label: "Open the original classification model",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/storage/README.md#classification-settings",
          },
        },
        {
          kind: "Result",
          title: "The age-led prototype worked",
          detail:
            "The first extension produced metadata-only reports, displayed candidate files, supported Match all and Match any filtering, and added an exact-path preview before moving selected eligible files to the Recycle Bin.",
          link: {
            label: "Open the initial guided-cleanup implementation",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/8",
          },
        },
        {
          kind: "Problem",
          title: "Old did not mean disposable",
          detail:
            "An untouched file could still be a game save, configuration, installer, database, application asset or personal archive. Modification age explained when something changed—not whether it remained important.",
          link: {
            label: "Open the storage safety principles",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md#safety-principles",
          },
        },
        {
          kind: "Solution",
          title: "Separate clues from permission",
          detail:
            "Candidate evidence, technical eligibility and removal risk became separate concepts. High-risk application data, saves, installers, databases, configuration files and protected locations remained visible but could not be selected.",
          link: {
            label: "Open the Milestone 7 hardening work",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/9",
          },
        },
        {
          kind: "Problem",
          title: "The totals were misleading",
          detail:
            "Logical file length did not always equal physical disk use. Hard links could be counted more than once, inaccessible space remained unknown and bounded candidate rows could hide important files.",
          link: {
            label: "Open the storage accounting contract",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/storage-report-contract.md",
          },
        },
        {
          kind: "Solution",
          title: "Measure physical use properly",
          detail:
            "The scanner adopted Windows allocated-size metadata, stable file identities for hard-link deduplication, explicit unclassified space and deterministic retention favouring physically larger and safer candidates.",
          link: {
            label: "Open the physical-accounting changes",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/9",
          },
        },
        {
          kind: "Problem",
          title: "Folders made everything harder",
          detail:
            "Grouping files into folders reduced the number of rows, but parent and child totals overlapped, stale folders repeated evidence, and one changed or inaccessible descendant could invalidate an action.",
          link: {
            label: "Open the folder-analysis amendment",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md#milestone-8--folder-analysis-amendment",
          },
        },
        {
          kind: "Solution",
          title: "Harden the folder experiment",
          detail:
            "Equivalent stale chains were collapsed, overlapping parent-and-child selections were rejected, risky trees became review-only, and every descendant was revalidated using a metadata-only fingerprint.",
          link: {
            label: "Open the folder cleanup safeguards",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/guided-cleanup.md#immediate-safety-checks",
          },
        },
        {
          kind: "Problem",
          title: "It was still the wrong question",
          detail:
            "Even after extensive safeguards, the workflow still centred on which old files could be removed. That remained uncertain and did not help users explore storage through things they recognized.",
          link: {
            label: "Open the recorded product-direction change",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md#milestone-8--folder-analysis-amendment",
          },
        },
        {
          kind: "Solution",
          badge: "Unexpected idea",
          title: "Pivot to file types",
          detail:
            "The project became a File-Type Explorer: scan each drive once, group recognizable extensions, rank folders by matching content, choose non-overlapping scopes and inspect exact files without treating age as permission.",
          link: {
            label: "Open the File-Type Explorer contract",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/file-type-index-contract.md",
          },
        },
        {
          kind: "Problem",
          title: "Filtering could not rescan the drive",
          detail:
            "A whole-drive traversal could be slow or partial. Repeating it whenever the user selected Documents, Videos, Archives or another extension group would make the explorer impractical.",
          link: {
            label: "Open the whole-drive indexer pull request",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/10",
          },
        },
        {
          kind: "Solution",
          title: "Scan once, filter many times",
          detail:
            "A separate per-drive index stores exact folder and preset-extension aggregates from one metadata-only traversal. File details can remain bounded while filters and ranked folder totals stay truthful without another scan.",
          link: {
            label: "Open the whole-drive index design",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/file-type-index-contract.md#create-a-local-index",
          },
        },
        {
          kind: "Result",
          title: "A review system, not a cleaner",
          detail:
            "The final extension helps users understand storage by familiar file types, narrow the search to exact folders and files, and move only explicitly reviewed, unchanged, eligible items to the Recycle Bin.",
          link: {
            label: "Open the sanitized demonstration",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/portfolio-demo/toolkit-sanitized-preview.gif",
          },
        },
        {
          kind: "Lesson",
          title: "Guardrails cannot fix the wrong model",
          detail:
            "The age-led version grew increasingly complicated as protections were added. The stronger solution came from changing the organizing idea—from predicting disposability to helping users explore recognizable evidence.",
          link: {
            label: "Open the storage extension history",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md",
          },
        },
      ],
    },
    facts: [
      { label: "Status", value: "Extension complete" },
      { label: "Environment", value: "Windows / local only" },
      { label: "Analysis", value: "Metadata only" },
      { label: "Cleanup", value: "Recycle Bin only" },
    ],
    overview: [
      "Storage Insights extends the diagnostic toolkit beyond a simple low-space warning. An explicitly started scanner records local file metadata, drive capacity, coverage and inaccessible paths, then presents non-overlapping categories that explain where physical drive space is being used without pretending partial evidence is complete.",
      "The dashboard supports individual-file, folder and file-type exploration. Stored aggregates let filters and ranked folders update without silently rescanning the drive, while protected locations, review-only items and incomplete coverage remain visible instead of being simplified into unsafe cleanup recommendations.",
      "Selecting an item changes nothing. Cleanup requires a separate exact-path preview and explicit confirmation, followed by immediate checks of scope, metadata, risk and reparse-point state. Eligible unchanged items are sent to the Windows Recycle Bin; permanent deletion is never used as a fallback.",
    ],
    setup: {
      introduction:
        "This example analyses one drive. Replace C:\\ with the drive you want to review; repeat it with different output names only when you need another drive.",
      requirements: [
        "Windows PowerShell 5.1",
        "Python 3.10+",
        "Git or a downloaded repository ZIP",
      ],
      steps: [
        {
          title: "Set up the project once",
          detail: "Open PowerShell in the downloaded project folder, then create the local environment and install its requirements.",
          command:
            "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npython -m pip install -r requirements-dev.txt",
        },
        {
          title: "Generate the three local reports",
          detail: "Create the Windows report, storage analysis and File-Type Explorer index. Change C:\\ to the drive you want to inspect.",
          command:
            "powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\\collector\\Collect-Diagnostics.ps1' -OutputPath '.\\reports\\first-report.json'\npython -m storage --root 'C:\\' --output 'selected-drive-report.json'\npython -m storage.file_type_indexer --drive 'C:\\' --output 'selected-drive-file-types.json'",
        },
        {
          title: "Open everything together",
          detail: "Start the private local dashboard with the three reports you just created, then open the local address shown in PowerShell.",
          command:
            "python -m dashboard --report '.\\reports\\first-report.json' --storage-report '.\\storage-reports\\selected-drive-report.json' --file-type-index '.\\storage-reports\\selected-drive-file-types.json'\nhttp://127.0.0.1:5000",
        },
      ],
    },
    decisions: [
      {
        title: "Make every scan explicit",
        detail:
          "The dashboard never starts a filesystem scan silently. Users select the roots and run the scanner themselves, keeping scope and cost visible.",
      },
      {
        title: "Keep the accounting honest",
        detail:
          "Drive categories do not overlap, partial scans disclose their limits and folder hierarchy totals are never misrepresented as uniquely recoverable physical space.",
      },
      {
        title: "Separate review from action",
        detail:
          "Filters, selections and previews remain read-only. Cleanup requires another confirmation and live revalidation before Windows receives a Recycle Bin request.",
      },
      {
        title: "Fail toward safety",
        detail:
          "Protected paths, reparse points, changed files, review-only risks and incomplete evidence disable cleanup rather than being treated as permission to proceed.",
      },
    ],
    note:
      "This extension analyses local metadata and supports guided review; it does not claim that an old or large item is safe to remove. Recycle Bin recovery remains controlled by Windows.",
  },
  {
    slug: "jira-service-management",
    eyebrow: "IT service management case study",
    introduction:
      "A fictional internal service desk designed to show structured intake, investigation, approvals, SLA monitoring, automation, knowledge management and reporting as one traceable support story.",
    media: {
      kind: "slides",
      slides: jiraSlides,
      downloadHref: "/projects/jira-service-management/Kestrel-Ridge-JSM-Case-Study.pptx",
      label: "Kestrel Ridge IT Service Desk case study",
    },
    facts: [
      { label: "Evidence", value: "12-slide case study" },
      { label: "Scenario", value: "Fictional organisation" },
      { label: "Repository", value: "Public" },
    ],
    overview: [
      "Kestrel Ridge is a fictional organisation whose employees need clear paths for account access, software, devices, onboarding and business-application support. The simulation uses structured forms and portal groups to collect useful information before an agent begins work.",
      "The case study follows requests through investigation, internal communication, approval, queue monitoring, resolution automation, knowledge articles and reports. It also states the simulation limits clearly so the evidence is not presented as a live production service desk.",
    ],
    decisions: [
      {
        title: "Structured intake",
        detail:
          "Plain-language request types collect identity, business context, equipment, urgency and approval information while keeping customer-facing comments separate from internal investigation notes.",
      },
      {
        title: "Governed support work",
        detail:
          "Approval-aware requests, priority, SLA queues and audit history make it possible to see what is waiting, what breached and why a resolution was recorded.",
      },
      {
        title: "Reusable support knowledge",
        detail:
          "Knowledge articles and reporting turn recurring issues into guidance and make service-desk mechanics visible without relying on customer satisfaction claims that were never collected.",
      },
    ],
    note:
      "This is a fictional portfolio simulation. It does not represent a live identity provider, software catalogue, asset database, production customer base or real customer satisfaction dataset.",
  },
  {
    slug: "quick-fire-questions",
    eyebrow: "Collaborative software project",
    introduction:
      "A multiplayer Roblox experience built around rapid question rounds, time pressure and unique-answer validation across client and server boundaries.",
    media: {
      kind: "pending",
      label: "Case study in progress",
      message:
        "The project is still being prepared for a public portfolio release. A verified demonstration and fuller technical breakdown will be added when the work is ready to present.",
    },
    stack: {
      subtitle: "Timed multiplayer Roblox experience",
      mark: "roblox",
      groups: [
        {
          label: "Platform",
          items: [{ name: "Roblox Studio", icon: "roblox" }],
        },
        {
          label: "Scripting",
          items: [{ name: "Lua", icon: "lua" }],
        },
        {
          label: "Workflow",
          items: [
            { name: "Rojo", icon: "branch" },
            { name: "GitHub", icon: "github" },
          ],
        },
        {
          label: "Testing",
          items: [{ name: "Two-client testing", icon: "testing" }],
        },
      ],
      description:
        "Timer, interface and answer-validation logic cross the client/server boundary, supported by branch-based collaboration and two-client multiplayer testing.",
    },
    facts: [
      { label: "Status", value: "In progress" },
      { label: "Repository", value: "Private" },
      { label: "Format", value: "Multiplayer Roblox experience" },
    ],
    overview: [
      "The project combines timed rounds, interface behaviour and answer validation in a multiplayer environment. Work was coordinated through a shared, branch-based source-control workflow.",
      "Two-client testing was used to check behaviour that crosses the client/server boundary. The public case study remains intentionally limited until the team has a stable demonstration and material that can be shared responsibly.",
    ],
    decisions: [
      {
        title: "Server-aware validation",
        detail:
          "Answer behaviour has to remain consistent for multiple players rather than being trusted only from one client view.",
      },
      {
        title: "Collaborative delivery",
        detail:
          "The project uses shared source control and branch-based contributions instead of treating the experience as a single-person prototype.",
      },
      {
        title: "Honest portfolio scope",
        detail:
          "No unfinished footage, unverified result or private repository link is being presented as a completed public case study.",
      },
    ],
  },
  {
    slug: "job-application-tracker",
    eyebrow: "Production full-stack product",
    introduction:
      "A public, production-deployed job application tracker where anyone can create a free account, save up to 10 applications, capture job details and manage the work around each application.",
    media: {
      kind: "video",
        src: "/projects/job-application-tracker/demonstration.mp4?v=528b5984",
      label: "Job Application Tracker demonstration",
      duration: "49 second demonstration",
    },
    stack: {
      subtitle: "Secure production job-search platform",
      mark: "csharp",
      groups: [
        {
          label: "Backend",
          items: [
            { name: "C#", icon: "csharp" },
            { name: ".NET 10", icon: "dotnet" },
            { name: "ASP.NET Core MVC", icon: "dotnet" },
            { name: "Entity Framework Core", icon: "database" },
            { name: "ASP.NET Core Identity", icon: "shield" },
          ],
        },
        {
          label: "Data",
          items: [
            { name: "PostgreSQL", icon: "postgresql" },
            { name: "Supabase", icon: "supabase" },
          ],
        },
        {
          label: "Cloud",
          items: [
            { name: "Azure App Service", icon: "azure" },
            { name: "Azure Email", icon: "email" },
            { name: "GitHub Actions", icon: "github-actions" },
          ],
        },
        {
          label: "Browser",
          items: [
            { name: "Chrome Manifest V3", icon: "chrome" },
            { name: "HTML", icon: "html" },
            { name: "CSS", icon: "css" },
            { name: "JavaScript", icon: "javascript" },
          ],
        },
        {
          label: "Quality",
          items: [
            { name: "200+ automated tests", icon: "testing" },
            { name: "Health monitoring", icon: "health" },
            { name: "Backup / restore", icon: "backup" },
          ],
        },
      ],
      description:
        "A layered ASP.NET Core product joins private user workflows, PostgreSQL persistence, automated retention and browser capture with monitored Azure delivery.",
    },
    actions: [
      {
        label: "View live project",
        href: "https://myjobtracker.com.au/",
      },
      {
        label: "Explore public demo",
        href: "https://myjobtracker.com.au/demo",
      },
      {
        label: "Get Chrome extension",
        href: "https://chromewebstore.google.com/detail/job-application-tracker-c/ofeagkadonbdgjhdiobfdnmafhoknkig",
      },
    ],
    journey: {
      title: "How this tracker grew",
      items: [
        {
          kind: "Problem",
          label: "Initial Problem",
          title: "Lost track in a phone interview",
          detail:
            "After applying for several IT jobs, I received a phone call about a role but could not remember the company or when I had applied. I wanted to stop that happening again.",
        },
        {
          kind: "Solution",
          label: "First idea",
          title: "One place for every application",
          detail:
            "I built a private workspace that keeps applications, status history, contacts, notes, tasks and appointments together while showing the next action.",
          link: {
            label: "Open the Job Application Tracker",
            href: "https://myjobtracker.com.au/",
          },
        },
        {
          kind: "Problem",
          title: "Imports were inconsistent",
          detail:
            "Copying and pasting job details was tiring, while job links and page layouts varied too much between job boards for importing to be reliable enough on their own.",
        },
        {
          kind: "Solution",
          badge: "Unexpected idea",
          title: "Capture from the active tab",
          detail:
            "I built a browser extension that reads the current job-ad tab only after a click, then opens the captured details as a private review draft.",
          link: {
            label: "Open the Chrome Web Store listing",
            href: "https://chromewebstore.google.com/detail/job-application-tracker-c/ofeagkadonbdgjhdiobfdnmafhoknkig",
          },
        },
        {
          kind: "Problem",
          title: "Manage who can use the tracker",
          detail:
            "Once accounts could be created, I needed a way to control access and manage users without opening their private job-search records.",
        },
        {
          kind: "Solution",
          badge: "Inspired idea",
          title: "Create an admin-only area",
          detail:
            "I created an administrator area for managing users, account tiers, verification, access locks and deletion, inspired by an admin page I worked on with my supervisor Chris for Accessory Archive.",
          link: {
            label: "Open Accessory Archive",
            href: "https://accessory-archive.dev4.concise.digital/",
          },
        },
        {
          kind: "Problem",
          title: "A fixed ghosting rule was too rigid",
          detail:
            "The original plan used a fixed 30-day ghosting rule. Later, I wanted the timing to adjust through Settings so the tracker could fit different job-search situations.",
        },
        {
          kind: "Solution",
          title: "Give users more control",
          detail:
            "Rather than relying only on a fixed rule, the tracker evolved toward user-controlled timing and settings for how older applications are handled.",
          link: {
            label: "Open tracker settings",
            href: "https://myjobtracker.com.au/settings",
          },
        },
        {
          kind: "Result",
          title: "A complete and mature tracker",
          detail:
            "The project grew into a private job-search workspace with capture tools, application history, reminders, admin controls, verified accounts, secure handoff, browser tests, accessibility checks and operational documentation.",
        },
        {
          kind: "Lesson",
          title: "A job search is more than applications",
          detail:
            "Building the project showed that a job search also includes follow-ups, conversations, interviews, waiting for replies and knowing what to do next.",
        },
      ],
    },
    facts: [
      { label: "Status", value: "Live · Public" },
      { label: "Free plan", value: "Up to 10 saved applications" },
      { label: "Role", value: "Solo Product Architect and Full-Stack Engineer" },
      { label: "Hosting", value: "Azure App Service" },
      { label: "Extension", value: "Available on Chrome Web Store" },
    ],
    overview: [
      "Job Application Tracker is now publicly available. Anyone can create a free account, save up to 10 applications, capture job advertisements, review structured information, track progress through a visual pipeline, record contacts and interactions, and plan tasks and appointments.",
      "Applications can be marked as Saved for permanent retention. Older unsaved records enter a configurable deletion schedule, giving users time to review or preserve them before automated cleanup. The platform also includes ghosting warnings, status history, bulk actions, light and dark themes, a public synthetic demo and a role-protected administration portal with audit history.",
      "The live service runs at myjobtracker.com.au on Azure App Service with a separate Supabase PostgreSQL database, email-verification and password-reset workflows, scheduled retention processing, health monitoring, tested backup and restoration procedures, and protected GitHub Actions deployment. Its approved Manifest V3 companion extension is publicly available from the Chrome Web Store.",
    ],
    decisions: [
      {
        title: "Secure, owner-scoped data",
        detail:
          "ASP.NET Core Identity, email verification, password reset and one-time invitations protect private application data and keep every user’s records isolated.",
      },
      {
        title: "Deterministic job capture",
        detail:
          "Manual entry, pasted descriptions, URL imports and browser capture feed a review workflow that extracts structured metadata without relying on an external AI API.",
      },
      {
        title: "Retention with user control",
        detail:
          "Saved records are preserved permanently, while configurable cleanup schedules warn users before old unsaved applications are removed.",
      },
      {
        title: "Production delivery",
        detail:
          "GitHub Actions, Azure OIDC, PostgreSQL migrations, health checks, scheduled jobs and tested backup and restore procedures support reliable releases.",
      },
      {
        title: "Evidence-led quality",
        detail:
          "More than 200 automated tests cover the product, while real-world use continues to identify issues and guide improvements after its public release.",
      },
    ],
    note:
      "Live at myjobtracker.com.au. Anyone can create a free account and save up to 10 applications; the synthetic public demo remains available without registration.",
  },
  {
    slug: "concise-digital-work",
    eyebrow: "Quality assurance portfolio sample",
    introduction:
      "A sanitised bug-reporting sample rewritten from staging-environment QA work to demonstrate reproducibility, impact analysis, expected-versus-actual results and useful investigation notes without exposing a private client system.",
    media: {
      kind: "pdf",
      src: "/projects/concise-digital-work/QA_Bug_Report.pdf",
      coverSrc: "/projects/concise-digital-work/report-cover.png",
      pages: qaReportPages,
      label: "Sanitised QA and bug reporting portfolio sample",
    },
    facts: [
      { label: "Format", value: "Six-page PDF" },
      { label: "Reports", value: "Five sanitised issues" },
      { label: "Source", value: "Internship QA work" },
    ],
    overview: [
      "The report covers rental-limit state, Safari layout behaviour, a combined-filter server error, missing-price availability logic and unresolved item-status consistency. Each issue records its area, priority, severity, reproducibility, impact, steps, expected result, actual result and a practical place to investigate.",
      "Company names, URLs, accounts, people and private identifiers were removed or generalised. Screenshots are intentionally excluded, while the writing preserves the structure and support thinking that would make the original reports useful to developers and service teams.",
    ],
    decisions: [
      {
        title: "Reproducible evidence",
        detail:
          "Each report gives a reader a repeatable path through the affected workflow and distinguishes observed behaviour from a possible cause.",
      },
      {
        title: "User and operational impact",
        detail:
          "The reports explain why the issue matters, including blocked rentals, unreliable filters, misleading messages and unsafe availability states.",
      },
      {
        title: "Privacy-preserving presentation",
        detail:
          "The portfolio communicates QA quality without publishing client screenshots, exact routes, credentials, internal identifiers or private contact information.",
      },
    ],
    note:
      "This document is a sanitised portfolio sample. It demonstrates report structure and investigation approach rather than exposing the private system where the original observations were made.",
  },
];

export function getProjectCaseStudy(slug: string): ProjectCaseStudy | undefined {
  return projectCaseStudies.find((project) => project.slug === slug);
}
