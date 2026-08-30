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
  journey?: {
    title: string;
    items: Array<{
      kind: "Goal" | "Problem" | "Solution" | "Result" | "Lesson";
      title: string;
      detail: string;
      link?: {
        label: string;
        href: string;
      };
    }>;
  };
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
        href: "https://chitthway-portfolio.pages.dev",
      },
    ],
    journey: {
      title: "How this portfolio grew",
      items: [
        {
          kind: "Goal",
          title: "Give employers proof, not just claims",
          detail:
            "I wanted employers to see live demonstrations, understand each project quickly and judge the work for themselves.",
        },
        {
          kind: "Problem",
          title: "The evidence was scattered",
          detail:
            "LinkedIn’s limitations meant live projects, repositories, videos, reports and presentations all lived in different places.",
        },
        {
          kind: "Solution",
          title: "Give every project one complete home",
          detail:
            "I built my own portfolio so each project could bring its explanation, technology, demonstration, repository and supporting files together.",
          link: {
            label: "Open the portfolio homepage",
            href: "https://chitthway-portfolio.pages.dev/",
          },
        },
        {
          kind: "Problem",
          title: "Too much detail could overwhelm a quick visitor",
          detail:
            "Employers might leave if they had to read an entire case study before understanding what a project demonstrates.",
        },
        {
          kind: "Solution",
          title: "Create layers of information",
          detail:
            "The homepage provides the quick version, project pages provide the important detail, and presentations offer the deepest explanation.",
        },
        {
          kind: "Problem",
          title: "A professional feed is not a personal scrapbook",
          detail:
            "Posting casual photos and small moments repeatedly on LinkedIn would bury the work, but hiding that side of me felt incomplete too.",
        },
        {
          kind: "Solution",
          title: "Give the personal side its own home",
          detail:
            "I built the Diary: an Instagram-like visual feed with audio that shows I have a life outside the IDE without making the professional story noisy.",
          link: {
            label: "Open the Diary",
            href: "https://chitthway-portfolio.pages.dev/diary/",
          },
        },
        {
          kind: "Result",
          title: "Employers can choose how deeply to explore",
          detail:
            "They can scan the homepage, open a project, watch a demonstration, inspect the technology or read a complete case study.",
          link: {
            label: "Open the live portfolio website",
            href: "https://chitthway-portfolio.pages.dev/",
          },
        },
        {
          kind: "Result",
          title: "Professional work and personality can coexist",
          detail:
            "Project pages remain focused while the Diary provides an optional view of my life outside the IDE.",
        },
        {
          kind: "Lesson",
          title: "Content structure matters as much as visual design",
          detail:
            "Organising information around how employers browse was just as important as choosing the colors, layouts and interactions.",
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
      src: "/projects/windows-support-toolkit/demonstration.mp4",
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
      "A secure, production-deployed job application tracker with structured job capture, workflow management, retention automation and private user dashboards.",
    media: {
      kind: "video",
      src: "/projects/job-application-tracker/demonstration.mp4",
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
        href: "https://chit-thway-job-tracker-b9bpfvb5csccb5hb.australiaeast-01.azurewebsites.net",
      },
      {
        label: "Explore public demo",
        href: "https://chit-thway-job-tracker-b9bpfvb5csccb5hb.australiaeast-01.azurewebsites.net/demo",
      },
      {
        label: "Get Chrome extension",
        href: "https://chromewebstore.google.com/detail/job-application-tracker-c/ofeagkadonbdgjhdiobfdnmafhoknkig",
      },
    ],
    facts: [
      { label: "Status", value: "Deployed MVP — Private QA" },
      { label: "Role", value: "Solo Product Architect and Full-Stack Engineer" },
      { label: "Hosting", value: "Azure App Service" },
      { label: "Extension", value: "Available on Chrome Web Store" },
    ],
    overview: [
      "Job Application Tracker brings the entire job-search workflow into one focused workspace. Users can capture job advertisements, review structured information, track applications through a visual pipeline, record contacts and interactions, schedule tasks and appointments, and monitor recent activity through a three-month dashboard.",
      "Applications can be marked as Saved for permanent retention. Older unsaved records enter a configurable deletion schedule, giving users time to review or preserve them before automated cleanup. The platform also includes ghosting warnings, status history, bulk actions, light and dark themes, a public synthetic demo and a role-protected administration portal with audit history.",
      "The production MVP runs on Azure App Service with a separate Supabase PostgreSQL database, real email-verification and password-reset workflows, scheduled retention processing, health monitoring, tested backup and restoration procedures, and protected GitHub Actions deployment. Its approved Manifest V3 companion extension is publicly available from the Chrome Web Store.",
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
          "More than 200 automated tests cover the product while private user QA identifies real-world issues before a custom domain and broader release.",
      },
    ],
    note:
      "Live — QA in progress. The Azure address is the current production location while private user testing continues. The companion extension is available from the Chrome Web Store; a custom domain has not been connected.",
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
