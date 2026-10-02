import type { ProjectDefinition } from "./types";


export const jobApplicationTrackerDefinition = {
  project: {
    id: "job-application-tracker",
    number: "04",
    title: "Job Application Tracker",
    category: "Production full-stack application",
    status: "Live · Free account available",
    summary:
      "A public, production-deployed job-search platform where anyone can create a free account, save up to 10 applications, track progress and plan follow-ups. Built with ASP.NET Core, PostgreSQL, Azure and a companion Chrome extension.",
    contribution:
      "As Solo Product Architect and Full-Stack Engineer, architected and delivered the application across secure identity, private user data, deterministic job capture, workflow management, retention automation, administration and production deployment.",
    employerSignal:
      "Demonstrates end-to-end product ownership, security-aware full-stack engineering, operational deployment and the ability to turn a complex personal workflow into a tested production service.",
    technologies: [
      "C# / .NET 10",
      "ASP.NET Core MVC",
      "PostgreSQL",
      "Azure",
      "GitHub Actions",
      "Chrome Manifest V3",
    ],
    highlights: [
      "Private user-owned data and secure identity",
      "Deterministic multi-source job capture",
      "200+ automated tests and production monitoring",
    ],
    links: [],
    home: {
      section: "projects",
      order: 1,
      label: "Flagship product · Live",
      description:
        "A public workspace where anyone can create a free account, save up to 10 applications and keep every follow-up and next action together.",
      contribution:
        "Designed, built, tested and deployed end to end, including its approved Chrome extension.",
      outcome: "Live product · Free account available",
      size: "large",
      media: {
        kind: "image",
        src: "/projects/job-application-tracker/thumbnail.png",
        alt: "Job Application Tracker applications page with the approved browser extension open",
      },
      tools: ["csharp", "dotnet", "postgresql", "azure", "chrome"],
    },
  },
  caseStudy: {
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
            "I created an administrator area for managing users, account tiers, verification, access locks and deletion, inspired by an admin page I worked on with my supervisor Chris Carey for Accessory Archive.",
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
} satisfies ProjectDefinition;
