"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { FaBug, FaPause, FaPlay } from "react-icons/fa6";
import {
  SiDotnet,
  SiGithub,
  SiGithubactions,
  SiGooglechrome,
  SiJavascript,
  SiJira,
  SiJson,
  SiPostgresql,
  SiPython,
  SiSupabase,
  SiWordpress,
} from "react-icons/si";
import {
  TbBrandAzure,
  TbBrandCSharp,
  TbBrandCss3,
  TbBrandHtml5,
  TbBrandPowershell,
  TbBrandWindows,
} from "react-icons/tb";
import styles from "../version-two.module.css";

type Technology = {
  name: string;
  icon: IconType;
};

type TechnologyRow = {
  label: string;
  direction: "left" | "right";
  items: Technology[];
};

const technologyRows: TechnologyRow[] = [
  {
    label: "Application development",
    direction: "right",
    items: [
      { name: "C#", icon: TbBrandCSharp },
      { name: ".NET 10", icon: SiDotnet },
      { name: "ASP.NET Core", icon: SiDotnet },
      { name: "Python", icon: SiPython },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML", icon: TbBrandHtml5 },
      { name: "CSS", icon: TbBrandCss3 },
    ],
  },
  {
    label: "Support and quality",
    direction: "left",
    items: [
      { name: "PowerShell", icon: TbBrandPowershell },
      { name: "Windows diagnostics", icon: TbBrandWindows },
      { name: "QA testing", icon: FaBug },
      { name: "Jira Service Management", icon: SiJira },
      { name: "Git & GitHub", icon: SiGithub },
      { name: "JSON validation", icon: SiJson },
    ],
  },
  {
    label: "Platforms and delivery",
    direction: "right",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Supabase", icon: SiSupabase },
      { name: "Azure", icon: TbBrandAzure },
      { name: "GitHub Actions", icon: SiGithubactions },
      { name: "WordPress", icon: SiWordpress },
      { name: "Chrome extension", icon: SiGooglechrome },
    ],
  },
];

function TechnologyList({ items, duplicate = false }: { items: Technology[]; duplicate?: boolean }) {
  return (
    <ul aria-hidden={duplicate || undefined}>
      {items.map(({ name, icon: TechnologyIcon }) => (
        <li key={name}>
          <TechnologyIcon aria-hidden="true" />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Duplicated visual lists create a seamless loop; only the first list is exposed
 * to assistive technology. Motion can be paused explicitly or disabled by the
 * user's reduced-motion preference.
 */
export function TechnologyMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className={styles.technologyMarquee} data-paused={paused}>
      <div className={styles.marqueeToolbar}>
        <span>Selected tools connected to the work above</span>
        <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? <FaPlay aria-hidden="true" /> : <FaPause aria-hidden="true" />}
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>

      <div className={styles.marqueeRows}>
        {technologyRows.map((row) => (
          <div className={styles.technologyRow} key={row.label}>
            <p>{row.label}</p>
            <div className={styles.technologyViewport} aria-label={row.label}>
              <div className={styles.technologyTrack} data-direction={row.direction}>
                <TechnologyList items={row.items} />
                <TechnologyList items={row.items} duplicate />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
