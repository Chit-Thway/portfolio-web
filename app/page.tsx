import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FaBug,
  FaClock,
  FaCircleCheck,
  FaDiagramProject,
  FaEnvelope,
  FaGithub,
  FaFileArrowDown,
  FaLinkedinIn,
} from "react-icons/fa6";
import {
  SiCloudflare,
  SiDotnet,
  SiGit,
  SiGooglechrome,
  SiPostgresql,
  SiPython,
  SiJira,
  SiWordpress,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { TbBrandAzure, TbBrandCSharp, TbBrandPowershell } from "react-icons/tb";
import { AboutDirectory } from "./components/AboutDirectory";
import { GitHubActivity } from "./components/GitHubActivity";
import { TechnologyMarquee } from "./components/TechnologyMarquee";
import { ThemeToggle } from "./components/ThemeToggle";
import { OutsideIdeStack } from "./components/OutsideIdeStack";
import {
  portfolio,
  type HomeProjectPresentation,
  type HomeProjectTool,
  type Project,
} from "./data/portfolio";
import styles from "./version-two.module.css";

type FeaturedProject = Project & {
  home: HomeProjectPresentation;
};

const homeToolDetails: Record<
  HomeProjectTool,
  { name: string; icon: IconType }
> = {
  react: { name: "React", icon: SiReact },
  typescript: { name: "TypeScript", icon: SiTypescript },
  cloudflare: { name: "Cloudflare", icon: SiCloudflare },
  csharp: { name: "C#", icon: TbBrandCSharp },
  dotnet: { name: ".NET 10", icon: SiDotnet },
  postgresql: { name: "PostgreSQL", icon: SiPostgresql },
  azure: { name: "Azure", icon: TbBrandAzure },
  chrome: { name: "Chrome", icon: SiGooglechrome },
  powershell: { name: "PowerShell", icon: TbBrandPowershell },
  python: { name: "Python", icon: SiPython },
  qa: { name: "QA", icon: FaBug },
  windows: { name: "Windows", icon: TbBrandPowershell },
  wordpress: { name: "WordPress", icon: SiWordpress },
  git: { name: "Git", icon: SiGit },
  jira: { name: "Jira", icon: SiJira },
  workflows: { name: "Workflows", icon: FaDiagramProject },
  slas: { name: "SLAs", icon: FaClock },
};

const featuredProjects = portfolio.projects
  .filter((project): project is FeaturedProject => Boolean(project.home))
  .sort((first, second) => first.home.order - second.home.order);

function ProjectMedia({ project }: { project: FeaturedProject }) {
  if (project.home.media.kind === "video") {
    return (
      <video
        className={styles.projectVideo}
        src={project.home.media.src}
        aria-label={project.home.media.label}
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
    );
  }

  return (
    <Image
      className={styles.projectImage}
      src={project.home.media.src}
      alt={project.home.media.alt}
      fill
      unoptimized
      sizes="(max-width: 760px) 92vw, 46vw"
    />
  );
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  const cardTitle = project.home.cardTitle ?? project.title;
  const sizeClass =
    project.home.size === "large"
      ? styles.projectCardLarge
      : project.home.size === "wide"
        ? styles.projectCardWide
        : "";

  return (
    <a
      className={`${styles.projectCard} ${sizeClass}`}
      href={`/projects/${project.id}/`}
      aria-label={`View ${cardTitle} case study`}
    >
      <div className={`${styles.projectMedia} ${styles.projectMediaDivider}`}>
        <ProjectMedia project={project} />
        <span className={styles.projectOpen} aria-hidden="true">
          ↗
        </span>
      </div>
      <div className={styles.projectBody}>
        <p className={styles.projectLabel}>{project.home.label}</p>
        <h3>{cardTitle}</h3>
        <p className={styles.projectDescription}>{project.home.description}</p>
        <p className={styles.projectContribution}>{project.home.contribution}</p>
        <div className={styles.projectFooter}>
          <ul aria-label={`${cardTitle} primary technologies`}>
            {project.home.tools.map((tool) => {
              const { name, icon: ToolIcon } = homeToolDetails[tool];

              return (
                <li key={tool} title={name}>
                  <ToolIcon aria-hidden="true" />
                  <span>{name}</span>
                </li>
              );
            })}
          </ul>
          <span>{project.home.outcome}</span>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const { person, contact } = portfolio;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: "Application Support and Software Quality",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Perth",
      addressRegion: "Western Australia",
      addressCountry: "AU",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: portfolio.education.institution,
    },
    sameAs: [contact.linkedin, contact.github].filter(Boolean),
  };

  return (
    <div className={styles.v2Site}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a className={styles.wordmark} href="#home" aria-label="CHIT THWAY, home">
            CHIT THWAY
          </a>
          <nav className={styles.navigation} aria-label="Primary navigation">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="/diary/">Diary</a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero} id="home" aria-labelledby="hero-title">
          <div className={styles.heroIdentity}>
            {person.profileImage ? (
              <div className={styles.portrait}>
                <Image
                  src={person.profileImage}
                  alt={`Portrait of ${person.name}`}
                  fill
                  priority
                  unoptimized
                  sizes="112px"
                />
              </div>
            ) : null}
            <div>
              <p className={styles.heroName}>
                <span>{person.name}</span>
                <span
                  className={styles.verifiedMark}
                  aria-label="Verified portfolio identity and professional links"
                  title="Verified portfolio identity and professional links"
                >
                  <FaCircleCheck aria-hidden="true" />
                </span>
              </p>
              <div className={styles.socialLinks} aria-label="Professional profiles">
                {contact.github ? (
                  <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <FaGithub aria-hidden="true" />
                  </a>
                ) : null}
                {contact.linkedin ? (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn aria-hidden="true" />
                  </a>
                ) : null}
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} aria-label="Email">
                    <FaEnvelope aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <p className={styles.heroEyebrow}>Computer Science graduate · Perth, Western Australia</p>
          <h1 id="hero-title">
            Application support,
            <br />
            troubleshooting <span>& software quality.</span>
          </h1>
          <p className={styles.heroIntroduction}>
            I build and support web applications, investigate technical problems and turn what I
            find into clear, practical next steps.
          </p>

          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#projects">
              View featured work <span aria-hidden="true">↓</span>
            </a>
            {contact.resume ? (
              <a className={styles.secondaryAction} href={contact.resume} download>
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            ) : null}
            {contact.email ? (
              <a className={styles.secondaryAction} href={`mailto:${contact.email}`}>
                Contact me <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <a className={styles.secondaryAction} href="/diary/">
              View Memoir <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className={styles.availability}>
            <span aria-hidden="true" />
            {person.availability}
          </div>
        </section>

        <section className={styles.about} id="about" aria-labelledby="about-title">
          <div className={styles.aboutIntroduction}>
            <p>Profile directory</p>
            <h2 id="about-title">Three files. The useful context.</h2>
            <p>A concise view of how I work, where I studied and where I am based.</p>
          </div>
          <AboutDirectory />
        </section>

        <section className={styles.projects} id="projects" aria-labelledby="projects-title">
          <div className={styles.sectionIntroduction}>
            <div>
              <p>Selected work</p>
              <h2 id="projects-title">Evidence, not just claims.</h2>
            </div>
            <p>
              Six selected projects showing how I build, investigate, test and support software.
            </p>
          </div>

          <div className={styles.projectGrid}>
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className={styles.experience} id="experience" aria-labelledby="experience-title">
          <div className={styles.sectionIntroduction}>
            <div>
              <p>Experience</p>
              <h2 id="experience-title">Work shaped by real users.</h2>
            </div>
            <p>
              Customer-facing work and internships that strengthened how I communicate, test and
              deliver within existing systems.
            </p>
          </div>

          <ol className={styles.experienceList}>
            {portfolio.experience.map((item) => {
              const isCurrent = item.period?.includes("Present");

              return (
                <li className={styles.experienceItem} key={`${item.organisation}-${item.role}`}>
                  <time className={styles.experiencePeriod}>{item.period}</time>
                  <div className={styles.experienceRail} aria-hidden="true">
                    <span />
                  </div>
                  <article className={styles.experienceCard}>
                    <div className={styles.experienceHeading}>
                      <div>
                        <p>{item.organisation}</p>
                        <h3>{item.role}</h3>
                      </div>
                      {isCurrent ? <span className={styles.currentRole}>Current</span> : null}
                    </div>
                    <p className={styles.experienceSummary}>{item.summary}</p>
                    <ul className={styles.experienceStrengths} aria-label={`${item.role} strengths`}>
                      {item.strengths.map((strength) => (
                        <li key={strength}>{strength}</li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={styles.technologies} aria-labelledby="technologies-title">
          <div className={styles.sectionIntroduction}>
            <div>
              <p>Technologies</p>
              <h2 id="technologies-title">Tools I use in context.</h2>
            </div>
            <p>
              Grouped by the work they support—from building applications to investigating issues
              and shipping reliable changes.
            </p>
          </div>
          <TechnologyMarquee />
        </section>

        {person.profileImage ? (
          <section className={styles.outsideIde} aria-labelledby="outside-ide-title">
            <div className={styles.sectionIntroduction}>
              <div>
                <p>Outside the IDE</p>
                <h2 id="outside-ide-title">A life beyond the screen.</h2>
              </div>
              <p>
                The four things I return to when I step away from projects and recharge.
              </p>
            </div>
            <OutsideIdeStack />
          </section>
        ) : null}

        {contact.github ? (
          <section className={styles.githubSection} aria-labelledby="github-activity-title">
            <div className={styles.sectionIntroduction}>
              <div>
                <p>GitHub activity</p>
                <h2 id="github-activity-title">Recent works</h2>
              </div>
              <p>
                A live view of recent public development events—not a guess at private work or a
                lifetime contribution total.
              </p>
            </div>
            <GitHubActivity username="Chit-Thway" profileUrl={contact.github} />
          </section>
        ) : null}

        <section className={styles.contactSection} id="contact" aria-labelledby="contact-title">
          <div className={styles.contactIntroduction}>
            <div>
              <p>Contact</p>
              <h2 id="contact-title">Let’s solve something useful.</h2>
            </div>
            <p>
              I’m open to graduate and entry-level application support, technical support, QA and
              web support opportunities in Perth.
            </p>
          </div>

          <div className={styles.contactActions}>
            {contact.email ? (
              <a href={`mailto:${contact.email}`}>
                <span className={`${styles.contactActionIcon} ${styles.contactEmailIcon}`}>
                  <FaEnvelope aria-hidden="true" />
                </span>
                <span>
                  <small>Email</small>
                  <strong>{contact.email}</strong>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {contact.linkedin ? (
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                <span className={`${styles.contactActionIcon} ${styles.contactLinkedinIcon}`}>
                  <FaLinkedinIn aria-hidden="true" />
                </span>
                <span>
                  <small>LinkedIn</small>
                  <strong>Connect professionally</strong>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {contact.github ? (
              <a href={contact.github} target="_blank" rel="noreferrer">
                <span className={`${styles.contactActionIcon} ${styles.contactGithubIcon}`}>
                  <FaGithub aria-hidden="true" />
                </span>
                <span>
                  <small>GitHub</small>
                  <strong>Review public repositories</strong>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {contact.resume ? (
              <a href={contact.resume} download>
                <span className={`${styles.contactActionIcon} ${styles.contactResumeIcon}`}>
                  <FaFileArrowDown aria-hidden="true" />
                </span>
                <span>
                  <small>Résumé</small>
                  <strong>Download PDF</strong>
                </span>
                <span aria-hidden="true">↓</span>
              </a>
            ) : null}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>CHIT THWAY</span>
        <span>Perth, Western Australia</span>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
