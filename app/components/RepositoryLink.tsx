import { MarkGithubIcon } from "@primer/octicons-react";

type RepositoryLinkProps = {
  href: string;
  className?: string;
};

export function RepositoryLink({ href, className = "" }: RepositoryLinkProps) {
  return (
    <a
      className={`repository-button ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <MarkGithubIcon className="github-mark" size={24} aria-hidden="true" />
      <span>View repository</span>
      <span className="repository-arrow" aria-hidden="true">↗</span>
    </a>
  );
}
