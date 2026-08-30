// Single source of truth for all site content (PRD §6).
// Components render from this module — no copy is hardcoded in layouts/components.
// Facts must match the resume/PRD exactly. Never invent metrics, testimonials, or companies.

export type NavItem = { label: string; href: string };

export type SkillGroup = {
  category: string;
  items: string[];
};

export type JourneyNode = {
  era: string;
  title: string;
  body: string;
  weight: "normal" | "emphasis";
};

export type Artwork = {
  src: string;
  alt: string;
};

export type Certification = {
  name: string;
  issuer: string;
  validity: string;
  credentialId: string;
  verifyUrl: string | null;
};

export type SiteContent = {
  name: string;
  domain: string;
  email: string;
  location: string;
  links: { github: string; linkedin: string };
  resumePath: string;
  nav: NavItem[];
  hero: {
    positioning: string;
    stack: string[];
    ctas: { primary: NavItem; secondary: NavItem };
  };
  about: string[];
  med: {
    name: string;
    shortName: string;
    status: string;
    framing: string;
    description: string;
    architecture: { label: string; detail: string }[];
    stack: string[];
    repoUrl: string;
    articleUrl: string | null;
  };
  secondaryProjects: {
    name: string;
    description: string;
    repoUrl: string;
  }[];
  skills: SkillGroup[];
  journey: {
    intro: string[];
    nodes: JourneyNode[];
    artwork: Artwork[];
    cta: { label: string; href: string };
  };
  education: {
    degree: string;
    school: string;
    period: string;
  };
  certifications: Certification[];
};

