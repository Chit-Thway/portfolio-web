import { portfolioV2Definition } from "./portfolio-v2";
import { windowsSupportToolkitDefinition } from "./windows-support-toolkit";
import { windowsStorageExtensionDefinition } from "./windows-storage-extension";
import { jiraServiceManagementDefinition } from "./jira-service-management";
import { quickFireQuestionsDefinition } from "./quick-fire-questions";
import { jobApplicationTrackerDefinition } from "./job-application-tracker";
import { conciseDigitalWorkDefinition } from "./concise-digital-work";
import type { Project, ProjectCaseStudy, ProjectDefinition } from "./types";

export const projectDefinitions = [
  portfolioV2Definition,
  windowsSupportToolkitDefinition,
  windowsStorageExtensionDefinition,
  jiraServiceManagementDefinition,
  quickFireQuestionsDefinition,
  jobApplicationTrackerDefinition,
  conciseDigitalWorkDefinition,
] satisfies readonly ProjectDefinition[];

export const projects: Project[] = projectDefinitions.map(({ project }) => project);

export const projectCaseStudies: ProjectCaseStudy[] = projectDefinitions.map(
  ({ project, caseStudy }) => ({ slug: project.id, ...caseStudy }),
);

export function getProjectCaseStudy(slug: string): ProjectCaseStudy | undefined {
  return projectCaseStudies.find((project) => project.slug === slug);
}
