# CHIT THWAY - Portfolio V1

A single-page professional portfolio for graduate and entry-level roles in application support, product support, technical support, QA, IT service delivery and web support.

The site uses React 19, TypeScript, vinext and Vite. It is designed as a static, responsive portfolio with no backend and no fake contact form.

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

The Windows Support Diagnostic Toolkit and Jira Service Management Simulation link to their verified public repositories. Quick-Fire Questions and the Job Application Tracker are labelled as private repositories and intentionally have no repository action.

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
  components/MobileNavigation.tsx  Accessible mobile navigation
  data/portfolio.ts                Central portfolio content and links
  globals.css                      Complete responsive visual system
  layout.tsx                       Metadata, social sharing and viewport settings
  page.tsx                         Single-page semantic portfolio
public/
  chit-thway-portrait.jpg          Current profile photograph
  og.png                           Bespoke social sharing card
tests/
  rendered-html.test.mjs           Production HTML checks
```

## Accessibility and responsive behaviour

The site includes semantic landmarks, keyboard-visible focus states, a skip link, accessible mobile navigation, high-contrast text, responsive layouts and reduced-motion handling through `prefers-reduced-motion`.

## Version 2 boundary

Version 1 intentionally does not include individual project routes. Version 2 can extend the existing project data into dedicated case-study pages with demonstration videos, specifications, technical decisions, screenshots, diagrams, reports and downloadable PDFs.

## Deployment

The project is prepared for static hosting, but Version 1 has deliberately not been deployed. Review the local build and add a public resume PDF before publishing.
