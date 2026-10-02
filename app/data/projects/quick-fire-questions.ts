import type { ProjectDefinition } from "./types";


export const quickFireQuestionsDefinition = {
  project: {
    id: "quick-fire-questions",
    number: "03",
    title: "Quick-Fire Questions",
    category: "Collaborative software project",
    status: "Collaborative · Private repository",
    summary:
      "A multiplayer Roblox experience built around rapid question rounds, time pressure and unique-answer validation.",
    contribution:
      "Contributed to timer-based rounds, client/server behaviour, interface work and validation logic within a branch-based team workflow. The project was tested with two clients to check multiplayer behaviour.",
    employerSignal:
      "Demonstrates collaborative development, shared source control, test-minded multiplayer work and the care needed when behaviour crosses client and server boundaries.",
    technologies: ["Roblox Studio", "Lua", "Rojo", "GitHub"],
    highlights: [
      "Unique-answer validation",
      "Two-client behaviour testing",
      "Branch-based collaboration",
    ],
    links: [],
  },
  caseStudy: {
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
} satisfies ProjectDefinition;
