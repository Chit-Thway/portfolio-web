# CHIT THWAY — Portfolio

A single-page professional portfolio for graduate and entry-level roles in application support, product support, technical support, QA, IT service delivery and web support.

The site uses React 19, TypeScript, vinext and Vite. It is designed as a static, responsive portfolio with no backend and no fake contact form.

## Version branches

- `main` is the deployed Version 1 site.
- `version-1` preserves the Version 1 source as an explicit archive branch.
- `version-2` is the stable base for the redesign while it is reviewed locally.
- Milestones are developed on branches named `version-2-milestone-*` before they are reviewed and merged into `version-2`.

The Version 2 redesign is not deployed automatically. See [the Version 2 roadmap](docs/version-2-roadmap.md) for the design principles, milestone boundaries and current status.

## Prerequisites

- Node.js `>=22.13.0`
- npm

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local address printed by the development server. By default this is:

```text
http://localhost:3000/
```

## Quality checks

```bash
npm run lint
npm run build
npm test
```

`npm test` performs a production build and checks the server-rendered HTML for the main portfolio content, required section destinations, structured data and invalid placeholder links.

## Editing portfolio content

All personal details, navigation items, about copy, projects, experience, skills, education and optional certificates are centralised in:

```text
app/data/portfolio.ts
```

### Contact details

The verified email, LinkedIn and GitHub profile are already configured in the `contact` object. The resume value remains empty until a privacy-safe public copy is supplied:

```ts
contact: {
  email: "chitthway67@gmail.com",
  linkedin: "https://www.linkedin.com/in/chit-thway-197241332",
  github: "https://github.com/Chit-Thway",
  resume: null,
}
```

To enable the resume buttons, place the public PDF in `public/` and set `resume` to its root-relative path. The buttons remain hidden while the value is empty.

### Profile photograph

The supplied portrait is stored at:

```text
public/chit-thway-portrait.jpg
```

It is connected through `person.profileImage` in `app/data/portfolio.ts`. Replace that single file with another image of the same name to update the portrait without changing code. A portrait crop close to a 4:5 ratio works best.

### Experience dates

The employment date ranges are populated from the supplied resume. Each range is stored in the relevant `period` value in `app/data/portfolio.ts`.

### Project links and visibility

The Windows Support Diagnostic Toolkit and Jira Service Management Simulation link to their verified public repositories. Quick-Fire Questions and the Job Application Tracker keep their private repositories unlinked; the Job Application Tracker case study instead links to its deployed application and public synthetic demo.

Each project supports a `status` and a `links` array:

```ts
links: [
  { label: "View repository", href: "https://github.com/verified-path" },
],
```

Empty project action areas are hidden. Do not add `#` placeholder links.

### Certificates and achievements

The `certificates` array in `app/data/portfolio.ts` is intentionally empty. Add verified entries there and the certificate area will appear automatically:

```ts
certificates: [
  {
    title: "Verified certificate title",
    issuer: "Verified issuer",
    year: "2026",
    href: "https://verified-credential-url",
  },
],
```

## Main project structure

```text
app/
  components/                       Shared navigation and media viewers
  components/AboutDirectory.tsx    Version 2 keyboard-accessible profile directory
  components/OutsideIdeStack.tsx   Version 2 click-to-cycle personal-interest stack
  components/GitHubActivity.tsx    Live, failure-safe recent public GitHub activity
  components/TechnologyMarquee.tsx Version 2 accessible three-row technology marquee
  data/portfolio.ts                Central portfolio content and links
  data/projectCaseStudies.ts       Project-page narratives and media mapping
  globals.css                      Complete responsive visual system
  layout.tsx                       Metadata, social sharing and viewport settings
  page.tsx                         Portfolio homepage
  version-two.module.css           Scoped Version 2 visual system
  projects/[slug]/page.tsx         Dedicated project case studies
  projects/[slug]/project-version-two.module.css  Scoped Version 2 case-study styles
public/
  chit-thway-portrait.jpg          Current profile photograph
  og.png                           Bespoke social sharing card
  projects/                        Project videos, slides, deck and QA report
tests/
  rendered-html.test.mjs           Production HTML checks
```

## Accessibility and responsive behaviour

The site includes semantic landmarks, keyboard-visible focus states, a skip link, accessible mobile navigation, high-contrast text, responsive layouts and reduced-motion handling through `prefers-reduced-motion`. The presentation viewer supports buttons, arrow keys and touch swipes, while the QA document opens in an in-page dialog with a direct PDF fallback.

## Project case studies

Every homepage project links to its own case-study route. The Windows toolkit and Job Tracker use embedded demonstrations, the service-management project includes a 12-slide presentation viewer, the QA sample includes an in-page PDF reader, and Quick-Fire Questions is clearly marked as in progress until verified public material is ready.

## Deployment

The portfolio is publicly deployed with Cloudflare Pages:

```text
https://chitthway-portfolio.pages.dev
```

Create the static Pages output with `npm run build:pages`, then deploy the generated `dist/client` directory to the `chitthway-portfolio` Cloudflare Pages project.
