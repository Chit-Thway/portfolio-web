import type { ProjectDefinition } from "./types";

const jiraSlides = Array.from(
  { length: 12 },
  (_, index) => `/projects/jira-service-management/slides/slide-${index + 1}.png`,
);

export const jiraServiceManagementDefinition = {
  project: {
    id: "jira-service-management",
    number: "02",
    title: "Jira Service Management Simulation",
    category: "IT service management",
    status: "Completed · Public repository",
    summary:
      "A practical service-desk environment designed around the way employees request access, hardware, software and onboarding support.",
    contribution:
      "Designed the customer portal, request types, custom fields and approval paths, then explored SLA thinking and automation for consistent handling of common requests.",
    employerSignal:
      "Shows an understanding of support queues, user-friendly intake, approvals, repeatable processes and the operational thinking behind effective service delivery.",
    technologies: ["Jira Service Management", "Workflows", "SLAs", "Automation"],
    highlights: [
      "New-employee onboarding request",
      "Access, hardware and software pathways",
      "Approval-aware workflows",
    ],
    links: [
      {
        label: "View repository",
        href: "https://github.com/Chit-Thway/kestrel-ridge-jira-service-desk",
      },
    ],
    home: {
      section: "projects",
      order: 4,
      label: "Service-management simulation · Public",
      description:
        "A fictional service desk that demonstrates structured intake, approvals, SLA monitoring and support communication.",
      contribution:
        "Designed the request pathways, workflow states, approval logic and evidence-led support journey.",
      outcome: "12-slide workflow case study",
      size: "wide",
      media: {
        kind: "image",
        src: "/projects/jira-service-management/slides/slide-1.png",
        alt: "Opening slide of the Jira Service Management simulation case study",
      },
      tools: ["jira", "workflows", "slas"],
    },
  },
  caseStudy: {
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
} satisfies ProjectDefinition;
