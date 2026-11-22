import type { ProjectDefinition } from "./types";

const assetPath = "/projects/have-you-tried-restarting";

export const haveYouTriedRestartingDefinition = {
  project: {
    id: "have-you-tried-restarting",
    number: "10",
    title: "Have You Tried Restarting?",
    category: "Browser game and IT help desk simulation",
    status: "Playable · In development",
    summary:
      "A first-person IT help desk simulation that runs in the browser. Companies reach out with realistic problems, and you solve them by replying to emails, taking over remote sessions or repairing physical PCs at the bench.",
    contribution:
      "Designed and built the whole game: the 3D office, the fake client desktops, the bench repair loop, the branching email jobs, the in-game clock and ticket system, sign-in and saves, and the audio, all written for the browser.",
    employerSignal:
      "Shows I can build and ship a large interactive product on my own, and that I understand real help desk work well enough to simulate it: realistic tickets, realistic clicks and fixes that are checked by whether the problem is actually solved.",
    technologies: [
      "React",
      "TypeScript",
      "Three.js",
      "Vite",
      "Supabase",
      "Web Audio",
      "Cloudflare Pages",
    ],
    highlights: [
      "Three job types: email replies, remote sessions and bench repairs",
      "Realistic help desk tickets built around common IT issues",
      "Fixes are judged by the real state of the PC, not by which option was picked",
    ],
    links: [{ label: "Play the game", href: "https://quokkait.pages.dev" }],
    home: {
      section: "projects",
      order: 0,
      label: "Playable game · Help desk simulation",
      description:
        "A first-person IT help desk you can actually play. Clients send you real-world problems and you fix them by email, remote session or at the repair bench.",
      contribution:
        "Built end to end as a showcase of my stack and a realistic simulation of a help desk job, with tickets and clicks modelled on the most common IT issues.",
      outcome: "Playable now · In development",
      size: "large",
      media: {
        kind: "image",
        src: `${assetPath}/thumbnail.webp`,
        alt: "Title screen of Have You Tried Restarting? showing a low-poly help desk office with parts shelves",
      },
      tools: ["react", "typescript", "threejs", "supabase", "cloudflare"],
    },
  },
  caseStudy: {
    eyebrow: "Browser game · IT help desk simulation",
    introduction:
      "Have You Tried Restarting? is a first-person simulation of working on an IT help desk. You start your shift in a small Perth support office, and companies reach out with the kinds of problems a real help desk sees every day. It is a display of the stack I build with, and it is also a real simulation of the job.",
    media: {
      kind: "video",
      src: `${assetPath}/demonstration.mp4?v=1`,
      poster: `${assetPath}/thumbnail.webp`,
      label: "Have You Tried Restarting? trailer",
      duration: "41 second trailer",
    },
    stack: {
      subtitle: "Browser-based 3D help desk simulation",
      mark: "react",
      groups: [
        {
          label: "Front end",
          items: [
            { name: "React", icon: "react" },
            { name: "TypeScript", icon: "typescript" },
            { name: "Vite", icon: "vite" },
          ],
        },
        {
          label: "3D world",
          items: [
            { name: "Three.js", icon: "threejs" },
            { name: "React Three Fiber", icon: "react" },
          ],
        },
        {
          label: "Accounts and saves",
          items: [
            { name: "Supabase", icon: "supabase" },
            { name: "Guest play", icon: "shield" },
          ],
        },
        {
          label: "Delivery",
          items: [
            { name: "Cloudflare Pages", icon: "cloudflare" },
            { name: "GitHub", icon: "github" },
          ],
        },
      ],
      description:
        "A React and Three.js game with low-poly art made from simple shapes, and music and sound generated live with Web Audio, so there are no large asset downloads. Accounts and saves run on Supabase, and the site is deployed on Cloudflare Pages.",
    },
    actions: [{ label: "Play the game", href: "https://quokkait.pages.dev" }],
    facts: [
      { label: "Status", value: "Playable · In development" },
      { label: "Format", value: "First-person browser game" },
      { label: "Role", value: "Solo designer and developer" },
      { label: "Jobs", value: "Email, remote session and bench repair" },
      { label: "Accounts", value: "Username, Google or guest" },
      { label: "Repository", value: "Private" },
    ],
    overview: [
      "You play a help desk technician working a nine-to-five day. Tickets arrive through the day with due times, the clock moves as you act, and you clock out at the door. Good work earns coins.",
      "Every job is one of three methods. You can reply to a client's email with branching choices. You can start a remote session and take over their desktop to fix the problem with real clicks in Settings, sign-in screens, print queues and disk space tools. Or you can carry a delivered PC to the workbench, find the fault, swap a part or rewire a cable, boot-test it and ship it back.",
      "I wanted it to be more than a portfolio piece, so the quests are written to be realistic. They cover the most common issues a help desk handles, such as a stuck print queue, a full disk, a signed-out account, a VPN that will not connect, no internet, a blocked camera or microphone, a slow PC, dead RAM, a clogged fan and a loose cable.",
    ],
    decisions: [
      {
        title: "A real help desk, not a quiz",
        detail:
          "Remote jobs run on a fake desktop that behaves like a real operating system. The game checks whether the problem is actually fixed, not which answer you picked, so the clicks you make are the clicks you would make on the job.",
      },
      {
        title: "Three ways to solve a ticket",
        detail:
          "Email replies, remote sessions and bench repairs mirror how support work really arrives, and each one tests a different skill: communication, troubleshooting and hands-on hardware.",
      },
      {
        title: "Built for the browser",
        detail:
          "Low-poly shapes, flat colours and audio generated live keep the first load small, so the game opens quickly without installing anything.",
      },
      {
        title: "Accounts without friction",
        detail:
          "Players can sign up with a username and password, use Google or play as a guest, and progress saves at the start of each day.",
      },
    ],
    note:
      "The game is still in development and the repository is private. The live build can be played at quokkait.pages.dev.",
  },
} satisfies ProjectDefinition;
