import { MarkGithubIcon } from "@primer/octicons-react";
import styles from "./RepositoryLink.module.css";

type RepositoryLinkProps = {
  href: string;
  className?: string;
};

export function RepositoryLink({ href, className = "" }: RepositoryLinkProps) {
  return (
    <a
      className={`${styles.button} ${className}`.trim()}
      data-repository-link="true"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <MarkGithubIcon className={styles.githubMark} size={24} aria-hidden="true" />
      <span>View repository</span>
      <span className={styles.arrow} aria-hidden="true">↗</span>
    </a>
  );
}
