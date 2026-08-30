/* eslint-disable @next/next/no-html-link-for-pages -- standard navigation avoids a vinext prefetch runtime error in static hosting */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PdfViewer,
  PendingProjectMedia,
  ProjectVideo,
  SlideViewer,
} from "@/app/components/ProjectMedia";
import { ProjectStack } from "@/app/components/ProjectStack";
import { ProjectJourney } from "@/app/components/ProjectJourney";
import { RepositoryLink } from "@/app/components/RepositoryLink";
import {
  getProjectCaseStudy,
  projectCaseStudies,
  type ProjectCaseStudy,
} from "@/app/data/projectCaseStudies";
import { portfolio } from "@/app/data/portfolio";
import styles from "./project-version-two.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projectCaseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const project = portfolio.projects.find((item) => item.id === slug);
  const caseStudy = getProjectCaseStudy(slug);

  if (!project || !caseStudy) return {};

  const socialImage =
    caseStudy.media.kind === "slides"
      ? caseStudy.media.slides[0]
      : caseStudy.media.kind === "pdf"
        ? caseStudy.media.coverSrc
        : null;

  return {
    title: `${project.title} | CHIT THWAY`,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: {
      title: `${project.title} | CHIT THWAY`,
      description: project.summary,
      type: "article",
      images: socialImage ? [{ url: socialImage, alt: project.title }] : [],
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: `${project.title} | CHIT THWAY`,
      description: project.summary,
      images: socialImage ? [socialImage] : [],
    },
  };
}

function ProjectHeader() {
  return (
    <header className="project-page-header section-shell">
      <a href="/" className="project-page-wordmark" aria-label="CHIT THWAY portfolio home">
        CHIT THWAY
      </a>
      <nav aria-label="Project page navigation">
        <a href="/#projects">Projects</a>
        {portfolio.contact.email ? <a href={`mailto:${portfolio.contact.email}`}>Contact</a> : null}
      </nav>
    </header>
  );
}

