import type { ProjectDefinition } from "./types";

const portfolioSlides = Array.from(
  { length: 6 },
  (_, index) => `/projects/portfolio-v2/Portfolio-Case-Study/slide-${index + 1}.png`,
);

const portfolioDiarySlides = Array.from(
  { length: 6 },
  (_, index) => `/projects/portfolio-v2/diary-slides/slide-${index + 1}.png`,
);

export const portfolioV2Definition = {
  project: {
    id: "portfolio-v2",
    number: "00",
    title: "Portfolio",
    category: "Personal product and portfolio",
    status: "Live · You are already here",
    summary:
      "The website you are using right now: a portfolio rebuilt to get to the useful stuff quickly, then make the deeper work easy to check when someone wants the details.",
    contribution:
      "I designed it, wrote it, built it, tested it and shipped it on Cloudflare. I also gave myself permission to make the Diary much more ambitious than a portfolio technically needed to be.",
    employerSignal:
      "It shows how I turn a slightly vague brief into a real, production-backed product—then keep polishing the details without losing sight of the person using it.",
    technologies: [
      "React",
      "TypeScript",
      "Vinext",
      "CSS Modules",
      "Cloudflare Pages",
      "D1",
      "R2",
    ],
    highlights: [
      "Designed for quick scanning without flattening the work",
      "Deeper case studies and downloadable evidence",
      "Production Diary with private publishing and media storage",
    ],
    links: [
      {
        label: "View repository",
        href: "https://github.com/Chit-Thway/portfolio-web",
      },
    ],
    home: {
      section: "projects",
      order: 0,
      cardTitle: "Portfolio Web",
      label: "The site you are on · Live",
      description:
        "A portfolio I rebuilt because a list of skills was never going to tell the whole story. It gets to the useful bits quickly, then lets the work speak for itself.",
      contribution:
        "Designed, wrote, built, tested and shipped the whole thing—including the slightly over-engineered Diary I wanted anyway.",
      outcome: "Live, evolving and very much mine",
      size: "large",
      media: {
        kind: "image",
        src: "/projects/portfolio-v2/Portfolio-Case-Study/slide-1.png",
        alt: "Opening slide of the Portfolio website case study",
      },
      tools: ["react", "typescript", "cloudflare"],
    },
  },
  caseStudy: {
    displayTitle: "Portfolio Web",
    eyebrow: "A case study about this very website",
    introduction:
      "yes, you are looking at it... this is the project and the place where the project is being explained. I rebuilt the portfolio so the useful stuff is easy to find, the deeper proof is there when someone wants it, and the whole thing still feels like me.",
    media: {
      kind: "slides",
      slides: portfolioSlides,
      downloadHref: "/projects/portfolio-v2/Portfolio-Case-Study.pptx",
      label: "Portfolio website case study",
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
} satisfies ProjectDefinition;
