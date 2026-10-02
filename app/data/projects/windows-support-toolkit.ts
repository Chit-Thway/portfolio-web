import type { ProjectDefinition } from "./types";


export const windowsSupportToolkitDefinition = {
  project: {
    id: "windows-support-toolkit",
    number: "01",
    title: "Windows Support Diagnostic Toolkit",
    category: "Support engineering",
    status: "Active · Public repository",
    summary:
      "A safe diagnostic workflow that gathers Windows system information, validates structured reports and presents system health in a clear Python dashboard.",
    contribution:
      "Built a read-only PowerShell collector, a JSON report contract and validation flow, test fixtures for healthy and failure states, and a dashboard designed to make investigation easier. The work also included correcting memory-value overflow and tightening privacy, safety and validation behaviour.",
    employerSignal:
      "Demonstrates methodical troubleshooting, defensive engineering, test design and the ability to present technical evidence clearly without creating additional risk for a user.",
    technologies: [
      "PowerShell",
      "Python",
      "JSON",
      "Schema validation",
      "Safety testing",
    ],
    highlights: [
      "Read-only collection by design",
      "Healthy, malformed, partial and problem fixtures",
      "Privacy and failure hardening",
    ],
    links: [
      {
        label: "View repository",
        href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit",
      },
    ],
    home: {
      section: "projects",
      order: 4,
      label: "Support engineering · Public",
      description:
        "A read-only diagnostic workflow that collects Windows evidence and turns it into clear, testable support findings.",
      contribution:
        "Built the collector, validation contract, failure-safe evaluation and browser dashboard.",
      outcome: "Safe diagnostic evidence verified",
      size: "standard",
      media: {
        kind: "video",
        src: "/projects/windows-support-toolkit/demonstration.mp4?v=fe683d4d",
        label: "Windows Support Diagnostic Toolkit interface preview",
      },
      tools: ["powershell", "python", "qa"],
    },
  },
  caseStudy: {
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
} satisfies ProjectDefinition;
