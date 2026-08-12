import Image from "next/image";
import { MobileNavigation } from "./components/MobileNavigation";
import { portfolio } from "./data/portfolio";

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="section-number">/{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof portfolio.projects)[number] }) {
  return (
    <article className={`project-card ${project.featured ? "project-featured" : ""}`}>
      <div className="project-topline">
        <span className="project-number">PROJECT / {project.number}</span>
        <span className="status-pill">
          <span className="status-dot" aria-hidden="true" />
          {project.status}
        </span>
      </div>
      <div className="project-main">
        <div className="project-intro">
          <p className="project-category">{project.category}</p>
          <h3>{project.title}</h3>
          <p className="project-summary">{project.summary}</p>
        </div>
        <div className="project-details">
          <div>
            <p className="detail-label">My contribution</p>
            <p>{project.contribution}</p>
          </div>
          <div className="employer-signal">
            <p className="detail-label">What this demonstrates</p>
            <p>{project.employerSignal}</p>
          </div>
        </div>
      </div>
      <ul className="project-highlights" aria-label={`${project.title} highlights`}>
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <div className="project-footer">
        <ul className="technology-list" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        {project.links.length > 0 ? (
          <div className="project-actions">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  const { person, contact } = portfolio;
  const contactLinks = [
    contact.email
      ? { label: "Email", href: `mailto:${contact.email}`, value: contact.email }
      : null,
    contact.linkedin
      ? { label: "LinkedIn", href: contact.linkedin, value: "Connect on LinkedIn" }
      : null,
    contact.github
      ? { label: "GitHub", href: contact.github, value: "View GitHub profile" }
      : null,
  ].filter((link): link is { label: string; href: string; value: string } => Boolean(link));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: "Computer Science Graduate",
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
    ...(contact.linkedin || contact.github
      ? { sameAs: [contact.linkedin, contact.github].filter(Boolean) }
      : {}),
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label={`${person.name}, home`}>
            <span className="wordmark-mark">CT</span>
            <span className="wordmark-name">{person.name}</span>
          </a>
          <nav className="desktop-navigation" aria-label="Primary navigation">
            {portfolio.navigation.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <MobileNavigation links={portfolio.navigation} />
        </div>
      </header>

      <main id="main-content">
        <section className="hero section-shell" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="availability-line">
              <span className="pulse-dot" aria-hidden="true" />
              <span>{person.availability}</span>
            </div>
            <p className="hero-kicker">Computer Science Graduate · Perth / WA</p>
            <h1 id="hero-title">
              <span>{person.name}</span>
              Support-minded.<br />
              <em>Curious by default.</em>
            </h1>
            <p className="professional-heading">{person.heading}</p>
            <p className="hero-intro">{person.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View my work <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-secondary" href="#contact">
                Contact me
              </a>
              {contact.resume ? (
                <a className="text-link" href={contact.resume} download>
                  Download résumé <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
            <div className="hero-meta">
              <span>Based in</span>
              <strong>{person.location}</strong>
            </div>
          </div>

          <div className="portrait-composition" aria-label="Profile photograph placeholder">
            <div className="portrait-coordinate portrait-coordinate-top">31.9523° S</div>
            <div className="portrait-frame">
              <div className="portrait-grid" aria-hidden="true" />
              {person.profileImage ? (
                <Image
                  className="profile-image"
                  src={person.profileImage}
                  alt={`Portrait of ${person.name}`}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 760px) 82vw, 38vw"
                />
              ) : (
                <div className="portrait-placeholder" aria-hidden="true">
                  <span>{person.initials}</span>
                  <div className="portrait-silhouette">
                    <i />
                    <b />
                  </div>
                  <small>Portrait / forthcoming</small>
                </div>
              )}
            </div>
            <div className="portrait-note">
              <span className="note-line" aria-hidden="true" />
              <p>
                <strong>Focus / 01</strong>
                Application & product support
              </p>
            </div>
            <div className="portrait-coordinate portrait-coordinate-bottom">115.8613° E</div>
          </div>
        </section>

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <SectionHeading
            number="01"
            eyebrow="About me"
            title="Where technical thinking meets the user’s reality."
          />
          <div className="about-grid">
            <div className="about-copy" id="about-title">
              {portfolio.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <aside className="approach-panel" aria-labelledby="approach-title">
              <div className="panel-heading">
                <span>SUPPORT LOOP</span>
                <h3 id="approach-title">How I approach a problem</h3>
              </div>
              <ol>
                {portfolio.approach.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="projects section-shell" id="projects" aria-labelledby="projects-title">
          <SectionHeading
            number="02"
            eyebrow="Selected work"
            title="Built to understand, test and improve systems."
            description="Support engineering leads the collection, followed by service management, collaborative software, creative prototyping and real client web work."
          />
          <div className="project-grid" id="projects-title">
            {portfolio.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <p className="project-footnote">
            Detailed case studies, demonstrations and verified project links are planned for Version 2.
          </p>
        </section>

        <section
          className="experience section-shell"
          id="experience"
          aria-labelledby="experience-title"
        >
          <SectionHeading
            number="03"
            eyebrow="Experience"
            title="Technical care, process discipline and customer perspective."
          />
          <div className="experience-list" id="experience-title">
            {portfolio.experience.map((item, index) => (
              <article className="experience-item" key={item.organisation}>
                <div className="experience-index">0{index + 1}</div>
                <div className="experience-role">
                  <p>{item.organisation}</p>
                  <h3>{item.role}</h3>
                  {item.period ? <span className="experience-period">{item.period}</span> : null}
                </div>
                <div className="experience-summary">
                  <p>{item.summary}</p>
                  <ul>
                    {item.strengths.map((strength) => (
                      <li key={strength}>{strength}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="skills section-shell" id="skills" aria-labelledby="skills-title">
          <SectionHeading
            number="04"
            eyebrow="Capabilities"
            title="A practical toolkit for support, quality and delivery."
          />
          <div className="skills-grid" id="skills-title">
            {portfolio.skillGroups.map((group, index) => (
              <article className="skill-group" key={group.title}>
                <div className="skill-heading">
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                  </div>
                </div>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          className="education section-shell"
          id="education"
          aria-labelledby="education-title"
        >
          <SectionHeading
            number="05"
            eyebrow="Education"
            title="Computer science, applied beyond the classroom."
          />
          <article className="education-card" id="education-title">
            <div className="education-year">
              <span>COMPLETION</span>
              <strong>{portfolio.education.completion}</strong>
            </div>
            <div className="education-main">
              <p>{portfolio.education.institution}</p>
              <h3>{portfolio.education.qualification}</h3>
              <span className="education-period">{portfolio.education.period}</span>
              <p className="education-note">{portfolio.education.note}</p>
            </div>
            <div className="education-mark">
              <Image
                className="education-logo"
                src="/uwa-logo.png"
                alt="The University of Western Australia crest"
                width={400}
                height={410}
                unoptimized
                sizes="(max-width: 760px) 7rem, 8rem"
              />
            </div>
          </article>
          {portfolio.certificates.length > 0 ? (
            <div className="certificate-grid" aria-label="Certificates and achievements">
              {portfolio.certificates.map((certificate) => {
                const content = (
                  <>
                    <span>{certificate.year ?? "Verified"}</span>
                    <strong>{certificate.title}</strong>
                    <p>{certificate.issuer}</p>
                  </>
                );

                return certificate.href ? (
                  <a
                    key={certificate.title}
                    className="certificate-card"
                    href={certificate.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <article key={certificate.title} className="certificate-card">
                    {content}
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
          <div className="contact-panel">
            <div className="contact-signal" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="eyebrow">Start a conversation</p>
            <h2 id="contact-title">
              Looking for someone who enjoys getting to the bottom of things?
            </h2>
            <p>
              I’m interested in graduate and entry-level opportunities across application support,
              product support, technical support, QA and web support in Perth.
            </p>
            {contactLinks.length > 0 ? (
              <div className="contact-links">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span>{link.label}</span>
                    <strong>{link.value}</strong>
                    <i aria-hidden="true">↗</i>
                  </a>
                ))}
              </div>
            ) : (
              <p className="contact-pending">
                Verified email, LinkedIn and GitHub links will be added before publication.
              </p>
            )}
            {contact.resume ? (
              <a className="button button-primary contact-resume" href={contact.resume} download>
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-wordmark">CT / {new Date().getFullYear()}</div>
        <p>Designed around curiosity, clarity and practical support.</p>
        <a href="#home">Back to top ↑</a>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
