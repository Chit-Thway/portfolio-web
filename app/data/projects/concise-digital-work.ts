import type { ProjectDefinition } from "./types";

const qaReportPages = Array.from(
  { length: 6 },
  (_, index) => `/projects/concise-digital-work/report-page-${index + 1}.png`,
);

export const conciseDigitalWorkDefinition = {
  project: {
    id: "concise-digital-work",
    number: "05",
    title: "Selected Internship Web & QA Work",
    category: "Real client environments",
    status: "Internship work",
    summary:
      "Selected web-development and quality-assurance work completed as part of a team at Concise Digital across education, events, cleaning services and e-commerce clients.",
    contribution:
      "Contributed to Newington College pages, the Early Music Collective About page and event-card system, and MCO Cleaning WordPress content, carousel and booking-form functionality. Also tested Accessory Archive and documented issues for follow-up.",
    employerSignal:
      "Demonstrates care with client requirements, CMS work, quality checking, issue documentation and delivering changes within existing websites rather than greenfield code alone.",
    technologies: ["WordPress", "HTML", "CSS", "JavaScript", "Manual QA"],
    highlights: [
      "Client website implementation",
      "CMS and booking-form work",
      "Documented QA findings",
    ],
    links: [],
    home: {
      section: "qa",
      order: 0,
      label: "Commercial experience · Internship",
      cardTitle: "Web Development & QA Work",
      description:
        "Selected implementation, CMS and quality-assurance work completed across real client websites and existing systems.",
      contribution:
        "Delivered WordPress changes, reusable web components and reproducible bug reports within a team workflow.",
      outcome: "Client work implemented and tested",
      size: "standard",
      media: {
        kind: "image",
        src: "/projects/concise-digital-work/report-cover.png",
        alt: "Cover of the sanitised web quality-assurance report",
      },
      tools: ["wordpress", "git", "qa"],
    },
  },
  caseStudy: {
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
} satisfies ProjectDefinition;
