export type PortfolioLink = {
  label: string;
  href: string;
};

export type HomeProjectTool =
  | "react"
  | "typescript"
  | "cloudflare"
  | "csharp"
  | "dotnet"
  | "postgresql"
  | "azure"
  | "chrome"
  | "powershell"
  | "python"
  | "qa"
  | "windows"
  | "wordpress"
  | "git"
  | "jira"
  | "workflows"
  | "slas";

export type HomeProjectPresentation = {
  order: number;
  label: string;
  cardTitle?: string;
  description: string;
  contribution: string;
  outcome: string;
  size: "large" | "standard" | "wide";
  media:
    | { kind: "video"; src: string; label: string }
    | { kind: "image"; src: string; alt: string };
  tools: HomeProjectTool[];
};

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  contribution: string;
  employerSignal: string;
  technologies: string[];
  highlights: string[];
  links: PortfolioLink[];
  home?: HomeProjectPresentation;
};

export type ProjectMedia =
  | { kind: "video"; src: string; label: string; duration: string }
  | { kind: "slides"; slides: string[]; downloadHref: string; label: string }
  | { kind: "pdf"; src: string; coverSrc: string; pages: string[]; label: string }
  | { kind: "pending"; label: string; message: string };

export type ProjectStackIcon =
  | "react"
  | "typescript"
  | "cloudflare"
  | "powershell"
  | "windows"
  | "python"
  | "json"
  | "pytest"
  | "roblox"
  | "lua"
  | "github"
  | "branch"
  | "csharp"
  | "dotnet"
  | "database"
  | "shield"
  | "postgresql"
  | "supabase"
  | "azure"
  | "email"
  | "github-actions"
  | "chrome"
  | "html"
  | "css"
  | "javascript"
  | "testing"
  | "health"
  | "backup";

export type ProjectStack = {
  subtitle: string;
  mark: ProjectStackIcon;
  groups: Array<{
    label: string;
    items: Array<{ name: string; icon: ProjectStackIcon }>;
  }>;
  description: string;
};

export type ProjectJourneyData = {
  title: string;
  showLinks?: boolean;
  items: Array<{
    kind: "Goal" | "Problem" | "Solution" | "Result" | "Lesson";
    label?: "Initial Problem" | "First idea";
    title: string;
    detail: string;
    badge?: "Unexpected idea" | "Inspired idea";
    link?: {
      label: string;
      href: string;
    };
  }>;
};

export type ProjectCaseStudy = {
  slug: string;
  displayTitle?: string;
  eyebrow: string;
  introduction: string;
  media: ProjectMedia;
  stack?: ProjectStack;
  companion?: {
    eyebrow: string;
    title: string;
    introduction: string;
    media: Extract<ProjectMedia, { kind: "slides" }>;
  };
  actions?: Array<{
    label: string;
    href?: string;
  }>;
  journey?: ProjectJourneyData;
  facts: Array<{ label: string; value: string }>;
  overview: string[];
  setup?: {
    introduction: string;
    requirements: string[];
    steps: Array<{ title: string; detail: string; command?: string }>;
  };
  decisions: Array<{ title: string; detail: string }>;
  note?: string;
};

export type ProjectDefinition = {
  project: Project;
  caseStudy: Omit<ProjectCaseStudy, "slug">;
};
