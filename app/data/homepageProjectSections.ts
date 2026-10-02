import type { HomeProjectSection } from "./projects/types";

export const homepageProjectSections = [
  {
    id: "projects",
    eyebrow: "Selected work",
    title: "Evidence, not just claims.",
    description: "Five selected projects showing how I build, investigate and support software.",
  },
  {
    id: "qa",
    eyebrow: "QA work",
    title: "Quality Assurance\nPortfolios",
    description:
      "Sanitised evidence showing how I reproduce, investigate and document software issues while protecting private systems, user data and source code.",
  },
] satisfies readonly HomeProjectSection[];
