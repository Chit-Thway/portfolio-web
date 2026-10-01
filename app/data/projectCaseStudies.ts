// Compatibility entry point for project-page components. Project-owned content
// now lives beside its general portfolio data in app/data/projects.
export type {
  ProjectCaseStudy,
  ProjectJourneyData,
  ProjectMedia,
  ProjectStack,
  ProjectStackIcon,
} from "./projects/types";

export { getProjectCaseStudy, projectCaseStudies } from "./projects";
