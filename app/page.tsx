import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FaBug,
  FaClock,
  FaDiagramProject,
  FaEnvelope,
  FaGithub,
  FaFileArrowDown,
  FaLinkedinIn,
} from "react-icons/fa6";
import {
  SiDotnet,
  SiGit,
  SiGooglechrome,
  SiPostgresql,
  SiPython,
  SiJira,
  SiWordpress,
} from "react-icons/si";
import { TbBrandAzure, TbBrandCSharp, TbBrandPowershell } from "react-icons/tb";
import { AboutDirectory } from "./components/AboutDirectory";
import { GitHubActivity } from "./components/GitHubActivity";
import { TechnologyMarquee } from "./components/TechnologyMarquee";
import { OutsideIdeStack } from "./components/OutsideIdeStack";
import { portfolio } from "./data/portfolio";
import styles from "./version-two.module.css";

type FeaturedProject = {
  slug: string;
  label: string;
  title: string;
  description: string;
  contribution: string;
  outcome: string;
  size: "large" | "standard" | "wide";
  media:
    | { kind: "video"; src: string; label: string }
    | { kind: "image"; src: string; alt: string };
  tools: Array<{ name: string; icon: IconType }>;
};

const featuredProjects: FeaturedProject[] = [
  {
    slug: "job-application-tracker",
    label: "Flagship product · Live",
    title: "Job Application Tracker",
    description:
      "A private workspace for capturing job ads, tracking applications and keeping every follow-up and next action in one place.",
    contribution:
      "Designed, built, tested and deployed end to end, including its approved Chrome extension.",
    outcome: "Live product · Public demo available",
    size: "large",
    media: {
      kind: "video",
      src: "/projects/job-application-tracker/demonstration.mp4",
      label: "Job Application Tracker interface preview",
    },
    tools: [
      { name: "C#", icon: TbBrandCSharp },
      { name: ".NET 10", icon: SiDotnet },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Azure", icon: TbBrandAzure },
      { name: "Chrome", icon: SiGooglechrome },
    ],
  },
  {
    slug: "windows-support-toolkit",
    label: "Support engineering · Public",
    title: "Windows Support Diagnostic Toolkit",
    description:
      "A read-only diagnostic workflow that collects Windows evidence and turns it into clear, testable support findings.",
    contribution:
      "Built the collector, validation contract, failure-safe evaluation and browser dashboard.",
    outcome: "Safe diagnostic evidence verified",
    size: "standard",
    media: {
      kind: "video",
      src: "/projects/windows-support-toolkit/demonstration.mp4",
      label: "Windows Support Diagnostic Toolkit interface preview",
    },
    tools: [
      { name: "PowerShell", icon: TbBrandPowershell },
      { name: "Python", icon: SiPython },
      { name: "QA", icon: FaBug },
    ],
  },
  {
    slug: "concise-digital-work",
    label: "Commercial experience · Internship",
    title: "Web Development & QA Work",
    description:
      "Selected implementation, CMS and quality-assurance work completed across real client websites and existing systems.",
    contribution:
      "Delivered WordPress changes, reusable web components and reproducible bug reports within a team workflow.",
    outcome: "Client work implemented and tested",
    size: "standard",
    media: {
      kind: "image",
      src: "/projects/concise-digital-work/report-cover.png",
      alt: "Cover of the sanitised web quality-assurance report",
    },
    tools: [
      { name: "WordPress", icon: SiWordpress },
      { name: "Git", icon: SiGit },
      { name: "QA", icon: FaBug },
    ],
  },
  {
    slug: "jira-service-management",
    label: "Service-management simulation · Public",
    title: "Jira Service Management Simulation",
    description:
      "A fictional service desk that demonstrates structured intake, approvals, SLA monitoring and support communication.",
    contribution:
      "Designed the request pathways, workflow states, approval logic and evidence-led support journey.",
    outcome: "12-slide workflow case study",
    size: "wide",
    media: {
      kind: "image",
      src: "/projects/jira-service-management/slides/slide-1.png",
      alt: "Opening slide of the Jira Service Management simulation case study",
    },
    tools: [
      { name: "Jira", icon: SiJira },
      { name: "Workflows", icon: FaDiagramProject },
      { name: "SLAs", icon: FaClock },
    ],
  },
];

function ProjectMedia({ project }: { project: FeaturedProject }) {
  if (project.media.kind === "video") {
    return (
      <video
        className={styles.projectVideo}
        src={project.media.src}
        aria-label={project.media.label}
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
      src={project.media.src}
      alt={project.media.alt}
      fill
      unoptimized
      sizes="(max-width: 760px) 92vw, 46vw"
    />
  );
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  const sizeClass =
    project.size === "large"
      ? styles.projectCardLarge
      : project.size === "wide"
        ? styles.projectCardWide
        : "";

  return (
    <a className={`${styles.projectCard} ${sizeClass}`}
      href={`/projects/${project.slug}/`}
      aria-label={`View ${project.title} case study`}
    >
      <div className={styles.projectMedia}>
        <ProjectMedia project={project} />
        <span className={styles.projectOpen} aria-hidden="true">
          ↗
        </span>
      </div>
      <div className={styles.projectBody}>
        <p className={styles.projectLabel}>{project.label}</p>
        <h3>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        <p className={styles.projectContribution}>{project.contribution}</p>
        <div className={styles.projectFooter}>
          <ul aria-label={`${project.title} primary technologies`}>
            {project.tools.map(({ name, icon: ToolIcon }) => (
              <li key={name} title={name}>
                <ToolIcon aria-hidden="true" />
                <span>{name}</span>
              </li>
            ))}
          </ul>
          <span>{project.outcome}</span>
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
            <span aria-disabled="true" title="Diary will be added in Milestone 7">
              Diary
            </span>
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
              <p className={styles.heroName}>{person.name}</p>
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
              Four selected projects showing how I build, investigate, test and support software.
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
            <OutsideIdeStack imageSrc={person.profileImage} />
          </section>
        ) : null}

        {contact.github ? (
          <section className={styles.githubSection} aria-labelledby="github-activity-title">
            <div className={styles.sectionIntroduction}>
              <div>
                <p>GitHub activity</p>
                <h2 id="github-activity-title">Recent work, shown honestly.</h2>
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
                <span className={styles.contactActionIcon}>
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
                <span className={styles.contactActionIcon}>
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
                <span className={styles.contactActionIcon}>
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
                <span className={styles.contactActionIcon}>
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
