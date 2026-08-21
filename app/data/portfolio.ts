export type PortfolioLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  contribution: string;
  employerSignal: string;
  technologies: string[];
  highlights: string[];
  links: PortfolioLink[];
  featured?: boolean;
};

export const portfolio = {
  person: {
    name: "CHIT THWAY",
    initials: "CT",
    heading:
      "Computer Science Graduate | Application Support | Technical Support | QA & Web Support",
    location: "Perth, Western Australia",
    availability: "Open to graduate & entry-level opportunities",
    intro:
      "I investigate how systems work, turn unclear problems into practical next steps, and care about making technology easier for people to use.",
    profileImage: "/chit-thway-portrait.jpg?v=49cf7aef" as string | null,
  },
  contact: {
    email: "chitthway67@gmail.com" as string | null,
    linkedin: "https://www.linkedin.com/in/chit-thway-197241332" as string | null,
    github: "https://github.com/Chit-Thway" as string | null,
    resume: null as string | null,
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],
  about: [
    "I am a Computer Science graduate in Perth with a particular interest in the work that happens between software, systems and the people who rely on them. I enjoy tracing problems to their source, testing assumptions, documenting what I find and helping others move forward with confidence.",
    "My experience spans support-focused tooling, QA and exploratory testing, web development, service-management workflows and creative software projects. That variety has taught me to learn unfamiliar systems quickly, communicate with both technical and non-technical people, and keep the user’s perspective visible while solving a problem.",
    "I am looking to grow into advanced Application Support, Product Support or a related technical-support role where curiosity, calm troubleshooting and thoughtful communication all matter.",
  ],
  approach: [
    {
      number: "01",
      title: "Investigate",
      text: "Reproduce the issue, gather useful evidence and separate symptoms from causes.",
    },
    {
      number: "02",
      title: "Validate",
      text: "Test expected, partial and failure states so the answer holds up outside the happy path.",
    },
    {
      number: "03",
      title: "Communicate",
      text: "Translate technical findings into clear, practical next steps for the person affected.",
    },
  ],
  projects: [
    {
      id: "windows-support-toolkit",
      number: "01",
      title: "Windows Support Diagnostic Toolkit",
      category: "Support engineering",
      status: "Active · Public repository",
      summary:
        "A safe diagnostic workflow that gathers Windows system information, validates structured reports and presents system health in a clear Python dashboard.",
      contribution:
        "Built a read-only PowerShell collector, a JSON report contract and validation flow, test fixtures for healthy and failure states, and a dashboard designed to make investigation easier. The work also included correcting memory-value overflow and tightening privacy, safety and validation behaviour.",
      employerSignal:
        "Demonstrates methodical troubleshooting, defensive engineering, test design and the ability to present technical evidence clearly without creating additional risk for a user.",
      technologies: [
        "PowerShell",
        "Python",
        "JSON",
        "Schema validation",
        "Safety testing",
      ],
      highlights: [
        "Read-only collection by design",
        "Healthy, malformed, partial and problem fixtures",
        "Privacy and failure hardening",
      ],
      links: [
        {
          label: "View repository",
          href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit",
        },
      ],
      featured: true,
    },
    {
      id: "jira-service-management",
      number: "02",
      title: "Jira Service Management Simulation",
      category: "IT service management",
      status: "Completed · Public repository",
      summary:
        "A practical service-desk environment designed around the way employees request access, hardware, software and onboarding support.",
      contribution:
        "Designed the customer portal, request types, custom fields and approval paths, then explored SLA thinking and automation for consistent handling of common requests.",
      employerSignal:
        "Shows an understanding of support queues, user-friendly intake, approvals, repeatable processes and the operational thinking behind effective service delivery.",
      technologies: ["Jira Service Management", "Workflows", "SLAs", "Automation"],
      highlights: [
        "New-employee onboarding request",
        "Access, hardware and software pathways",
        "Approval-aware workflows",
      ],
      links: [
        {
          label: "View repository",
          href: "https://github.com/Chit-Thway/kestrel-ridge-jira-service-desk",
        },
      ],
    },
    {
      id: "quick-fire-questions",
      number: "03",
      title: "Quick-Fire Questions",
      category: "Collaborative software project",
      status: "Collaborative · Private repository",
      summary:
        "A multiplayer Roblox experience built around rapid question rounds, time pressure and unique-answer validation.",
      contribution:
        "Contributed to timer-based rounds, client/server behaviour, interface work and validation logic within a branch-based team workflow. The project was tested with two clients to check multiplayer behaviour.",
      employerSignal:
        "Demonstrates collaborative development, shared source control, test-minded multiplayer work and the care needed when behaviour crosses client and server boundaries.",
      technologies: ["Roblox Studio", "Lua", "Rojo", "GitHub"],
      highlights: [
        "Unique-answer validation",
        "Two-client behaviour testing",
        "Branch-based collaboration",
      ],
      links: [],
    },
    {
      id: "job-application-tracker",
      number: "04",
      title: "Job Application Tracker",
      category: "Production full-stack application",
      status: "Live · QA in progress",
      summary:
        "A production-deployed job-search management platform for capturing opportunities, tracking application progress, planning follow-ups and preserving important applications. Built with ASP.NET Core, PostgreSQL, Azure and a companion Chrome extension.",
      contribution:
        "As Solo Product Architect and Full-Stack Engineer, architected and delivered the application across secure identity, private user data, deterministic job capture, workflow management, retention automation, administration and production deployment.",
      employerSignal:
        "Demonstrates end-to-end product ownership, security-aware full-stack engineering, operational deployment and the ability to turn a complex personal workflow into a tested production service.",
      technologies: [
        "C# / .NET 10",
        "ASP.NET Core MVC",
        "PostgreSQL",
        "Azure",
        "GitHub Actions",
        "Chrome Manifest V3",
      ],
      highlights: [
        "Private user-owned data and secure identity",
        "Deterministic multi-source job capture",
        "200+ automated tests and production monitoring",
      ],
      links: [],
    },
    {
      id: "concise-digital-work",
      number: "05",
      title: "Selected Internship Web & QA Work",
      category: "Real client environments",
      status: "Internship work",
      summary:
        "Selected web-development and quality-assurance work completed as part of a team at Concise Digital across education, events, cleaning services and e-commerce clients.",
      contribution:
        "Contributed to Newington College pages, the Early Music Collective About page and event-card system, and MCO Cleaning WordPress content, carousel and booking-form functionality. Also tested Accessory Archive and documented issues for follow-up.",
      employerSignal:
        "Demonstrates care with client requirements, CMS work, quality checking, issue documentation and delivering changes within existing websites rather than greenfield code alone.",
      technologies: ["WordPress", "HTML", "CSS", "JavaScript", "Manual QA"],
      highlights: [
        "Client website implementation",
        "CMS and booking-form work",
        "Documented QA findings",
      ],
      links: [],
    },
  ] satisfies Project[],
  experience: [
    {
      role: "Web Development and Quality Assurance Intern",
      organisation: "Concise Digital",
      period: "April 2026 – June 2026" as string | null,
      summary:
        "Contributed to client website pages, reusable content components, WordPress functionality and QA testing. Worked within established sites and communicated findings so issues could be understood and actioned.",
      strengths: ["Client delivery", "Quality checking", "Issue documentation"],
    },
    {
      role: "Training and Learning Design Intern",
      organisation: "4LifeSkills",
      period: "November 2025 – December 2025" as string | null,
      summary:
        "Worked with organisational policies and procedures, building experience in structured documentation, careful review and working within defined requirements.",
      strengths: ["Documentation", "Process awareness", "Attention to detail"],
    },
    {
      role: "Banquets and Events Waitperson",
      organisation: "Crown Events and Conferences",
      period: "January 2023 – Present" as string | null,
      summary:
        "Developed a grounded understanding of customer impact by communicating with guests and colleagues, following service procedures and handling competing priorities in live event environments.",
      strengths: ["Customer service", "Team communication", "Prioritisation"],
    },
  ],
  skillGroups: [
    {
      title: "Support & QA",
      description: "Finding, reproducing and explaining issues clearly.",
      skills: [
        "Troubleshooting",
        "Manual & exploratory testing",
        "Bug reproduction & reporting",
        "Test cases",
        "Regression testing",
        "JSON & schema validation",
      ],
    },
    {
      title: "Programming",
      description: "Building tools and understanding application behaviour.",
      skills: [
        "PowerShell",
        "Python",
        "Java",
        "SQL",
        "JavaScript",
        "C#",
        ".NET 10",
        "ASP.NET Core MVC",
        "Luau",
      ],
    },
    {
      title: "Web & CMS",
      description: "Working effectively in both custom and managed websites.",
      skills: ["HTML", "CSS", "WordPress", "Responsive web development"],
    },
    {
      title: "Tools & platforms",
      description: "Moving confidently between development and support systems.",
      skills: [
        "Git & GitHub",
        "GitHub Actions",
        "Jira Service Management",
        "Roblox Studio",
        "Rojo",
        "Microsoft 365",
      ],
    },
    {
      title: "Collaboration",
      description: "Keeping people, context and practical outcomes connected.",
      skills: [
        "Technical documentation",
        "Customer service",
        "Clear communication",
        "Team workflows",
      ],
    },
  ],
  education: {
    qualification: "Bachelor of Science (Computer Science)",
    institution: "The University of Western Australia",
    completion: "July 2026",
    period: "March 2022 – July 2026",
    note:
      "A broad computing foundation supported by hands-on work across software development, web systems, testing and collaborative technical projects.",
  },
  certificates: [] as Array<{
    title: string;
    issuer: string;
    year?: string;
    href?: string;
  }>,
};