export const site: SiteContent = {
  name: "Arvind Ramachandran",
  domain: "arvindramachandran.tech",
  email: "arvind@arvindramachandran.tech",
  location: "Chennai, Tamil Nadu — open to Startup & GCC roles",

  // Phone number deliberately excluded from the public site (decision logged in build-log Session 0; lives on the resume PDF only).
  links: {
    github: "https://github.com/arvindram27",
    linkedin: "https://www.linkedin.com/in/arvindramachandran-r",
  },

  // TODO(AR): replace the placeholder at public/resume.pdf with the real current resume (Module 8).
  resumePath: "/resume.pdf",

  nav: [
    { label: "Work", href: "#work" },
    { label: "Projects", href: "#projects" },
    { label: "Journey", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    positioning:
      "Data Engineer building production-grade financial intelligence systems — self-taught, project-proven.",
    stack: ["Python", "SQL", "Databricks", "AWS", "LangGraph"],
    ctas: {
      primary: { label: "View MED", href: "#work" },
      secondary: { label: "Resume", href: "/resume.pdf" },
    },
  },

  about: [
    "Self-taught Data Engineer transitioning from a Mechanical Engineering background (B.Tech, Saveetha Engineering College, 2017) through focused self-study and hands-on project work. Working primarily in Python, SQL, Databricks, and AWS, with growing depth in applied GenAI and agentic systems.",
    "Currently building MED, a multi-agent financial intelligence system, as a proof-of-skill anchor. Based in Chennai, targeting Data/Analytics/Applied AI Engineering roles — FinTech & AI sector primarily, Startup & GCC roles in Chennai/Hyderabad/Bengaluru as a near-term step.",
  ],

  med: {
    name: "MED — Market Efficiency Detector",
    shortName: "MED",
    status: "In progress — building in public",
    framing: "VIX measures fear. PAL measures fragility.",
    description:
      "A multi-agent financial intelligence system that detects market pricing anomalies via PAL (Price Anomaly Locator), a proprietary metric for market fragility.",
    architecture: [
      { label: "LangGraph", detail: "agent orchestration" },
      { label: "Kafka", detail: "streaming ingestion" },
      { label: "Databricks Lakehouse", detail: "Delta Lake" },
      { label: "Mosaic AI / RAG", detail: "intelligence layer" },
    ],
    stack: [
      "LangGraph",
      "Kafka",
      "Databricks",
      "Delta Lake",
      "Snowflake",
      "FastAPI",
      "Streamlit",
      "Prometheus",
    ],
    // TODO(AR): point to the actual MED repository URL once public; resolves to the GitHub profile until then.
    repoUrl: "https://github.com/arvindram27",
    // TODO(AR): slot for the Medium deep-dive article (the center of gravity of the positioning strategy). Link stays hidden until published.
    articleUrl: null,
  },

  secondaryProjects: [
    {
      name: "Multi-Agent Market Intelligence System",
      description:
        "Distributed multi-agent system automating market research, data ingestion, and trend analysis; fault-tolerant ingestion pipelines.",
      repoUrl: "https://github.com/arvindram27/multi-agent-market-intelligence",
    },
  ],

  skills: [
    { category: "Languages", items: ["Python", "SQL"] },
    {
      category: "Data Platform",
      items: [
        "Databricks (Lakehouse, Unity Catalog, Delta Lake, DLT/Lakeflow)",
        "PySpark",
        "dimensional modeling",
      ],
    },
    {
      category: "Orchestration & Transformation",
      items: ["dbt", "Databricks Workflows", "Airflow", "Kafka"],
    },
    { category: "Cloud", items: ["AWS (S3, Glue, Athena, IAM)"] },
    {
      category: "Applied GenAI",
      items: ["LangGraph", "LangChain", "RAG", "vector search", "Mosaic AI", "MCP"],
    },
    {
      category: "Tools",
      items: ["Git/GitHub", "CI/CD", "FastAPI", "Streamlit", "Prometheus", "pandas"],
    },
  ],

  journey: {
    intro: [
      "From a mechanical engineering degree and years of competitive-exam preparation to building a multi-agent market intelligence system — a nine-year arc of self-directed pivots. The short version: capital-markets curiosity, one pivotal book, generative-art experiments, and a deepening focus on AI agents, all converging in MED.",
    ],
    nodes: [
      {
        era: "2017",
        title: "Graduation",
        body: "Mechanical engineering degree in hand. Next: Civil Services, RBI Grade B, SEBI Grade A.",
        weight: "normal",
      },
      {
        era: "2017–2025",
        title: "An interest takes root",
        body: "Eight years preparing for those exams meant living inside the Indian economy — budgets, monetary policy, capital markets. The exams didn't work out. The interest never left.",
        weight: "normal",
      },
      {
        era: "The pivot",
        title: "The Dip",
        body: "A Kindle from my sister brought reading back. Seth Godin's <em>The Dip</em> asked one question I couldn't shake: push through, or is this quietly a dead end? I had my answer.",
        weight: "normal",
      },
      {
        era: "Experiments",
        title: "Generative art",
        body: "The pivot started visually. Months inside Midjourney — learning to think in prompts, how these models compose, iterate, surprise.",
        weight: "normal",
      },
      {
        era: "Under the hood",
        title: "From using AI to understanding it",
        body: "Curiosity shifted from what generative tools make to how they work. LLMs, agents, orchestration. Data and AI engineering entered the picture.",
        weight: "emphasis",
      },
      {
        era: "Now",
        title: "MED — Market Efficiency Detector",
        body: "Two threads converge: capital markets from the exam years, agents from the curiosity years. MED detects market fragility — built in public, one module at a time.",
        weight: "normal",
      },
    ],
    artwork: [
      {
        src: "/journey/journey-art-1.jpg",
        alt: "Midjourney artwork — a monumental white figure with a red head between two red panels, presiding over a gathered crowd",
      },
      {
        src: "/journey/journey-art-2.jpg",
        alt: "Midjourney artwork — a black dragon-like phoenix entwined with orange flame, ink illustration style",
      },
      {
        src: "/journey/journey-art-3.jpg",
        alt: "Midjourney artwork — a village with church spires rising through morning mist",
      },
    ],
    cta: { label: "View MED", href: "#work" },
  },

  education: {
    degree: "B.E./B.Tech Mechanical Engineering",
    school: "Saveetha Engineering College",
    period: "2013 – 2017",
  },

  certifications: [
    {
      name: "SnowPro Associate: Platform",
      issuer: "Snowflake",
      validity: "Jan 2026 – Jan 2028",
      credentialId: "S132356-260124-SOL",
      // TODO(AR): add the Credly verification URL once confirmed.
      verifyUrl: null,
    },
  ],
};
