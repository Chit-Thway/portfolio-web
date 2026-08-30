import type { IconType } from "react-icons";
import {
  FaClockRotateLeft,
  FaCodeBranch,
  FaDatabase,
  FaEnvelope,
  FaHeartPulse,
  FaShieldHalved,
  FaVial,
} from "react-icons/fa6";
import {
  SiCloudflare,
  SiDotnet,
  SiGithub,
  SiGithubactions,
  SiGooglechrome,
  SiJavascript,
  SiJson,
  SiLua,
  SiPostgresql,
  SiPytest,
  SiPython,
  SiRobloxstudio,
  SiSupabase,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import {
  TbBrandAzure,
  TbBrandCSharp,
  TbBrandCss3,
  TbBrandHtml5,
  TbBrandPowershell,
  TbBrandWindows,
} from "react-icons/tb";
import type { ProjectStack as ProjectStackData, ProjectStackIcon } from "@/app/data/projectCaseStudies";

const stackIcons: Record<ProjectStackIcon, IconType> = {
  react: SiReact,
  typescript: SiTypescript,
  cloudflare: SiCloudflare,
  powershell: TbBrandPowershell,
  windows: TbBrandWindows,
  python: SiPython,
  json: SiJson,
  pytest: SiPytest,
  roblox: SiRobloxstudio,
  lua: SiLua,
  github: SiGithub,
  branch: FaCodeBranch,
  csharp: TbBrandCSharp,
  dotnet: SiDotnet,
  database: FaDatabase,
  shield: FaShieldHalved,
  postgresql: SiPostgresql,
  supabase: SiSupabase,
  azure: TbBrandAzure,
  email: FaEnvelope,
  "github-actions": SiGithubactions,
  chrome: SiGooglechrome,
  html: TbBrandHtml5,
  css: TbBrandCss3,
  javascript: SiJavascript,
  testing: FaVial,
  health: FaHeartPulse,
  backup: FaClockRotateLeft,
};

const stackIconColors: Record<ProjectStackIcon, string> = {
  react: "#61dafb",
  typescript: "#3178c6",
  cloudflare: "#f38020",
  powershell: "#5391fe",
  windows: "#00a4ef",
  python: "#ffd343",
  json: "#292927",
  pytest: "#42b6d5",
  roblox: "#111111",
  lua: "#7c83ff",
  github: "#181717",
  branch: "#5eead4",
  csharp: "#a679dc",
  dotnet: "#8b78ff",
  database: "#76a7ff",
  shield: "#5eead4",
  postgresql: "#6e9bd3",
  supabase: "#3ecf8e",
  azure: "#39a9ff",
  email: "#5eead4",
  "github-actions": "#4c9aff",
  chrome: "#fbbc04",
  html: "#e86b42",
  css: "#4b9ee8",
  javascript: "#f4df4e",
  testing: "#5eead4",
  health: "#ff7b8f",
  backup: "#b4c4c9",
};

export function ProjectStack({ projectTitle, stack }: { projectTitle: string; stack: ProjectStackData }) {
  const MarkIcon = stackIcons[stack.mark];

  return (
    <section className="project-stack" aria-labelledby="project-stack-title">
      <div className="project-stack-heading">
        <div className="project-stack-mark" aria-hidden="true">
          <MarkIcon />
        </div>
        <div>
          <p className="case-section-label">Technology architecture</p>
          <h2 id="project-stack-title">{projectTitle}</h2>
          <p>{stack.subtitle}</p>
        </div>
      </div>

      <div className="project-stack-board">
        {stack.groups.map((group) => (
          <div className="project-stack-row" key={group.label}>
            <h3>{group.label}</h3>
            <ul>
              {group.items.map((item) => {
                const TechnologyIcon = stackIcons[item.icon];
                return (
                  <li key={`${group.label}-${item.name}`}>
                    <TechnologyIcon
                      aria-hidden="true"
                      style={{ color: stackIconColors[item.icon] }}
                    />
                    <span>{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="project-stack-description">{stack.description}</p>
    </section>
  );
}
