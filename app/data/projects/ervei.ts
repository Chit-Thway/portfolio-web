import type { ProjectDefinition } from "./types";

const assetPath = "/projects/ervei";
const demonstration = `${assetPath}/demonstration.mp4`;
const demonstrationPoster = `${assetPath}/demonstration-poster.jpg`;
const pitchSlides = Array.from(
  { length: 10 },
  (_, index) => `${assetPath}/pitch/slide-${index + 1}.png`,
);

export const erveiDefinition = {
  project: {
    id: "ervei",
    number: "09",
    title: "ERVEI: GreenSpark 40k Hackathon WINNER",
    category: "Hackathon achievement",
    status: "Challenge 3 winner",
    summary:
      "Challenge 3 winner at the two-week GreenSpark Innovation Hackathon in Perth, which had a $40,000+ event prize pool. We worked with energy-sector professionals to find gaps in hardship support and built ERVEI to help staff intervene earlier.",
    contribution:
      "I sought out prospective customers in person, joined discovery calls with senior energy-sector staff and brought their feedback back to the team. I designed and built much of the staff interface, including customer grouping and weather maps, while teammates worked on the prediction model and other parts of the prototype.",
    employerSignal:
      "The hackathon gave me hands-on experience with informal product consulting. I helped identify the operational gap, understand what mattered to prospective customers and work with my teammates to deliver a prototype we could put in front of judges within two weeks.",
    technologies: ["React", "TypeScript", "Vite", "Leaflet", "Node.js", "Express", "SQLite", "Docker"],
    highlights: [
      "Interactive map of forecast heat and customer support needs",
      "Customer groups for targeted outreach and staff follow-up",
      "In-person prospecting and discovery with senior energy-sector staff",
      "Workflow gap analysis and early commercial validation with prospective customers",
    ],
    links: [
      { label: "View repository", href: "https://github.com/Chit-Thway/greenspark-ervei" },
    ],
    home: {
      section: "achievements",
      order: 1,
      label: "GreenSpark 2026 · Challenge 3 winner",
      description:
        "Our four-person team won Challenge 3 at a two-week hackathon with a $40,000+ event prize pool. We built ERVEI around a gap we found in how energy providers identify households that need help before extreme weather.",
      contribution: "I went to energy-company offices to find prospective customers, joined discovery calls with senior staff and helped turn their feedback into the prototype.",
      outcome: "Winning prototype",
      size: "standard",
      media: {
        kind: "image",
        src: demonstrationPoster,
        alt: "ERVEI dashboard mapping forecast heat and customer support needs around Perth",
      },
      tools: ["react", "typescript", "git"],
    },
  },
  caseStudy: {
    eyebrow: "GreenSpark 2026 · Challenge 3 winner",
    introduction:
      "Our four-person team won Challenge 3 at the GreenSpark Innovation Hackathon, a two-week event in Perth with a $40,000+ prize pool. Through conversations with senior energy-sector staff and prospective customers, we found a gap in hardship support and built ERVEI to help providers act before extreme weather hits.",
    media: {
      kind: "video",
      src: demonstration,
      poster: demonstrationPoster,
      label: "ERVEI prototype demonstration",
      duration: "30 second demonstration",
    },
    companion: {
      placement: "after-media",
      eyebrow: "Final presentation",
      title: "The ERVEI pitch",
      introduction: "The deck covers the problem, the prototype and what we learned from industry conversations. The live presentation to the judges also included demo videos.",
      media: {
        kind: "slides",
        slides: pitchSlides,
        downloadHref: `${assetPath}/ervei-pitch.pdf`,
        label: "ERVEI hackathon pitch",
      },
    },
    actions: [
      { label: "View live demo", href: "https://greenspark-ervei-chit-thway.fly.dev/" },
    ],
    journey: "placeholder",
    facts: [
      { label: "Award", value: "Challenge 3 winner" },
      { label: "Event prize pool", value: "$40,000+" },
      { label: "Duration", value: "Two weeks" },
      { label: "Event", value: "GreenSpark Innovation Hackathon · Perth · October 2026" },
    ],
    stack: {
      subtitle: "Customer support and weather risk in one workspace",
      mark: "react",
      groups: [
        { label: "Interface", items: [{ name: "React", icon: "react" }, { name: "TypeScript", icon: "typescript" }] },
        { label: "Mapping", items: [{ name: "Leaflet", icon: "javascript" }] },
        { label: "Backend", items: [{ name: "Node.js", icon: "javascript" }, { name: "SQLite", icon: "database" }] },
      ],
      description:
        "The prototype combines simulated customer records with weather forecasts and warnings. Staff can inspect flagged cases, group households with similar needs and track outreach from the same workspace.",
    },
    overview: [
      "A week into the hackathon, we had a working prototype and needed feedback from people who might use it. I visited energy-company offices in Perth, introduced our project to staff and asked who we should talk to about customer hardship. Those conversations opened new routes to industry contacts.",
      "In discovery calls with energy-sector professionals, including a senior operations analyst at Horizon Power, we asked how staff identify customers in hardship and what they do during extreme weather. We learned that the hardship prediction workflow they described relied on payment history. That pointed to an opportunity to use weather forecasts to decide when to contact at-risk households.",
      "Our team used those findings to shift from a case list to a weather-led dashboard. Using simulated customer records, the prototype shows how staff could identify affected households, prioritise check-ins and organise follow-up before a heat event.",
    ],
    decisions: [
      {
        title: "Test whether the tool fits the business",
        detail: "We asked prospective customers how ERVEI could fit into their operations and whether they would consider paying for a tool with those capabilities. The interest they expressed gave us an early signal to explore further.",
      },
      {
        title: "Lead with the weather outlook",
        detail: "Put forecast temperatures and customer groups on the same map so staff can see where a heat event may increase support needs.",
      },
      {
        title: "Group customers by the support they need",
        detail: "Group cases by needs such as medical dependency or low prepaid credit so staff can plan outreach for households facing similar issues.",
      },
    ],
  },
} satisfies ProjectDefinition;
