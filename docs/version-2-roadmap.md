# Portfolio Version 2 roadmap

Version 2 is a staged redesign of CHIT THWAY's public portfolio. Its purpose is to make the strongest evidence easier for employers to scan while replacing the darker developer-themed presentation with a clean, restrained interface.

The live site remains on `main` until the redesign has been reviewed locally and approved for release.

## Design principles

- Lead with application support, troubleshooting and software-quality work.
- Keep copy concise and connect claims to evidence.
- Use a light, laptop-friendly visual system with strong typography and generous spacing.
- Preserve semantic HTML, keyboard support, visible focus states and reduced-motion behaviour.
- Use only verified personal information and user-supplied media. Do not source or invent personal imagery.
- Keep incomplete features out of primary navigation until they are ready.

## Branch model

| Branch | Purpose |
| --- | --- |
| `main` | Current deployed Version 1 portfolio |
| `version-1` | Preserved Version 1 source |
| `version-2` | Reviewed Version 2 baseline |
| `version-2-milestone-*` | Isolated work for one Version 2 milestone |

Milestone branches are reviewed locally before they are merged into `version-2`. Version 2 is not merged into `main` or deployed until the redesign is approved as a whole.

## Milestones

### Milestone 0 — Branch safety and visual foundation

Status: complete

- Preserve Version 1.
- Establish the Version 2 branch and scoped light-theme design tokens.
- Keep live deployment unchanged.

### Milestone 1 — First-screen positioning and featured evidence

Status: complete

- Introduce CHIT THWAY's professional direction, location and availability.
- Keep Projects, Experience and Diary as the restrained primary navigation.
- Present the Job Application Tracker, Windows Support Diagnostic Toolkit and internship work as the first three pieces of evidence.

### Milestone 2 — Interactive About directory

Status: complete on `version-2-milestone-2-about`

- Add a clean macOS-inspired content window after the introduction.
- Provide concise `bio.md`, `education.md` and `location.md` views.
- Reuse the supplied portrait and UWA logo; do not add unapproved personal imagery.
- Support mouse, touch and keyboard tab navigation.

### Milestone 3 — Project presentation

Status: complete on `version-2-milestone-3-projects`

- Refine the project grid and expand the transition into detailed case studies.
- Keep technology labels selective and connect them to evidence.
- Present Jira as clearly labelled secondary simulation evidence.
- Keep unfinished work available by direct route without promoting it through normal browsing.

### Milestone 4 — Experience and technologies

Status: complete on `version-2-milestone-4-experience`

- Add a present-first experience timeline.
- Add a restrained three-row technology marquee with reduced-motion support.

### Milestone 5 — Outside the IDE

Status: complete with temporary media on `version-2-milestone-5-outside-ide`

- Present four personal interests through a click-to-cycle image stack.
- Use only images supplied and approved by CHIT THWAY.

### Milestone 6 — GitHub activity and contact

Status: complete on `version-2-milestone-6-contact`

- Add an accurate GitHub activity view.
- Finish with direct résumé, email, LinkedIn and contact actions.

### Milestone 7 — Diary

Status: deferred

- Build a public, Instagram-like media diary.
- Keep the publishing interface behind an unlisted authenticated login route.
- Add database and media-storage support only when this milestone begins.

## Milestone 2 implementation notes

The About directory is a client-side tab interface within the server-rendered homepage. Its initial `bio.md` content remains visible in rendered HTML, while the other entries are available without navigating away from the page. The tab controls follow the ARIA tab pattern and support arrow, Home and End keys.

No new personal facts or images were introduced. Profile content is sourced from `app/data/portfolio.ts`; the visual assets are the existing portrait and UWA logo in `public/`.

## Milestone 3 implementation notes

The homepage now presents four selected case studies. The first three remain the strongest evidence; the Jira Service Management work appears as a full-width secondary card and is explicitly described as a simulation. Quick-Fire Questions retains its honest direct case-study route but is excluded from the homepage and previous/next project navigation until verified media is ready.

Detailed case studies use a scoped Version 2 stylesheet so the redesign does not alter the preserved Version 1 branch. Existing video, slide, PDF and caption behaviour remains intact. Project pages also provide a working email action and use project-specific social images when an existing slide or document cover is available.

## Milestone 4 implementation notes

The experience timeline uses only the résumé-sourced roles and dates already stored in `app/data/portfolio.ts`. It starts with the current customer-facing role, then presents the two internships without inventing locations, outcomes or metrics.

The technology marquee groups verified tools by professional activity instead of presenting an undifferentiated logo wall. Its rows move right, left and right at a restrained pace, include an explicit pause control and become static when a visitor prefers reduced motion. The duplicated visual items used for the loop are hidden from assistive technology.

## Milestone 5 implementation notes

The Outside the IDE section uses one keyboard-accessible stack that cycles through Gym, Gaming, Going out and Eating out. Its data structure can accept additional interests later without changing the interaction.

CHIT THWAY explicitly approved the existing profile portrait as temporary media for all four cards. Each card is visibly labelled `Temporary image`; no personal photos or activities were invented. The placeholders will be replaced after approved interest-specific media is supplied.

## Milestone 6 implementation notes

The GitHub panel makes one client-side request to GitHub's official public-events endpoint and presents a 30-day snapshot of development-related public activity. It is not labelled as a contribution graph: private work, older contributions and commit totals are not estimated. The panel has loading, empty and unavailable states, and the GitHub profile remains the source of truth.

The contact section exposes the verified email, LinkedIn, GitHub and résumé destinations stored in `app/data/portfolio.ts`. The approved public résumé is available from both the first-screen actions and final contact section. Its editable source is retained as `docs/chit-thway-resume-public.docx`, while the browser-download copy is `public/chit-thway-resume.pdf`.

The public résumé removes the mobile number, accepts any tracked revisions, strips reviewer comments and scrubs author/revision metadata. The remaining general Perth location, email and professional links are intentional public contact information. The Word source and exported PDF were rendered as a single page and checked for clipping, overlap and privacy regressions before being added.
