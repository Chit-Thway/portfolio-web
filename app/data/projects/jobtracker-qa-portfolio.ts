import type { ProjectDefinition } from "./types";

const qaPortfolioSlides = Array.from(
  { length: 5 },
  (_, index) => `/projects/jobtracker-qa-portfolio/slide-${index + 1}.png`,
);

export const jobTrackerQaPortfolioDefinition = {
  project: {
    id: "jobtracker-qa-portfolio",
    number: "06",
    title: "JobTracker - QA Portfolio",
    category: "Public quality-assurance case study",
    status: "Living public QA record",
    summary:
      "A public, sanitised QA record for Job Application Tracker, showing how production defects are reproduced, assessed, resolved and verified without exposing private user data or source code.",
    contribution:
      "Manually tested the production product, isolated repeatable defects, assessed severity and priority, documented expected-versus-actual behaviour, and recorded resolution and regression evidence in a public repository.",
    employerSignal:
      "Demonstrates practical production QA, clear defect communication, risk-based prioritisation and the discipline to preserve traceable evidence from discovery through regression verification.",
    technologies: [
      "Manual QA",
      "Exploratory testing",
      "Regression testing",
      "Bug reporting",
      "GitHub Issues",
    ],
    highlights: [
      "Reproducible production defect reports",
      "Severity, priority and user-impact assessment",
      "Fix verification and regression evidence",
    ],
    links: [
      {
        label: "GitHub QA repository",
        href: "https://github.com/Chit-Thway/job-application-tracker-qa",
      },
    ],
    home: {
      section: "qa",
      order: 1,
      label: "Public QA portfolio · Living record",
      cardTitle: "JobTracker - QA Portfolio",
      description:
        "Selected production defects showing reproducible evidence, user impact, resolution notes and regression coverage.",
      contribution:
        "Tested the live product and documented each issue from discovery through verified fix in a public QA repository.",
      outcome: "Three representative defects · Full record on GitHub",
      size: "wide",
      media: {
        kind: "image",
        src: "/projects/jobtracker-qa-portfolio/slide-1.png",
        alt: "JobTracker QA Portfolio introduction slide showing the observe, reproduce and verify workflow",
      },
      tools: ["qa", "git"],
    },
  },
  caseStudy: {
    eyebrow: "Production QA portfolio",
    introduction:
      "A concise five-slide introduction to a living public QA record, using three representative Job Application Tracker defects to show observation, reproduction, impact assessment, resolution and regression verification.",
    media: {
      kind: "slides",
      slides: qaPortfolioSlides,
      downloadHref: "/projects/jobtracker-qa-portfolio/JobTracker-QA-Portfolio.pptx",
      label: "JobTracker QA Portfolio",
    },
    actions: [
      {
        label: "Browse all bug reports",
        href: "https://github.com/Chit-Thway/job-application-tracker-qa/tree/main/reported-bugs",
      },
      {
        label: "Read the QA strategy",
        href: "https://github.com/Chit-Thway/job-application-tracker-qa/blob/main/docs/QA-STRATEGY.md",
      },
      {
        label: "Explore public demo",
        href: "https://myjobtracker.com.au/demo",
      },
    ],
    facts: [
      { label: "Format", value: "Five-slide portfolio introduction" },
      { label: "Selected evidence", value: "Bugs 02, 04 and 08" },
      { label: "Status", value: "Fixed and regression tested" },
      { label: "Source of truth", value: "Public GitHub QA repository" },
    ],
    overview: [
      "The slide deck introduces three defects selected from the public Job Application Tracker QA repository: incorrect salary extraction, an IPv6 timeout that prevented IPv4 fallback, and mobile navigation that obstructed the interface. Together they show data-quality, networking and responsive-design testing rather than repeating three versions of the same issue.",
      "Each example records what happened, the expected and actual behaviour, why the issue mattered, and the evidence used to verify the fix. The repository remains the complete and continually updated record, with detailed reproduction steps, severity and priority assessments, resolution notes, regression coverage and public issue traceability.",
    ],
    decisions: [
      {
        title: "Show representative defects",
        detail:
          "The portfolio page highlights three different failure types while the repository keeps the complete report set, avoiding a slide deck that must be rebuilt whenever another defect is documented.",
      },
      {
        title: "Separate observation from explanation",
        detail:
          "Reports distinguish confirmed behaviour from investigation notes and explain expected versus actual results so developers can reproduce the problem without treating a suspected cause as fact.",
      },
      {
        title: "Prioritise by user impact",
        detail:
          "Severity and priority reflect the affected workflow, available fallback and risk of misleading or blocked user actions rather than relying on a defect label alone.",
      },
      {
        title: "Keep regression evidence traceable",
        detail:
          "Each fixed report records the relevant manual retest and automated release evidence, making the path from discovery to verified resolution visible to future reviewers.",
      },
    ],
    note:
      "The slides are a curated introduction. The linked GitHub repository is the living source of truth for the full set of sanitised bug reports and future QA evidence.",
  },
} satisfies ProjectDefinition;
