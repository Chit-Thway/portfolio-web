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
  color: string;
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
      { name: "C#", icon: TbBrandCSharp, color: "#512bd4" },
      { name: ".NET 10", icon: SiDotnet, color: "#512bd4" },
      { name: "ASP.NET Core", icon: SiDotnet, color: "#512bd4" },
      { name: "Python", icon: SiPython, color: "#3776ab" },
      { name: "JavaScript", icon: SiJavascript, color: "#b59b00" },
      { name: "HTML", icon: TbBrandHtml5, color: "#e34f26" },
      { name: "CSS", icon: TbBrandCss3, color: "#1572b6" },
    ],
  },
  {
    label: "Support and quality",
    direction: "left",
    items: [
      { name: "PowerShell", icon: TbBrandPowershell, color: "#2671be" },
      { name: "Windows diagnostics", icon: TbBrandWindows, color: "#0078d4" },
      { name: "QA testing", icon: FaBug, color: "#d7263d" },
      { name: "Jira Service Management", icon: SiJira, color: "#0052cc" },
      { name: "Git & GitHub", icon: SiGithub, color: "#181717" },
      { name: "JSON validation", icon: SiJson, color: "#292929" },
    ],
  },
  {
    label: "Platforms and delivery",
    direction: "right",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169e1" },
      { name: "Supabase", icon: SiSupabase, color: "#2cae78" },
      { name: "Azure", icon: TbBrandAzure, color: "#0078d4" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088ff" },
      { name: "WordPress", icon: SiWordpress, color: "#21759b" },
      { name: "Chrome extension", icon: SiGooglechrome, color: "#4285f4" },
    ],
  },
];

function TechnologyList({ items, duplicate = false }: { items: Technology[]; duplicate?: boolean }) {
  return (
    <ul aria-hidden={duplicate || undefined}>
      {items.map(({ name, icon: TechnologyIcon, color }) => (
        <li key={name}>
          <TechnologyIcon aria-hidden="true" style={{ color }} />
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