function ProjectFacts({ caseStudy }: { caseStudy: ProjectCaseStudy }) {
  return (
    <dl className="case-facts">
      {caseStudy.facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectActions({ caseStudy }: { caseStudy: ProjectCaseStudy }) {
  if (!caseStudy.actions?.length) return null;

  return (
    <div className="case-actions" aria-label="Project links and release status">
      {caseStudy.actions.map((action) =>
        action.href ? (
          <a key={action.label} href={action.href} target="_blank" rel="noreferrer">
            <span>{action.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span key={action.label} className="case-action-status" aria-disabled="true">
            <span>{action.label}</span>
            <span aria-hidden="true">●</span>
          </span>
        ),
      )}
    </div>
  );
}

function StandardHero({
  caseStudy,
  project,
}: {
  caseStudy: ProjectCaseStudy;
  project: (typeof portfolio.projects)[number];
}) {
  return (
    <section className="case-hero">
      <a href="/#projects" className="back-link">
        <span aria-hidden="true">←</span> Projects
      </a>
      <div className="case-hero-grid">
        <div className="case-hero-copy">
          <p className="eyebrow">{caseStudy.eyebrow}</p>
          <h1>{project.title}</h1>
          <p className="case-introduction">{caseStudy.introduction}</p>
        </div>
        <div className="case-hero-aside">
          {project.links[0] ? (
            <RepositoryLink href={project.links[0].href} className="case-title-repository" />
          ) : null}
          <ProjectActions caseStudy={caseStudy} />
          <ProjectFacts caseStudy={caseStudy} />
        </div>
      </div>
    </section>
  );
}

function CaseStudyDetails({
  caseStudy,
  project,
}: {
  caseStudy: ProjectCaseStudy;
  project: (typeof portfolio.projects)[number];
}) {
  return (
    <div className="case-content">
      <section className="case-overview" aria-labelledby="overview-title">
        <div className="case-overview-main">
          <div className="case-overview-heading">
            <p className="case-section-label">Overview / 01</p>
            <h2 id="overview-title">What the project demonstrates</h2>
          </div>
          <div className="case-overview-copy">
            {caseStudy.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <aside aria-label="Project role and employer relevance">
          <div>
            <span>My contribution</span>
            <p>{project.contribution}</p>
          </div>
          <div>
            <span>Why it matters</span>
            <p>{project.employerSignal}</p>
          </div>
        </aside>
      </section>

      {caseStudy.setup ? (
        <section className="case-setup" aria-labelledby="setup-title">
          <div className="case-section-heading">
            <p className="case-section-label">Try it / 02</p>
            <h2 id="setup-title">A simple first run</h2>
            <p>{caseStudy.setup.introduction}</p>
          </div>
          <div className="case-requirements">
            <span>You will need</span>
            <ul>
              {caseStudy.setup.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </div>
          <ol className="setup-steps">
            {caseStudy.setup.steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                  {step.command ? <pre><code>{step.command}</code></pre> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="case-decisions" aria-labelledby="decisions-title">
        <div className="case-section-heading">
          <p className="case-section-label">Thinking / {caseStudy.setup ? "03" : "02"}</p>
          <h2 id="decisions-title">Decisions behind the work</h2>
        </div>
        <div className="decision-grid">
          {caseStudy.decisions.map((decision, index) => (
            <article key={decision.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{decision.title}</h3>
              <p>{decision.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="case-capabilities" aria-labelledby="capabilities-title">
        <div>
          <p className="case-section-label">Evidence / {caseStudy.setup ? "04" : "03"}</p>
          <h2 id="capabilities-title">Skills and capabilities</h2>
        </div>
        <ul className="case-highlight-list">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <ul className="technology-list" aria-label="Technologies and methods">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </section>

      {caseStudy.note ? <p className="case-note">{caseStudy.note}</p> : null}
    </div>
  );
}

function CompanionCaseStudy({ companion }: { companion: NonNullable<ProjectCaseStudy["companion"]> }) {
  return (
    <section className="case-companion" aria-labelledby="companion-case-title">
      <div className="case-section-heading">
        <p className="case-section-label">{companion.eyebrow}</p>
        <h2 id="companion-case-title">{companion.title}</h2>
        <p>{companion.introduction}</p>
      </div>
      <SlideViewer {...companion.media} />
    </section>
  );
}

function ProjectPagination({ slug }: { slug: string }) {
  const availableProjects = projectCaseStudies.filter((item) => item.media.kind !== "pending");
  const currentIndex = availableProjects.findIndex((item) => item.slug === slug);
  const index = currentIndex >= 0 ? currentIndex : 0;
  const previous = availableProjects[(index - 1 + availableProjects.length) % availableProjects.length];
  const next = availableProjects[(index + 1) % availableProjects.length];
  const previousProject = portfolio.projects.find((item) => item.id === previous.slug);
  const nextProject = portfolio.projects.find((item) => item.id === next.slug);

  return (
    <nav className="project-pagination" aria-label="Other projects">
      <a href={`/projects/${previous.slug}/`}>
        <span>← Previous project</span>
        <strong>{previousProject?.title}</strong>
      </a>
      <a href={`/projects/${next.slug}/`}>
        <span>Next project →</span>
        <strong>{nextProject?.title}</strong>
      </a>
    </nav>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await Promise.resolve(params);
  const caseStudy = getProjectCaseStudy(slug);
  const project = portfolio.projects.find((item) => item.id === slug);

  if (!caseStudy || !project) notFound();

  const pdfMedia = caseStudy.media.kind === "pdf" ? caseStudy.media : null;

  return (
    <div className={styles.caseSite} data-portfolio-version="2">
      <ProjectHeader />
      <main className="project-page section-shell">
        <ProjectPagination slug={slug} />
        {pdfMedia ? (
          <section className="pdf-case-hero">
            <div className="pdf-case-copy">
              <a href="/#projects" className="back-link">
                <span aria-hidden="true">←</span> Projects
              </a>
              <p className="eyebrow">{caseStudy.eyebrow}</p>
              <h1>{project.title}</h1>
              <p className="case-introduction">{caseStudy.introduction}</p>
              <ProjectFacts caseStudy={caseStudy} />
            </div>
            <PdfViewer
              src={pdfMedia.src}
              coverSrc={pdfMedia.coverSrc}
              pages={pdfMedia.pages}
              label={pdfMedia.label}
            />
          </section>
        ) : (
          <>
            {caseStudy.media.kind === "video" ? (
              <ProjectVideo {...caseStudy.media} />
            ) : caseStudy.media.kind === "slides" ? (
              <SlideViewer {...caseStudy.media} />
            ) : caseStudy.media.kind === "pending" ? (
              <PendingProjectMedia label={caseStudy.media.label} message={caseStudy.media.message} />
            ) : null}
            <StandardHero caseStudy={caseStudy} project={project} />
          </>
        )}

        {caseStudy.journey ? (
          <ProjectJourney projectTitle={project.title} journey={caseStudy.journey} />
        ) : null}

        {caseStudy.companion ? <CompanionCaseStudy companion={caseStudy.companion} /> : null}

        {caseStudy.stack ? (
          <ProjectStack projectTitle={project.title} stack={caseStudy.stack} />
        ) : null}

        <CaseStudyDetails caseStudy={caseStudy} project={project} />
      </main>
      <footer className="project-page-footer section-shell">
        <span>CHIT THWAY</span>
        <a href="/">Return to portfolio ↑</a>
      </footer>
    </div>
  );
}
