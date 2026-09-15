export type Audience = "Professionals" | "Youth" | "Juniors";
export type Program = {
  id: string;
  title: string;
  audience: Audience;
  genderEligibility: string;
  age: string;
  level: string;
  freeOrPaid: "FREE" | "PAID · PRICE TBA" | "DETAILS TBA";
  duration: string;
  sessions: string;
  language: string;
  format: string;
  schedule: string;
  tracks: string[];
  curriculum: string[];
  skills: string[];
  outcomes: string;
  partners: string[];
  location: string;
  status: string;
  applyURL: string | null;
  lastUpdated: string;
  headline: string;
  color: string;
};
const base = {
  genderEligibility: "All",
  age: "Details TBA",
  level: "Beginner-friendly",
  freeOrPaid: "PAID · PRICE TBA" as const,
  duration: "Details TBA",
  sessions: "Details TBA",
  language: "Details TBA",
  format: "In-person",
  schedule: "Details TBA",
  tracks: [],
  skills: [],
  partners: [],
  location: "Kuwait",
  status: "Check current availability with CODED",
  applyURL: null,
  lastUpdated: "2026-09-15",
};
export const programs: Program[] = [
  {
    ...base,
    id: "agentic-ai",
    title: "Agentic AI",
    audience: "Professionals",
    headline: "Stop prompting.\nStart delegating.",
    color: "#ff6435",
    curriculum: ["DATA", "AGENT", "TOOLS", "MEMORY", "APPROVAL", "ACTION"],
    outcomes: "Build working AI systems, agents and automated workflows.",
    applyURL: "https://coded.kw/bootcamps/agentic-ai",
  },
  {
    ...base,
    id: "ai-app",
    title: "AI App Developer",
    audience: "Professionals",
    headline: "Idea →\nlive product.",
    color: "#8680db",
    curriculum: [
      "PROBLEM",
      "USER",
      "UI",
      "API",
      "DATABASE",
      "AUTH",
      "ANALYTICS",
      "DEPLOY",
    ],
    outcomes: "Build and launch a functional AI-powered application.",
  },
  {
    ...base,
    id: "cyber",
    title: "Cybersecurity",
    audience: "Professionals",
    headline: "Think like an attacker.\nBuild like a defender.",
    color: "#648f72",
    curriculum: ["FOUNDATIONS", "INVESTIGATE", "BLOCK", "ISOLATE"],
    outcomes:
      "Learn offensive and defensive cybersecurity through hands-on practice.",
  },
  {
    ...base,
    id: "data",
    title: "AI & Data Science",
    audience: "Professionals",
    headline: "Don’t just use AI.\nBuild it.",
    color: "#7393ba",
    curriculum: [
      "PYTHON",
      "CLEAN",
      "EXPLORE",
      "VISUALIZE",
      "TRAIN",
      "ML",
      "DEEP LEARNING",
      "GENAI",
      "AGENTS",
      "DEPLOY",
    ],
    outcomes: "Build an end-to-end AI solution.",
    applyURL: "https://coded.kw/bootcamps/data-science",
  },
  {
    ...base,
    id: "kuwait-codes",
    title: "Kuwait Codes",
    audience: "Youth",
    age: "High school · Ages 14–18",
    freeOrPaid: "FREE",
    headline: "Kuwait’s next\ngeneration builds.",
    color: "#648f72",
    tracks: ["Python with AI", "Web with AI", "Cybersecurity"],
    curriculum: ["CODE", "RUN", "BUILD"],
    outcomes: "Turn code and AI into something real.",
  },
  {
    ...base,
    id: "unicode",
    title: "UniCODE",
    audience: "Youth",
    age: "University + fresh graduates",
    headline: "Build something\nyou can show.",
    color: "#9b81c9",
    curriculum: [
      "PICK TRACK",
      "LEARN",
      "BUILD",
      "DEBUG",
      "GITHUB",
      "DEPLOY",
      "DEMO",
    ],
    outcomes:
      "Bridge university and real tech work with a project you can show.",
    tracks: ["Current cohort tracks: details TBA"],
  },
  {
    ...base,
    id: "academy-x",
    title: "Academy X",
    audience: "Youth",
    genderEligibility: "Girls only",
    age: "High school + university",
    freeOrPaid: "FREE",
    headline: "Design it. Build it.\nPitch it.",
    color: "#ddad45",
    curriculum: [
      "PROBLEM",
      "DESIGN",
      "AI",
      "BRAND",
      "MARKETING",
      "BUSINESS",
      "PROTOTYPE",
      "PITCH",
    ],
    outcomes:
      "Explore design, AI, marketing and entrepreneurship through teamwork.",
  },
  ...["Holiday Camps", "Creative Workshops", "After School"].map(
    (title, i): Program => ({
      ...base,
      id: ["camps", "workshops", "after-school"][i],
      title,
      audience: "Juniors",
      age: "Eligibility varies by active program",
      freeOrPaid: "DETAILS TBA",
      headline: "Big ideas.\nSmall beginnings.",
      color: "#ddad45",
      curriculum: ["LOGIC", "CODE", "PLAY", "CREATE"],
      outcomes:
        "Learn technology through play: coding, games, AI, circuits and creative making.",
    }),
  ),
];
export const audiences: Audience[] = ["Professionals", "Youth", "Juniors"];
export const findProgram = (id: string) => programs.find((p) => p.id === id)!;
