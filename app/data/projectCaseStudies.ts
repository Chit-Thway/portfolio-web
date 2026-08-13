export type ProjectMedia =
  | { kind: "video"; src: string; label: string; duration: string }
  | { kind: "slides"; slides: string[]; downloadHref: string; label: string }
  | { kind: "pdf"; src: string; coverSrc: string; pages: string[]; label: string }
  | { kind: "pending"; label: string; message: string };

export type ProjectCaseStudy = {
  slug: string;
  eyebrow: string;
  introduction: string;
  media: ProjectMedia;
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

export const projectCaseStudies: ProjectCaseStudy[] = [
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
    eyebrow: "Full-stack product case study",
    introduction:
      "An in-development, private job-search organiser that brings applications, follow-ups, appointments, employer interactions and time-based decisions into one focused workflow.",
    media: {
      kind: "video",
      src: "/projects/job-application-tracker/demonstration.mp4",
      label: "Job Application Tracker demonstration",
      duration: "49 second demonstration",
    },
    facts: [
      { label: "Status", value: "In development" },
      { label: "Access", value: "Private until launch" },
      { label: "Stack", value: ".NET 10 / PostgreSQL" },
    ],
    overview: [
      "The tracker is designed as an operational home for each opportunity rather than a simple spreadsheet replacement. Applications keep an append-only status history alongside contacts, interactions, tasks, appointments, posting context and a readable stored job description.",
      "The dashboard summarises three calendar months while an Action Centre surfaces overdue work, follow-up suggestions, upcoming appointments and explicit ghosting decisions. Manual entry, pasted text, safe public-URL import and a user-clicked browser extension all feed a review step before an application is saved.",
      "The final product is planned for a proper public domain where people can sign up and use it directly. At this stage the application remains private while product, security and deployment work continue.",
    ],
    decisions: [
      {
        title: "Owner-scoped private data",
        detail:
          "Authentication and owner-aware relationships keep one user’s applications, companies, contacts and review drafts separate from another user’s records.",
      },
      {
        title: "Review before save",
        detail:
          "Imported job information is treated as a draft. The user reviews and corrects extracted fields before the tracker creates an application or company.",
      },
      {
        title: "Decisions stay with the user",
        detail:
          "The tracker can suggest follow-up or ghosting checks, but it does not silently change an application outcome without confirmation.",
      },
    ],
    note:
      "The demonstration reflects the current development build. Public registration, production hosting and the final application domain are not available yet.",
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
