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

export type ArchitectureStep = {
  label: string;
  detail: string;
};

export type ArchitecturePlane = {
  label: string;
  note: string;
  steps: ArchitectureStep[];
};

export type Certification = {
  name: string;
  issuer: string;
  validity: string;
  credentialId: string;
  verifyUrl: string | null;
};

export type ContactConfig = {
  title: string;
  endpoint: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  noscriptNote: string;
  nameMaxLength: number;
  emailMaxLength: number;
  messageMaxLength: number;
  honeypotField: string;
  whatsappHref: string | null;
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
    now: string;
    ctas: { primary: NavItem };
    socials: { name: string; href: string; icon: "github" | "linkedin" }[];
  };
  about: string[];
  med: {
    name: string;
    shortName: string;
    status: string;
    framing: string;
    description: string[];
    architecture: {
      live: ArchitecturePlane;
      research: ArchitecturePlane;
      bridge: string;
    };
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
  contact: ContactConfig;
  footer: {
    builtWith: string;
    deployedOn: string;
  };
};

// Canonical external links — single source; hero socials and the future footer render from these.
export const links = {
  github: "https://github.com/arvindram27",
  linkedin: "https://www.linkedin.com/in/arvind-ramachandran-r",
} as const;

export const site: SiteContent = {
  name: "Arvind Ramachandran",
  domain: "arvindramachandran.tech",
  email: "arvind@arvindramachandran.tech",
  location: "Chennai · open to Data, Analytics & Applied AI roles",

  // Phone number deliberately excluded from the public site (decision logged in build-log Session 0; lives on the resume PDF only).
  links: { ...links },

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
      "Data engineer. I build systems that measure how fast markets react to news.",
    stack: ["Python", "SQL", "Databricks", "Airflow", "AWS", "LangGraph"],
    now: "Shipping MED v2 · the signal layer is next",
    ctas: {
      primary: { label: "View MED", href: "#work" },
    },
    socials: [
      { name: "GitHub", href: links.github, icon: "github" },
      { name: "LinkedIn", href: links.linkedin, icon: "linkedin" },
    ],
  },

  about: [
    "Self-taught data engineer, formerly mechanical. I work in Python, SQL, Databricks and AWS, and I keep going deeper on applied AI: agents, RAG and vector search.",
    "I build in public. My main project is MED, a system that measures how long markets take to respond to news. Based in Chennai, targeting Data, Analytics or Applied AI roles, FinTech and AI first, startups and GCCs in Chennai, Hyderabad or Bengaluru.",
  ],

  med: {
    name: "MED: Market Efficiency Detector",
    shortName: "MED",
    status:
      "In flight: v2 (live dual-agent system) ships now · v2.5 signal layer next",
    framing: "VIX measures fear. PAL measures how long the market takes to react.",
    description: [
      "MED measures Price Adjustment Latency (PAL): the gap between news hitting the market and price fully reflecting it. Then it asks whether that window is tradeable after costs.",
      "Two planes. A live Kafka path detects events and emits signals inside a five second latency budget. A nightly Airflow path recomputes, backtests on Databricks and reconciles the two against each other.",
      "Every result is reported gross and net of a full transaction cost model, tested walk forward with purging and embargo, and benchmarked against random entry. An edge that costs fully erase is a finding, not a failure.",
    ],
    architecture: {
      live: {
        label: "Live plane",
        note: "≤ 5s latency budget",
        steps: [
          { label: "Kafka / Redpanda", detail: "event ingestion" },
          { label: "LangGraph agents", detail: "Statistician + Contextualist" },
          { label: "Decision Maker", detail: "signal" },
          { label: "Paper-trading blotter", detail: "simulated" },
        ],
      },
      research: {
        label: "Research plane",
        note: "nightly · reconciled daily",
        steps: [
          { label: "Airflow", detail: "nightly orchestration" },
          { label: "Databricks", detail: "backtest · retrain" },
          { label: "Snowflake", detail: "results" },
        ],
      },
      bridge: "The research plane reconciles daily against the live plane.",
    },
    stack: [
      "Python",
      "SQL",
      "LangGraph",
      "Apache Airflow",
      "Databricks",
      "Apache Kafka (Redpanda)",
      "Snowflake",
      "dbt",
      "AWS",
      "FastAPI",
      "Streamlit",
      "Prometheus/Grafana",
      "MLflow",
    ],
    repoUrl: "https://github.com/arvindram27/market-efficiency-detector",
    // TODO(AR): slot for the Medium deep-dive article (the center of gravity of the positioning strategy). Link stays hidden until published.
    articleUrl: null,
  },

  secondaryProjects: [
    {
      name: "Multi-Agent Market Intelligence System",
      description:
        "Automates market research and data ingestion: cleaning, trend analysis, and pipelines that keep running when a step fails.",
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
      "From a mechanical engineering degree and eight years of exam prep to building market software. The short version: a capital markets curiosity that never left, then AI agents, ending at MED.",
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
        body: "Eight years preparing for those exams meant living inside the Indian economy: budgets, monetary policy, capital markets. The exams didn't work out. The interest never left.",
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
        body: "The pivot started visually. Months inside Midjourney, learning to think in prompts, how these models compose, iterate, surprise.",
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
        title: "MED: Market Efficiency Detector",
        body: "Two threads converge: capital markets from the exam years, agents from the curiosity years. MED measures how long the market takes to react, built in public, one module at a time.",
        weight: "normal",
      },
    ],
    artwork: [
      {
        src: "/journey/journey-art-1.jpg",
        alt: "Midjourney artwork: a monumental white figure with a red head between two red panels, presiding over a gathered crowd",
      },
      {
        src: "/journey/journey-art-2.jpg",
        alt: "Midjourney artwork: a black dragon-like phoenix entwined with orange flame, ink illustration style",
      },
      {
        src: "/journey/journey-art-3.jpg",
        alt: "Midjourney artwork: a village with church spires rising through morning mist",
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

  contact: {
    title: "Come, Say Hi! 👋",
    endpoint: "/api/contact",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    successMessage:
      "Thanks for reaching out. I've got your message, and you'll hear back from me directly.",
    errorMessage:
      "The message didn't send. Try again, or use one of the links above.",
    noscriptNote: "This form needs JavaScript to send. Please email me directly instead.",
    nameMaxLength: 120,
    emailMaxLength: 254,
    messageMaxLength: 2000,
    honeypotField: "company",
    whatsappHref: "https://wa.me/917358742925",
  },

  footer: {
    builtWith: "Astro",
    deployedOn: "Cloudflare Workers",
  },
};
