import { projects } from "./projects";

// Project definitions live in app/data/projects; this module remains the entry point
// for portfolio-wide profile, experience, skills, and education content.
export type {
  HomeProjectPresentation,
  HomeProjectTool,
  PortfolioLink,
  Project,
} from "./projects/types";

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
    profileImage: "/chit-thway-portrait.jpg?v=14019d07" as string | null,
    bioImage: "/about/chit-thway-bio.png?v=20260909" as string | null,
  },
  contact: {
    email: "chitthway67@gmail.com" as string | null,
    linkedin: "https://www.linkedin.com/in/chit-thway-197241332" as string | null,
    github: "https://github.com/Chit-Thway" as string | null,
    resume: "/chit-thway-resume.pdf" as string | null,
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
  projects,
  experience: [
    {
      role: "Banquets and Events Waitperson",
      organisation: "Crown Events and Conferences",
      period: "January 2023 – Present" as string | null,
      summary:
        "Developed a grounded understanding of customer impact by communicating with guests and colleagues, following service procedures and handling competing priorities in live event environments.",
      strengths: ["Customer service", "Team communication", "Prioritisation"],
    },
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
